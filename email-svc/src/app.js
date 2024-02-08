
require('dotenv').config()
const express = require('express');


const emailRoutes = require('./routes/mail.route')

const app = express();


app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json(
  {
    limit: '50mb'  }
));

app.use('/email', emailRoutes);

const port = process.env.PORT || 3000;

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message? error.message : 'message';
    const errors = error.errors;
    res.status(status).json({ message: message, errors: errors });
  });
 

  app.listen(port, () => {
    console.log('Server is up and running in port 8081')
  })
