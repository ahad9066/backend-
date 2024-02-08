require('dotenv').config();


try {
    require('./processors/email.processor');

    console.log('worker running')
} catch (e) {
   console.log('error while starting worker', e)
    process.exit(1);
}
