'use strict'
const express = require("express");
// const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
let exphbs  = require('express-handlebars');
const bodyparser = require('body-parser');
const app = express();
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());
mongoose.connect(
  "mongodb+srv://admin:80Cd6957@cluster0-3njq6.mongodb.net/quotesdb?retryWrites=true", 
  { 
    useNewUrlParser: true
  }, (err)=>{
  if(!err){
    console.log('database connected');
  }else{
    console.log('error in database connection: '+ err);
  }
});
require('./modules/quotes_schema.js');
// app.use(morgan("dev"));

const quotesController = require('./controllers/quotes_controllers')(app);
app.set('views', path.join(__dirname, '/views/'));
app.use(express.static(__dirname + '/views/assets/'));
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'mainLayout',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running`);
});
