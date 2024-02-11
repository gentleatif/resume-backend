const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
require('dotenv').config();
// parse application/x-www-form-urlencoded
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// mongodb connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@cluster0.o0zy1.mongodb.net/resumeDB`
  )
  .then(() => console.log('DB CONNECTED'));
// model for customers
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },

  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
});
const Customer = mongoose.model('Customer', customerSchema);

app.get('/', (req, res) => {
  res.send('Resume Backend');
});

app.post('/customer', async (req, res) => {
  const { email, subject, message, name } = req.body;
  console.log(req.body);
  const newContact = new Customer(req.body);

  // send mail

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL,
      pass: process.env.MAIL_PWD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: email, // sender address
    to: process.env.MAIL, // list of receivers
    subject: subject, // Subject line
    html: `
    <div>
    <h1>Sender Name ${name} </h1>
    <b>${message}</b>
    </div>
   `, // html body
  });
  console.log('info===>', info);

  newContact.save(function (err) {
    if (err) return handleError(err);
    res.status(200).send('Customer saved successfully');
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
