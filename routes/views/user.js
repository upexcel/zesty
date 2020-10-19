const { nextTick } = require('async');
let jwt = require('jsonwebtoken');
let keystone = require('keystone');
let users = keystone.list('User');
let carts = keystone.list('Cart');
let dishes = keystone.list('Dishes');
let allergens = keystone.list('Allergens');
let availability = keystone.list('Availability');
let days = keystone.list('Days');
const nodemailer = require("nodemailer");
let passverify = require('./service');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const yourPassword = "someRandomPasswordHere";

var helper = require('sendgrid').mail;
var from_email = new helper.Email('test@example.com');
var to_email = new helper.Email('test@example.com');
var subject = 'Hello World from the SendGrid Node.js Library!';
var content = new helper.Content('text/plain', 'Hello, Email!');
var mail = new helper.Mail(from_email, subject, to_email, content);


module.exports = {
    test: async function (req, res) {
        try {
            let data = await users.model.find({})
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    createcart: async (req, res) => {
        try {

            foodIdDetail = req.body.dishes;


            for (let item of foodIdDetail) {
                let foodIdDetail = item.foodId;
                let qtyDetail = item.quantity;
                await carts.model.create({
                    userId: req.body.userId,
                    foodId: foodIdDetail,
                    quantity: qtyDetail
                });

            }
            // let token = jwt.sign({ token: {name: user.name, id: user.id}}, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            res.json({
                error: 0,
                message: "Success"
            });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    createuser: async (req, res) => {
        try {
            let user = await users.model.create({
                name: req.body.name,
                email: req.body.email,
                emailVerified: req.body.emailVerified,
                type: req.body.type,
                password: req.body.password,
                isAdmin: req.body.isAdmin,
            });
            let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            res.json({
                error: 0,
                message: "user created",
                token: token
            });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    emailsender: async (req, res) => {
       
        let useremail = req.body.email;
        let date = new Date().getTime();
        console.log(date);

        let user = await users.model.findOne({email: req.body.email});
        if(!user){
            res.send("No User with this email exists.");
        }else{
            // var date = new Date().getMinutes;


            let token = jwt.sign({ token: { date: date , _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            // useremail = user.email
            let subject = "Verify /your Password"
            let link = 'http://176.9.137.77:3043/api/verifynewpassword?token=' + token;
            console.log(link);
            let message = passverify.newemailservice(link, useremail, subject);
            console.log(message);
            res.json({message: "Success"});
        }

    },

    verifypassword: async (req, res)=> {
        try{
            console.log("Entered");
            let receivedtoken = req.query.token;
            let m = req.body;
            console.log(receivedtoken, m);
        jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function(err, decoded) {
            console.log(decoded);
            if(err){
                res.send(err.message);
            }else{
                console.log("User Expiry remaining");
                res.send("user expiry remaining");
        
                }
          });
        }catch(error){
            res.json(error);
        } 
    },

    updatepassword: async (req, res)=> {
        try{
            let founduser = await users.model.findOne({_id: req.body.id});
            founduser.password = req.body.password
            let update = await founduser.save();
            res.json({error: 0, message: "Password Updated"});

            // let givenpass = req.body.password;
            // let mypassword;
            // let mypass = bcrypt.genSalt(saltRounds, (err, salt) => {
            //     console.log(salt);
            //     bcrypt.hash(givenpass, salt, (err, hash) => {
            //         if(err){
            //             console.log(err);
            //             res.json({error: 1, message: error});
            //         }else{
            //             console.log(hash);
            //             mypassword = hash;
            //              users.model.update({ _id: req.body.id }, { $set: { password: mypassword }}, function (error) {
            //                 if(error){
            //                     res.json({error: 1, message: error});
            //                 }else{
            //                     res.json({error: 0, message: "success"});
            //                 }
            //               });
                        
            //             // return mypassword
            //         }
            //     });
            // });
            // console.log(mypassword, "mmmmmmmmmmmmmmmmm");
                
            }catch(error){
                console.log(error);
            res.json({error:1, message: error});
        }
    },

    sociallogin: async (req, res) => {
        newuser = await users.model.findOne({ email: req.body.email });
        if (!newuser) {
            try {
                console.log("entered");
                let logintype = req.body.type;
                console.log(logintype);
                let user = await users.model.create({
                    name: req.body.name,
                    email: req.body.email,
                    userId: req.body.userId,
                    password: "socialaccess",
                    isAdmin: req.body.isAdmin,
                });
                console.log(user);
                if(logintype == 'facebook'){
                    let date = new Date().getTime();
                    useremail = user.email;
                    subject = "Verify Your Email"
                    let token = jwt.sign({ token: { date: date , _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            // useremail = user.email
            
            let link = 'https://zestybackend.herokuapp.com/api/verifyemail?token=' + token;
            console.log(link);
            passverify.newemailservice(link, useremail, subject);
            console.log("success");
                }
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                console.log(token, "created to");
                res.json({
                    error: 0,
                    message: "user created",
                    token: token
                });
            } catch (error) {
                console.log("errr");
                console.log(error);
                res.status(500).json({ error: 1, message: error });
            }
        } else {
            console.log("enter else");
            let token = jwt.sign({ token: { name: newuser.name, id: newuser.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            console.log("token", token);
            res.json({
                error: 0,
                message: "login successful",
                token: token
            });
        }
    },

    verifyemail: async (req, res) => {
        try{
            let receivedtoken = req.query.token;
        jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function(err, decoded) {
            console.log(decoded.token._id);
            let id  = decoded.token._id;
            if(err){
                res.send(err.message);
            }else{
                try{
                    let founduser = await users.model.findOne({_id: id});
                    founduser.emailVerified = true
                    let update = await founduser.save();
                    res.json({error: 0, message: "Email Verified"});
                }catch(error){
                    console.log(error);
            res.json({error:1, message: error});
                }
                
        
        }});
        }catch(error){
            res.json(error);
        } 
    },

    loginuser: async (req, res) => {
        try {
            keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, function (user) {
                console.log(user);
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                return res.json({
                    error: 0,
                    message: "login Successful",
                    token: token
                });
            }, function (err) {
                console.log(err);
                return res.json({
                    success: true,
                    session: false,
                    message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
                });
            });
        } catch (err) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },
    //following api logic is on temp bases. will change it later
    listFood: async (req, res) => {
        let spicyDetail = [];
        let spicyLevel = req.body.spicy;
        spicyLevel.map((item) => {
            let spice_constant;
            if (item === 'Mild') {
                spice_constant = '1';
            }
            else if (item === 'Medium') {
                spice_constant = '2';
            }
            else {
                spice_constant = '3';
            }
            spicyDetail.push(spice_constant);
        })
        let breakfast = [];
        let lunch = [];
        let dinner = [];
        let completeDetail = {};
        async function pushArray(foundItem, arrayName) {
            await foundItem.map((item) => {
                arrayName.push(item.id);
            })
        }
        let allergyDetails = [];
        let newAllergens = await allergens.model.find({ name: { $in: req.body.allergens } });
        pushArray(newAllergens, allergyDetails);
        let availableDetails = [];
        let newAvailable = await availability.model.find({ name: { $in: req.body.mealType } });
        pushArray(newAvailable, availableDetails);
        let daysDetails = [];
        let daysNames = [];
        let newDays = await days.model.find({ name: { $in: req.body.day } });
        pushArray(newDays, daysDetails);
        newDays.map((i) => {
            daysNames.push(i.name);
        })
        let cuisines = [...req.body.primaryCuisine, ...req.body.secondaryCuisine];
        const finalfood = await dishes.model.find({ cuisine: { $in: cuisines }, diet: { $in: req.body.foodType }, spice_level: { $in: spicyDetail }, allergens: { $nin: allergyDetails }, available_days: { $in: daysDetails }, availability: { $in: availableDetails } }).populate("available_days").populate("availability");
        for await (let ele of finalfood) {
            ele = JSON.parse(JSON.stringify(ele));
            let timing = ele.availability;
            for await (let elem of timing) {
                if (elem.name == 'Breakfast') {
                    breakfast.push(ele)
                }
                else if (elem.name == 'Lunch') {
                    lunch.push(ele)
                }
                else if (elem.name == 'Dinner') {
                    dinner.push(ele)
                }
            }
        }
        for await (let i of daysNames) {
            completeDetail[`${i}`] = { Breakfast: [], Lunch: [], Dinner: [] };
        }
        for await (let v of breakfast) {
            g = v.available_days;
            for await (let k of g) {
                for await (let i of daysDetails) {
                    if (i == k._id) {
                        v = JSON.parse(JSON.stringify(v));
                        delete v.allergens;
                        delete v.availability;
                        delete v.available_days;
                        completeDetail[`${k.name}`].Breakfast.push(v);
                    }
                }
            }
        }
        for await (let v of lunch) {
            g = v.available_days;
            for await (let k of g) {
                daysDetails.map((i) => {
                    if (i == k._id) {
                        v = JSON.parse(JSON.stringify(v));
                        delete v.allergens;
                        delete v.availability;
                        delete v.available_days;
                        completeDetail[`${k.name}`].Lunch.push(v);
                    }
                });
            }
        }
        for await (let v of dinner) {
            g = v.available_days;
            for await (let k of g) {
                daysDetails.map((i) => {
                    if (i == k._id) {
                        v = JSON.parse(JSON.stringify(v));
                        delete v.allergens;
                        delete v.availability;
                        delete v.available_days;
                        completeDetail[`${k.name}`].Dinner.push(v);
                    }
                });
            }
        }
        res.json(completeDetail);
    },
    dishDetails: async (req, res) => {
        try {
            let details = await carts.model.create({
                userId: req.body.userId,
                foodId: req.body.foodId,
                itemNum: req.body.itemNum
            });
            res.json(details);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    getDishDetails: async (req, res) => {
        try {
            const userfood = await carts.model.findOne({ userId: req.body.userId }).populate('foodId');
            res.status(200).json(userfood);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};