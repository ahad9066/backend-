const puppeteer = require('puppeteer');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const base64img = require('base64-img');

// Function to generate the invoice HTML from template and data
function generateInvoiceHTML(data) {
    // Load the HTML template file
    const directoryPath = __dirname;
    const templatePath = path.join(directoryPath, 'templates/invoiceTemplate.html');

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    handlebars.registerHelper('calculateTotal', function (price, quantity) {
        // const formattedAmount = amount.toFixed(2);

        // Add currency symbol, comma separators, etc., as needed
        return `$${price * quantity.toFixed(2)}`;
        // return price * quantity;
    });
    handlebars.registerHelper('formatCurrency', function (amount, options) {
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
            if (!isNaN(amount)) {
                const formattedAmount = amount.toFixed(2);
                return `$${formattedAmount}`;
            }
        } else if (typeof amount === 'number') {
            const formattedAmount = amount.toFixed(2);
            return `$${formattedAmount}`;
        } else {
            return amount;
        }
    });
    // Compile the template
    const template = handlebars.compile(templateContent);

    // Generate HTML with the data
    return template(data);
}

module.exports = async function generateInvoicePDF(data) {
    try {
        data.img_src = base64img.base64Sync(path.join(__dirname, 'templates/assets/logo.png'));
        // Launch Puppeteer browser
        // const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            executablePath:
                process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
        });
        const page = await browser.newPage();
        // Generate HTML content
        const htmlContent = generateInvoiceHTML(data);
        // Set HTML content of the page
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({ format: 'A4' });

        // Close Puppeteer browser
        await browser.close();
        const directoryPath = __dirname;
        const templatePath = path.join(directoryPath, `invoices/${data.orderId}.pdf`);
        fs.writeFileSync(templatePath, pdfBuffer);
        return {
            pdfBuffer: pdfBuffer,
            templatePath: templatePath,
            fileName: data.orderId + '.pdf'
        };
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

// Sample data for the invoice
const invoiceData = {
    company: {
        name: 'Your Company',
        address: '123 Main Street, City, Country',
        phone: '123-456-7890',
        logo: 'your_company_logo.png'
    },
    customer: {
        name: 'Customer Name',
        address: 'Customer Address',
        city: 'Customer City',
        country: 'Customer Country',
        email: 'customer@example.com',
        phone: '123-456-7890'
    },
    items: [
        { name: 'Item 1', description: 'Description of Item 1', quantity: 2, price: 10 },
        { name: 'Item 2', description: 'Description of Item 2', quantity: 1, price: 20 },
    ],
    subtotal: 40,
    taxRate: 10,
    tax: 4,
    total: 44
};


