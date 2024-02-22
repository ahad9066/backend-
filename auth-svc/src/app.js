const mongoose = require('mongoose');
require('dotenv').config()
const express = require('express');
const cors = require('cors');


const userRoutes = require('./routes/user.route')
const addressRoutes = require('./routes/address.route')
const authRoutes = require('./routes/auth.route')
const employeeRoutes = require('./routes/employee.route')

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', userRoutes)
app.use('/address', addressRoutes)
app.use('/auth', authRoutes)
app.use('/employee', employeeRoutes)

app.use((error, req, res, next) => {
    console.log('error handler', error)
    const status = error.statusCode ? error.statusCode : error.message.statusCode ? error.message.statusCode : 500;
    const message = error.message ? error.message : 'message';
    const errors = error.errors;
    res.status(status).json({ message: message, errors: errors });
});

const port = process.env.PORT || 8080;
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

