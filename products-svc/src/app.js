const mongoose = require('mongoose');
require('dotenv').config()
const express = require('express');
const cors = require('cors');


const feTiRoutes = require('./routes/feTi.route')
const cartRoutes = require('./routes/cart.route')
const orderRoutes = require('./routes/order.route')

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/feTi', feTiRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)


app.use((error, req, res, next) => {
    console.log('error handler', error)
    const status = error.statusCode ? error.statusCode : error.message.statusCode ? error.message.statusCode : 500;
    const message = error.message ? error.message : 'message';
    const errors = error.errors;
    res.status(status).json({ message: message, errors: errors });
});

const port = process.env.PORT || 8081;
mongoose
    .connect(
        'mongodb+srv://admin:admin123@cluster0.mqbmnge.mongodb.net/?retryWrites=true&w=majority'
    )
    .then(result => {
        console.log(`im here in port ${port} trying to start`)
        return app.listen(port);
    })
    .then(() => {
        console.log('Server is up and running...')
    })
    .catch(err => console.log(err));

