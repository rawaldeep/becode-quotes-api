const mongoose = require('mongoose');
const quotes_schema = mongoose.model("quotes");

module.exports = app =>{
    // app.get('/*', function(req, res, next){ 
    //     res.setHeader('Last-Modified', (new Date()).toUTCString());
    //     next(); 
    //   });
app.get('/', (req, res, next) => {
quotes_schema.find((err, doc) =>{
    let randomQuote = Math.floor(Math.random()*doc.length);
    if(!err){
        res.render('quotes/random', {
            viewTitle : "Random Quotes",
            quote: doc[randomQuote].quote,
            author: doc[randomQuote].author
        });
    }else{
        res.json({"error in retrieving data: ": err});
    }
})
       
});
app.get('/quotes', (req, res, next) => {
        res.render('quotes/update', {
            viewTitle : "Add Quotes"
        });
});
app.get('/list', (req, res, next) => {
    quotes_schema.find()
    .exec()
    .then(doc =>{
        res.status(200).render('quotes/list', {
            viewTitle : "All Quotes",
            list: doc
        });
    })
    .catch(err =>{
         res.status(500).json({ 
             message:"error in retrieving data: "+ err
    });
});
    
});
app.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    quotes_schema.findByIdAndRemove(id)
    .then(res.redirect('/list'))
    .catch( err =>{
        res.status(500).json({err});
    });
});//app get
app.get('/:id', (req, res, next) => {
    const id = req.params.id;
    quotes_schema.findById(id)
    .exec()
    .then(doc =>{
            res.status(200).render('quotes/update.hbs', {
                viewTitle : "Update Quote",
                quotes: doc
            });
        })
    .catch(err => {
        res.status(404).json({message: 'does not exist'})
        res.status(500).json({message: "error in retrieving data: "+ err});
    });
    
});//app get

app.post('/quotes', (req, res, next) => {
    if(req.body._id == ''){
        insertData(req, res);
    }else{
        updateData(req, res);
    }
});

const insertData = (req, res) =>{
    let quote = new quotes_schema();
    quote.quote = req.body.quote;
    quote.author = req.body.author;
    quote.save((err, doc)=>{
        if(!err){
            res.redirect('/list');
        }else{
            if(err.name == "ValidationError"){
                handleValidationError(err, req.body);
                res.render('quotes/update', {
                    viewTitle: 'Add Quotes',
                    quotes: req.body
                })
            }else{
                res.json({'Error during record insertion: ' : err});
            }
        }
    });
}
const updateData = (req, res) =>{
    quotes_schema.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc)=>{
        if(!err){res.redirect('/list');}
        else{
            if(err.name == "ValidationError"){
                handleValidationError(err, req.body);
                res.render('quotes/update', {
                    viewTitle: 'Update Quotes',
                    quotes: req.body
                })
            }else{
                res.json({'ERROR during record update: ': err});
            }
        }
    });
}

 const handleValidationError = (err, body) =>{
     for(let i in err.errors){
         switch(err.errors[i].path){
             case 'quote':
             body['quoteError'] = err.errors[i].message;
             break;
             case 'author':
             body['authorError'] = err.errors[i].message;
             break;
             default:
             break;
         }
     }
 }

}


    