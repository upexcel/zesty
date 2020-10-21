let jwt = require('jsonwebtoken');
let moment = require('moment');
let keystone = require('keystone');
let users = keystone.list('User');
let plans = keystone.list('Plan');
let subscriptions = keystone.list('Subscription');
let carts = keystone.list('Cart');
let dishes = keystone.list('Dishes');
let allergens = keystone.list('Allergens');
let availability = keystone.list('Availability');
let days = keystone.list('Days');
let passverify = require('./service');


module.exports = {
    getuser: async function (req, res) {
        try {
            let data = await users.model.find({})
            res.json(data)
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
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

    createsubscription: async (req, res) => {
        try {

            let validitystart = new Date();
            planDetail = await plans.model.findOne({_id: req.body.planId});
            if(planDetail){
                let planTitle = planDetail.title;
                console.log(planTitle);
                let validityend;
                // validityend = moment(validitystart, "YYYY-MM-DD").add('days', 365);
                if(planTitle == 'Monthly'){
                    validityend = moment(validitystart, "YYYY-MM-DD").add('days', 30);
                }else if(planTitle == 'Yearly'){
                    validityend = moment(validitystart, "YYYY-MM-DD").add('days', 365);
                }

            let subsDetail = await subscriptions.model.create({
                userId: req.body.userId,
                planId: req.body.planId,
                validityPeriodStart: validitystart,
                validityPeriodEnd: validityend,
                subscriptionId: req.body.subscriptionId
            });
            res.json({detail: subsDetail})
            }else{
                res.json({message: "No Plan with this Email Exists"});
            }
            
            // let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            // res.json({
            //     error: 0,
            //     message: "user created",
            //     token: token
            // });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    emailsender: async (req, res) => {
        try{
            let useremail = req.body.email;
        let date = new Date().getTime();
        let user = await users.model.findOne({email: req.body.email});
        if(!user){
            res.json({error: 1, message: "No User with this email exists."});
        }else{
            let token = jwt.sign({ token: { date: date , _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            let subject = "Verify your Password"
            let link = process.env.PASSWORD_LINK + token;
            let message = passverify.newemailservice(link, useremail, subject);
            
            res.json({error: 0, message: "Success"});
        }
        }catch(error){
            res.status(500).json({ error: 1, message: error });
        }
    },

    verifypassword: async (req, res)=> {
        try{
            let receivedtoken = req.query.token;
            let m = req.body;
        jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function(err, decoded) {
            if(err){
                res.json({error: 1, messagr: err});
            }else{
                
                let userid = decoded.token._id;
                res.redirect("https://web-zesty-app.herokuapp.com/updatepassword/"+ userid);      
                }
          });
        }catch(error){
            res.json({ error: 1, message: error });
        } 
    },

    updatepassword: async (req, res)=> {
        try{
            let founduser = await users.model.findOne({_id: req.body.id});
            founduser.password = req.body.password
            let update = await founduser.save();
            res.json({error: 0, message: "Password Updated"});     
            }catch(error){
            res.json({error:1, message: error});
        }
    },



    sociallogin: async (req, res) => {
        newuser = await users.model.findOne({ email: req.body.email });
        if (!newuser) {
            try {
                let logintype = req.body.type;
                let pass = process.env.PASSWORD;
                let user = await users.model.create({
                    name: req.body.name,
                    email: req.body.email,
                    userId: req.body.userId,
                    password: pass,
                    isAdmin: req.body.isAdmin,
                });
                if(logintype == 'facebook'){
                    let date = new Date().getTime();
                    useremail = user.email;
                    subject = "Verify Your Email"
                    let token = jwt.sign({ token: { date: date , _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            
            let link = process.env.EMAIL_LINK + token;
            passverify.newemailservice(link, useremail, subject);
                }
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                res.json({
                    error: 0,
                    message: "user created",
                    token: token
                });
            } catch (error) {
                res.status(500).json({ error: 1, message: error });
            }
        } else {

            let token = jwt.sign({ token: { name: newuser.name, id: newuser.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            let subDetail = await subscriptions.model.findOne({userId: newuser._id});
                if(subDetail){
                    let plan = subDetail.planId;
                    let planDetail = await plans.model.findOne({_id: plan});
                    console.log(planDetail.title);
                    let remaingSubscription = subDetail.validityPeriodEnd - new Date();
  
                    if(remaingSubscription > 0){
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            subscribed: true,
                            remtime: remaingSubscription,
                            title: planDetail.title
        
                        });
                    }else{
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            subscribed: false,
                            remtime: remaingSubscription
        
                        });
                    }
                }else{
                    return res.json({
                        error: 0,
                        message: "login Successful",
                        token: token,
                        subscribed: false,
                        remtime: null
    
                    });
                }
        }
    },

    verifyemail: async (req, res) => {
        try{
            let receivedtoken = req.query.token;
        jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function(err, decoded) {
            let id  = decoded.token._id;
            if(err){
                res.send(err.message);
            }else{
                try{
                    let founduser = await users.model.findOne({_id: id});
                    if(founduser){
                        founduser.emailVerified = true
                        let update = await founduser.save();
                        res.json({error: 0, message: "Email Verified"});
                    }else{
                        res.json({error: 1, message: "No User Found With this Email."})
                    }
                    
                }catch(error){
                    res.json({error:1, message: error});
                }
        }});
        }catch(error){
            res.json({ error: 1, message: error });
        } 
    },

    getsubscription: async (req, res) => {
        try{
                let subDetail = await subscriptions.model.findOne({userId: req.body.id});
                if(subDetail){
                    console.log("enteredddddd");
                    let plan = subDetail.planId;
                    let planDetail = await plans.model.findOne({_id: plan});
                    console.log(planDetail.title);
                    let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                    if(remaingSubscription > 0){
                        return res.json({
                            error: 0,
                            subscribed: true,
                            remtime: remaingSubscription,
                            title: planDetail.title
        
                        });
                    }else{
                        return res.json({
                            error: 0,
                            subscribed: false,
                            remtime: remaingSubscription,
                            title: null
        
                        });
                }
        }else{
            return res.json({
                error: 0,
                subscribed: false
        });
    }}catch(error){
        res.status(500).json({ error: 1, message: error });
    }
},


    updateSubscription: async (req, res)=> {
        try{
            let subDetail = await subscriptions.model.findOne({userId: req.body.userId});
            subDetail.planId = req.body.planId;
            let update = await subDetail.save();
            res.json({error: 0, message: "Plan Updated"}); 
        }catch(error){
            res.json({error:1, message: error});
        }
        
    },

    loginuser: async (req, res) => {
        try {
            keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, async function (user) {
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                let subDetail = await subscriptions.model.findOne({userId: user.id});
                if(subDetail){
                    console.log("enteredddddd");
                    let plan = subDetail.planId;
                    let planDetail = await plans.model.findOne({_id: plan});
                    console.log(planDetail.title);
                    let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                    if(remaingSubscription > 0){
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            subscribed: true,
                            remtime: remaingSubscription,
                            title: planDetail.title
        
                        });
                    }else{
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            subscribed: false,
                            remtime: remaingSubscription
        
                        });
                }}else{
                    return res.json({
                        error: 0,
                        message: "login Successful",
                        token: token,
                        subscribed: false,
                        remTime: null
    
                    });
                }
                
            }, function (err) {
                return res.json({
                    error: 1,
                    message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
                });
            });
        } catch (err) {
            res.status(500).json({ error: 1, message: error });
        }
    },
    //following api logic is on temp bases. will change it later
    listFood: async (req, res) => {
        try{
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
    //     let query = { 
    //     cuisine: { $in: cuisines }, 
    //     // diet: { $in: req.body.foodType }, 
    //     // spice_level: { $in: spicyDetail }, 
    //     allergens: { $nin: allergyDetails }, 
    //     available_days: { $in: daysDetails }, 
    //     // availability: { $in: availableDetails } 
    // }

    // if(spicyLevel !== []){
    //     query.spicy_level = { $in: spicyDetail };
    // }

    // let foodtype = req.body.foodType;

    // if(foodtype !== []){
    //     query.diet = { $in: req.body.foodType };
    // }

    // let mealtype = req.body.mealType;

    // if(mealtype !== []){
    //     query.availability = { $in: availableDetails };
    // }

    // console.log(query);

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
        }catch(error){
            res.json({ error: 1, message: error });
        }
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
            res.status(500).json({ error: 1, message: error });
        }
    },
    getDishDetails: async (req, res) => {
        try {
            const userfood = await carts.model.findOne({ userId: req.body.userId }).populate('foodId');
            res.status(200).json(userfood);
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    listplans: async(req, res) => {
        try{
            let allPlans = await plans.model.find({});
            res.json({plans: allPlans});
        }catch(error){
            res.json({ error: 1, message: error });
        }
    }
};