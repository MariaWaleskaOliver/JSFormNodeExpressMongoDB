
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {check, validationResult} =  require ("express-validator");

mongoose.connect('mongodb://localhost:27017/Assignment4' , {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
let Product = mongoose.model('Product', {
    name: String,
    email : String,
    phone: String,
    address :String,
    city : String,
    postCode : String,
    province : String,
    diapers : Number,
    wipes : Number,
    shirt : Number,
    formula : Number,
    subTotal:Number,
    tax : Number,
    total: Number
})
var myApp = express();
myApp.use(bodyParser.urlencoded({extended:false}));
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');
let phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/
let checkRegex =  function (patttern , input){
    if(patttern.test(input))
    {
        return true
    }
}
let custumPhoneValidation = function(val)
    {
        if(!checkRegex(phoneRegex, val)){
            throw new Error ("Phone is not valid")
        }
        return true
    };
myApp.get('/', function(req, res){
    res.render('form'); 
});
myApp.post('/', [
check("name", "Name canot be empty").notEmpty(),
check("email", "Email canot be empty").notEmpty(),
check("address", "Please input your address ").notEmpty(),
check("province", "Please choose a province").notEmpty(),
check("city", "Please choose a city").notEmpty(),
check("phone").custom(custumPhoneValidation),
check("postCode", "PostCode canot be empty").notEmpty(),
check("email", "Must be an email").isEmail(),

],function(req, res){
    let errors = validationResult(req)
    
    if(!errors.isEmpty()){
        res.render("form", {
            errors:errors.array()
        })
        return
    } 
    else {

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var postCode = req.body.postCode;
    var province = req.body.province;
    var diapers = req.body.diapers;
    var wipes = req.body.wipes;
    var formula = req.body.formula;
    var shirt = req.body.shirt;   
    var tax = 0.10; 
    var subTotal = (diapers * 10) + (wipes * 20) + (formula * 30) + (shirt * 40);
    var taxAmount = subTotal * tax ;
    var total  = subTotal + taxAmount;

    var pageData = {
        name : name,
        email : email,
        phone : phone,
        address : address,
        city : city,
        postCode: postCode,
        province : province,
        diapers : diapers,
        wipes : wipes,
        shirt : shirt,
        formula : formula,
        subTotal : subTotal,
        tax : tax,
        total : total,
   };
  
   let product = new Product(pageData)
   product.save().then(()=> {
       res.render("form", pageData)
   })
}
});

myApp.get("/allorders", (req, res) => {
    Product.find({}).exec((err, prods) => {
        if(prods) {
            res.render('allorders', {
                products: prods
            })
        }
        else{
            res.render('allorders', {
                products: []
            })
        }
    })
})



myApp.listen(8080);
console.log('Running website at port 8080!!');




