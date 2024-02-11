const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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

app.post('/customer', (req, res) => {
  console.log(req.body);
  const newContact = new Customer(req.body);
  newContact.save(function (err) {
    if (err) return handleError(err);
    res.status(200).send('Customer saved successfully');
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
