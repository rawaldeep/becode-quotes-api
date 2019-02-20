const mongoose = require("mongoose");
const quotesSchema = new mongoose.Schema({
    quote: {
     type: String,
     required: "Enter a Quote."
    },
    author: {
        type: String,
        required: "Who is the author?"
       }
  });

 let modal = mongoose.model('quotes', quotesSchema);
 module.exports = modal;
