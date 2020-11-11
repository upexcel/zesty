let jwt = require('jsonwebtoken');
let moment = require('moment');
let keystone = require('keystone');
let users = keystone.list('User');
// let plans = keystone.list('Plan');
// let subscriptions = keystone.list('Subscription');
// let carts = keystone.list('Cart');
let dishes = keystone.list('Dishes');
let allergens = keystone.list('Allergens');
let availability = keystone.list('Availability');
let days = keystone.list('Days');
let foodplans = keystone.list('Foodplan');
let passverify = require('./service');
const { select } = require('async');
const { indexOf } = require('lodash');
const cloudinary = require('cloudinary').v2;
var CronJob = require('cron').CronJob;
const axios = require('axios');



async function uploadImage(req) {
    try {
        let imageUpload = await cloudinary.uploader.upload(req.files.image.path);
        url = imageUpload.secure_url;
        updatedUser = await users.model.update({ _id: req.body.userId }, { image: url }, async (err, data) => {
            if (err) {
                req.json({ error: 1, message: err });
            } else {
                console.log("image updated");
            }
        })
    } catch (err) {
        console.log(err);
    }
}


async function updateFood(req) {
    console.log("entttttttttttttttttt");
    try{
        let text = '';
        let foodDayDetails = req.body.foodDetails;
    for(let item in foodDayDetails){
        if(foodDayDetails[`${item}`]){
            if (foodDayDetails[`${item}`].Breakfast.length) {
             let founditem = await dishes.model.findOne({ _id: foodDayDetails[`${item}`].Breakfast[0] });
                let daytextbreakfast = [`${item}`] + "_Breakfast- " + founditem.name;
                itemToUpdate1 = [`${item}`] + "_Breakfast";
                text = text + "\n" + daytextbreakfast;
                await foodplans.model.update({ user: req.body.userId }, { itemToUpdate1: foodDayDetails[`${item}`].Breakfast[0] })
            }
            if (foodDayDetails[`${item}`].Lunch.length) {
                let founditem = await dishes.model.findOne({ _id: foodDayDetails[`${item}`].Lunch[0] });
                let daytextlunch = [`${item}`] + "_Lunch- " + founditem.name;
                itemToUpdate2 = [`${item}`] + "_Lunch";
                text = text + "\n" + daytextlunch;
                await foodplans.model.update({ user: req.body.userId }, { itemToUpdate2: foodDayDetails[`${item}`].Lunch[0] })
            }
            if (foodDayDetails[`${item}`].Dinner.length) {
                let founditem = await dishes.model.findOne({ _id: foodDayDetails[`${item}`].Dinner[0] });
                let daytextdinner = [`${item}`] + "_Dinner- " +founditem.name;
                itemToUpdate3 = [`${item}`] + "_Dinner";
                text = text + "\n" + daytextdinner;
                await foodplans.model.update({ user: req.body.userId }, { itemToUpdate3: foodDayDetails[`${item}`].Dinner[0] })
            }
        }
    }
        let foundUser = await users.model.findOne({ _id: req.body.userId });
        let email = foundUser.email;
        let subject = "Your Order Details."
        await passverify.reminderservice(text, email, subject);
    }catch(error){
        console.log(error);
        throw(error);
    }
    
}




// async function updateFood(req) {
//     try{
//         let text = '';
//         let foodDayDetails = req.body.foodDetails;
    
//         if (foodDayDetails.Sunday) {
            
//             if (foodDayDetails.Sunday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Breakfast[0] });
//                 let suntextb = "Sunday_Breakfast- " + founditem.name;
//                 text = text + "\n" + suntextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Sunday_Breakfast: foodDayDetails.Sunday.Breakfast[0] })
//             }
//             if (foodDayDetails.Sunday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Lunch[0] });
//                 let suntextl = "Sunday_Lunch- " + founditem.name;
//                 text = text + "\n" + suntextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Sunday_Lunch: foodDayDetails.Sunday.Lunch[0] })
//             }
//             if (foodDayDetails.Sunday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Dinner[0] });
//                 let suntextd = "Sunday_Dinner- " + founditem.name;
//                 text = text + "\n" + suntextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Sunday_Dinner: foodDayDetails.Sunday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Monday) {
//             if (foodDayDetails.Monday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Breakfast[0] });
//                 let montextb = "Monday_Breakfast- " + founditem.name;
//                 text = text + "\n" + montextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Monday_Breakfast: foodDayDetails.Monday.Breakfast[0] })
//             }
//             if (foodDayDetails.Monday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Lunch[0] });
//                 let montextl = "Monday_Lunch- " + founditem.name;
//                 text = text + "\n" + montextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Monday_Lunch: foodDayDetails.Monday.Lunch[0] })
//             }
//             if (foodDayDetails.Monday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Dinner[0] });
//                 let montextd = "Monday_Dinner- " + founditem.name;
//                 text = text + "\n" + montextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Monday_Dinner: foodDayDetails.Monday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Tuesday) {
//             if (foodDayDetails.Tuesday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Breakfast[0] });
//                 let tuetextb = "Tuesday_Breakfast- " + founditem.name;
//                 text = text + "\n" + tuetextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Tuesday_Breakfast: foodDayDetails.Tuesday.Breakfast[0] })
//             }
//             if (foodDayDetails.Tuesday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Lunch[0] });
//                 let tuetextl = "Tuesday_Lunch- " + founditem.name;
//                 text = text + "\n" + tuetextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Tuesday_Lunch: foodDayDetails.Tuesday.Lunch[0] })
//             }
//             if (foodDayDetails.Tuesday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Dinner[0] });
//                 let tuetextd = "Tuesday_Dinner- " + founditem.name;
//                 text = text + "\n" + tuetextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Tuesday_Dinner: foodDayDetails.Tuesday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Wednesday) {
//             if (foodDayDetails.Wednesday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Breakfast[0] });
//                 let wedtextb = "Wednesday_Breakfast- " + founditem.name;
//                 text = text + "\n" + wedtextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Wednesday_Breakfast: foodDayDetails.Wednesday.Breakfast[0] })
//             }
//             if (foodDayDetails.Wednesday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Lunch[0] });
//                 let wedtextl = "Wednesday_Lunch- " + founditem.name;
//                 text = text + "\n" + wedtextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Wednesday_Lunch: foodDayDetails.Wednesday.Lunch[0] })
//             }
//             if (foodDayDetails.Wednesday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Dinner[0] });
//                 let wedtextd = "Wednesday_Dinner- " + founditem.name;
//                 text = text + "\n" + wedtextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Wednesday_Dinner: foodDayDetails.Wednesday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Thursday) {
    
//             if (foodDayDetails.Thursday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Breakfast[0] });
//                 let thutextb = "Thursday_Breakfast- " + founditem.name;
//                 text = text + "\n" + thutextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Thursday_Breakfast: foodDayDetails.Thursday.Breakfast[0] })
//             }
//             if (foodDayDetails.Thursday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Lunch[0] });
//                 let thutextl = "Thursday_Lunch- " + founditem.name;
//                 text = text + "\n" + thutextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Thursday_Lunch: foodDayDetails.Thursday.Lunch[0] })
//             }
//             if (foodDayDetails.Thursday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Dinner[0] });
//                 let thutextd = "Thursday_Dinner- " + founditem.name;
//                 text = text + "\n" + thutextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Thursday_Dinner: foodDayDetails.Thursday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Friday) {
//             if (foodDayDetails.Friday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Breakfast[0] });
//                 let fritextb = "Friday_Breakfast- " + founditem.name;
//                 text = text + "\n" + fritextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Friday_Breakfast: foodDayDetails.Friday.Breakfast[0] })
//             }
//             if (foodDayDetails.Friday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Lunch[0] });
//                 let fritextl = "Friday_Lunch- " + founditem.name;
//                 text = text + "\n" + fritextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Friday_Lunch: foodDayDetails.Friday.Lunch[0] })
//             }
//             if (foodDayDetails.Friday.Dinner) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Dinner[0] });
//                 let fritextd = "Friday_Dinner- " + founditem.name;
//                 text = text + "\n" + fritextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Friday_Dinner: foodDayDetails.Friday.Dinner[0] })
//             }
//         }
//         if (foodDayDetails.Saturday) {
//             if (foodDayDetails.Saturday.Breakfast.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Breakfast[0] });
//                 let sattextb = "Saturday_Breakfast- " + founditem.name;
//                 text = text + "\n" + sattextb;
//                 await foodplans.model.update({ user: req.body.userId }, { Saturday_Breakfast: foodDayDetails.Saturday.Breakfast[0] })
//             }
//             if (foodDayDetails.Saturday.Lunch.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Lunch[0] });
//                 let sattextl = "Saturday_Lunch- " + founditem.name;
//                 text = text + "\n" + sattextl;
//                 await foodplans.model.update({ user: req.body.userId }, { Saturday_Lunch: foodDayDetails.Saturday.Lunch[0] })
//             }
//             if (foodDayDetails.Saturday.Dinner.length) {
//                 let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Dinner[0] });
//                 let sattextd = "Saturday_Dinner- " + founditem.name;
//                 text = text + "\n" + sattextd;
//                 await foodplans.model.update({ user: req.body.userId }, { Saturday_Dinner: foodDayDetails.Saturday.Dinner[0] })
//             }
//         }
    
//         let foundUser = await users.model.findOne({ _id: req.body.userId });
//         let email = foundUser.email;
//         let subject = "Your Order Details."
//         await passverify.reminderservice(text, email, subject);
    
//     }catch(error){
//         console.log(error);
//         throw error;
//         // res.status(500).json({error: 1, message: error});
//     }
    

// }


module.exports = {

    getuser: async function (req, res) {
        try {
            let data = await users.model.find({});
            res.json(data)
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },



    userdetails: async (req, res) => {
        try {
            let founduser = await users.model.findOne({ _id: req.body.userId });
            if (founduser) {
                res.json({ name: founduser.name, image: founduser.image, email: founduser.email, id: founduser._id });
            } else {
                res.status(500).json({ error: 1, message: "No user found with this id." });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },


    createuser: async (req, res) => {
        try {
            let dbuser = await users.model.findOne({ email: req.body.email });
            if (!dbuser) {

                let user = await users.model.create({
                    name: req.body.name,
                    email: req.body.email,
                    emailVerified: req.body.emailVerified,
                    type: req.body.type,
                    password: req.body.password,
                    workprofile: req.body.workprofile,
                    isAdmin: req.body.isAdmin,
                });
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                res.json({
                    error: 0,
                    message: "user created",
                    token: token,
                    id: user._id,
                    name: user.name
                });
            } else {
                res.status(500).json({ error: 1, message: "This email already exists." });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },


    updateUserProfile: async (req, res) => {
        try {
            console.log(req.body.firstName);
            let founduser = await users.model.findOne({ _id: req.body.userId });
            if (founduser) {
                await uploadImage(req);
                if (req.body.firstName || req.body.lastName) {
                    if (req.body.firstName != undefined && req.body.firstName != "undefined" && req.body.firstName != "" && req.body.lastName != undefined && req.body.lastName != "undefined" && req.body.lastName != "") {
                        req.body.name = { "first": req.body.firstName, "last": req.body.lastName }
                        // console.log(req.body.name);
                        // let name = {};
                        // if(req.body.firstname){
                        //     name.first = req.body.firstName;
                        // }
                        // if(req.body.lastName){
                        //     name.last = req.body.lastName;
                        // }
                        console.log(req.body.name);
                        updatedUser = await users.model.update({ _id: req.body.userId }, { name: req.body.name}, async (err, data) => {
                            if (err) {
                                req.json({ error: 1, message: err });
                            } else {
                                console.log(data);
                                // let updatedUser = await users.model.findOne({_id: req.body.userId});
                                res.json({ error: 0, message: "Success" });
                            }
                        })
                    } else {
                        res.json({ error: 0, message: "Success" });
                    }
                } else {
                    res.json({ error: 0, message: "Success" });
                }
            } else {
                res.json({ error: 0, message: "No User with this email exists." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },

    createsubscription: async (req, res) => {
        try {

            let validitystart = new Date();
            planDetail = await plans.model.findOne({ _id: req.body.planId });
            if (planDetail) {
                let planTitle = planDetail.title;
                console.log(planTitle);
                let validityend;
                if (planTitle == 'Monthly') {
                    validityend = moment(validitystart, "YYYY-MM-DD").add('days', 30);
                } else if (planTitle == 'Yearly') {
                    validityend = moment(validitystart, "YYYY-MM-DD").add('days', 365);
                }

                let subsDetail = await subscriptions.model.create({
                    userId: req.body.userId,
                    planId: req.body.planId,
                    validityPeriodStart: validitystart,
                    validityPeriodEnd: validityend,
                    subscriptionId: req.body.subscriptionId
                });
                res.json({ detail: subsDetail })
            } else {
                res.json({ error: 0, message: "No Plan with this Email Exists" });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    emailsender: async (req, res) => {
        try {
            let useremail = req.body.email;
            let date = new Date().getTime();
            let user = await users.model.findOne({ email: req.body.email });
            if (!user) {
                res.status(500).json({ error: 1, message: "No User with this email exists." });
            } else {
                let token = jwt.sign({ token: { date: date, _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
                let subject = "Verify your Password"
                let link = process.env.PASSWORD_LINK + token;
                let message = passverify.newemailservice(link, useremail, subject);

                res.json({ error: 0, message: "Success" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },

    verifypassword: async (req, res) => {
        try {
            let receivedtoken = req.query.token;
            // let m = req.body;
            jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function (err, decoded) {
                if (err) {
                    console.log(error);
                    res.status(500).json({ error: 1, messagr: err });
                } else {

                    let userid = decoded.token._id;
                    res.redirect("https://web-zesty-app.herokuapp.com/updatepassword/" + userid);
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },

    updatepassword: async (req, res) => {
        try {
            let founduser = await users.model.findOne({ _id: req.body.id });
            founduser.password = req.body.password
            let update = await founduser.save();
            res.json({ error: 0, message: "Password Updated" });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },



    sociallogin: async (req, res) => {
        try{
            newuser = await users.model.findOne({ email: req.body.email });
        if (!newuser) {
            try {
                let logintype = req.body.type;
                let pass = process.env.PASSWORD;
                let user = await users.model.create({
                    image: req.body.image,
                    name: req.body.name,
                    email: req.body.email,
                    userId: req.body.userId,
                    password: pass,
                    isAdmin: req.body.isAdmin,
                });
                if (logintype == 'facebook') {
                    let date = new Date().getTime();
                    useremail = user.email;
                    subject = "Verify Your Email"
                    let token = jwt.sign({ token: { date: date, _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

                    let link = process.env.EMAIL_LINK + token;
                    passverify.newemailservice(link, useremail, subject);
                }
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                res.json({
                    error: 0,
                    message: "user created",
                    token: token,
                    id: user._id,
                    name: user.name
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 1, message: error });
            }
        } else {

            let token = jwt.sign({ token: { name: newuser.name, id: newuser.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            return res.json({
                error: 0,
                message: "login Successful",
                token: token,
                id: newuser._id,
                name: newuser.name
            });
            // let subDetail = await subscriptions.model.findOne({ userId: newuser._id });
            // if (subDetail) {
            //     let plan = subDetail.planId;
            //     let planDetail = await plans.model.findOne({ _id: plan });
            //     console.log(planDetail.title);
            //     let remaingSubscription = subDetail.validityPeriodEnd - new Date();

            //     if (remaingSubscription > 0) {
            //         return res.json({
            //             error: 0,
            //             message: "login Successful",
            //             token: token,
            //             id: newuser._id,
            //             name: newuser.name,
            //             subscribed: true,
            //             remtime: remaingSubscription,
            //             title: planDetail.title

            //         });
            //     } else {
            //         return res.json({
            //             error: 0,
            //             message: "login Successful",
            //             token: token,
            //             id: newuser._id,
            //             name: newuser.name,
            //             subscribed: false,
            //             remtime: remaingSubscription

            //         });
            //     }
            // } else {
            //     return res.json({
            //         error: 0,
            //         message: "login Successful",
            //         token: token,
            //         id: newuser._id,
            //         name: newuser.name,
            //         subscribed: false,
            //         remtime: null

            //     });
            // }
        }
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 1, message: error });

        }
        
    },

    verifyemail: async (req, res) => {
        try {
            let receivedtoken = req.query.token;
            jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function (err, decoded) {
                let id = decoded.token._id;
                if (err) {
                    res.send(err.message);
                } else {
                    try {
                        let founduser = await users.model.findOne({ _id: id });
                        if (founduser) {
                            founduser.emailVerified = true
                            let update = await founduser.save();
                            
                            res.redirect("https://web-zesty-app.herokuapp.com");
                        } else {
                            res.status(500).json({ error: 1, message: "No User Found With this Email." })
                        }

                    } catch (error) {
                        res.status(500).json({ error: 1, message: error });
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    getsubscription: async (req, res) => {
        try {
            let subDetail = await subscriptions.model.findOne({ userId: req.body.id });
            if (subDetail) {
                let plan = subDetail.planId;
                let planDetail = await plans.model.findOne({ _id: plan });
                console.log(planDetail.title);
                let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                if (remaingSubscription > 0) {
                    return res.json({
                        error: 0,
                        subscribed: true,
                        remtime: remaingSubscription,
                        title: planDetail.title

                    });
                } else {
                    return res.json({
                        error: 0,
                        subscribed: false,
                        remtime: remaingSubscription,
                        title: null

                    });
                }
            } else {
                return res.json({
                    error: 0,
                    subscribed: false
                });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },


    updateSubscription: async (req, res) => {
        try {
            let subDetail = await subscriptions.model.findOne({ userId: req.body.userId });
            if (subDetail) {
                planDetail = await plans.model.findOne({ title: req.body.title });
                let validitystart = new Date();
                if (planDetail) {
                    let planTitle = planDetail.title;
                    console.log(planTitle);
                    let validityend;
                    if (planTitle == 'Monthly') {
                        validityend = moment(validitystart, "YYYY-MM-DD").add('days', 30);
                    } else if (planTitle == 'Yearly') {
                        validityend = moment(validitystart, "YYYY-MM-DD").add('days', 365);
                    }
                    subDetail.planId = planDetail._id;
                    subDetail.validityPeriodStart = validitystart;
                    subDetail.validityPeriodStart = validityend;
                    let update = await subDetail.save();
                    res.json({ error: 0, message: "Plan Updated" });
                } else {
                    res.status(500).json({ error: 1, message: "No Plan found with this name." });
                }
            } else {
                res.status(500).json({ error: 1, message: "User had no plans." });
            }

        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }

    },

    loginuser: async (req, res) => {
        try {
            keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, async function (user) {
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                res.json({
                    error: 0,
                    message: "login Successful",
                    token: token,
                    id: user.id,
                    name: user.name,
                });
                // let subDetail = await subscriptions.model.findOne({ userId: user.id });
                // if (subDetail) {
                //     let plan = subDetail.planId;
                //     let planDetail = await plans.model.findOne({ _id: plan });
                //     console.log(planDetail.title);
                //     let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                //     if (remaingSubscription > 0) {
                //         return res.json({
                //             error: 0,
                //             message: "login Successful",
                //             token: token,
                //             id: user.id,
                //             name: user.name,
                //             subscribed: true,
                //             remtime: remaingSubscription,
                //             title: planDetail.title

                //         });
                //     } else {
                //         return res.json({
                //             error: 0,
                //             message: "login Successful",
                //             token: token,
                //             id: user.id,
                //             name: user.name,
                //             subscribed: false,
                //             remtime: remaingSubscription

                //         });
                //     }
                // } else {
                //     return res.json({
                //         error: 0,
                //         message: "login Successful",
                //         token: token,
                //         id: user.id,
                //         name: user.name,
                //         subscribed: false,
                //         remTime: null

                //     });
                // }

            }, function (err) {
                return res.status(500).json({
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
        try {
            let alltime = req.body.mealType;
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

            let selectedday = req.body.day;
            let cuisines = [...req.body.primaryCuisine, ...req.body.secondaryCuisine];
            const finalfood = await dishes.model.find({ cuisine: { $in: cuisines }, diet: { $in: req.body.foodType }, spice_level: { $in: spicyDetail }, allergens: { $nin: allergyDetails }, available_days: { $in: daysDetails }, availability: { $in: availableDetails } }).populate("available_days").populate("availability");
            

            
            for await (let elemoffinalfood of finalfood) {
                elemoffinalfood = JSON.parse(JSON.stringify(elemoffinalfood));
                let timing = elemoffinalfood.availability;
                for await (let elem of timing) {
                    for await (let time of alltime ){
                        if (elem.name == 'Breakfast' && time == 'Breakfast' ) {
                            // let nowbreakfast = breakfast.find((element)=> element == elemoffinalfood);
                            // let nowlunch = lunch.find((element)=> element == elemoffinalfood);
                            // let nowdinner = dinner.find((element)=> element == elemoffinalfood);
                            //         if(!nowbreakfast && !nowlunch && !nowdinner && breakfast.length < 5){
                                        breakfast.push(elemoffinalfood )
                                    // }
                            
                        }
                        else if (elem.name == 'Lunch' && time== 'Lunch' ) {
                            // let nowbreakfast = breakfast.find((element)=> element == elemoffinalfood);
                            // let nowlunch = lunch.find((element)=> element == elemoffinalfood);
                            // let nowdinner = dinner.find((element)=> element == elemoffinalfood);
                            //         if(!nowbreakfast && !nowlunch && !nowdinner && lunch.length < 5){
                                        lunch.push(elemoffinalfood);
                                    // }
                            
                        }
                        else if (elem.name == 'Dinner' && time == 'Dinner') {
                            // let nowbreakfast = breakfast.find((element)=> element == elemoffinalfood);
                            // let nowlunch = lunch.find((element)=> element == elemoffinalfood);
                            // let nowdinner = dinner.find((element)=> element == elemoffinalfood);
                            //         if(!nowbreakfast && !nowlunch && !nowdinner){
                                        dinner.push(elemoffinalfood);
                                    // }
                            
                        }
                    }
                }
            }
            for await (let itemofbreakfast of daysNames) {
                completeDetail[`${itemofbreakfast}`] = { Breakfast: [], Lunch: [], Dinner: [] };
            }
            // let secondarycuisinelength = [];
            // // nowbreakfast = [];
            // // nowlunch = [];
            // // nowdinner = [];
            let meallength = req.body.mealType.length;
            let newlength = meallength * 2;
            let daylength = daysNames.length;
            let percentage = parseInt((15/100)* (daylength*newlength));
            if(percentage == 0){
                percentage = 1;
            }
            console.log(percentage, "fffffffff");
            async function listfood(food, type, completeDetail, daysDetails){
                for await (let value of food) {
                    let count = 0;
                    let gotDays = value.available_days;
                    for await (let day of gotDays) {

                        let founddday = selectedday.find((elem)=> elem == day.name);
                        // for await (let item of daysDetails) {
                            if (founddday ) {
                                // 
                                
                                value = JSON.parse(JSON.stringify(value));
                                delete value.allergens;
                                delete value.availability;
                                delete value.available_days;
                                // if(meallength == 3){

                                
                                if (type == 'breakfast') {
                                    // && count < percentage && completeDetail[`${day.name}`].Breakfast.length < 2
                                    // let nowcuisine = value.cuisine;
                                    // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                                    // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);
                                    // // let nowbreakfast = completeDetail[`${day.name}`].Breakfast.find((element)=> element == value);
                                    // //     let nowlunch = completeDetail[`${day.name}`].Lunch.find((element)=> element == value);
                                    // //     let nowdinner = completeDetail[`${day.name}`].Dinner.find((element)=> element == value);
                                    // if(nowprimarycuisine && completeDetail[`${day.name}`].Breakfast.length <= 1){
                                        
                                    //     // if(!nowbreakfast && !nowlunch && !nowdinner){
                                    //     completeDetail[`${day.name}`].Breakfast.push(value);
                                    //     // }
                                    // }
                                    // if(nowsecondarycuisine  && completeDetail[`${day.name}`].Breakfast.length <= 2){
                                    //     // if(!nowbreakfast && !nowlunch && !nowdinner){
                                    //     completeDetail[`${day.name}`].Breakfast.push(value);
                                    //     // }
                                    // }
                                    completeDetail[`${day.name}`].Breakfast.push(value);
                                    // count ++;
                                }
                                else if (type == 'lunch') {
                                    // && count < percentage && completeDetail[`${day.name}`].Lunch.length < 2
                                    // console.log(value._id);
                                    // let nowcuisine = value.cuisine;
                                    // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                                    // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);
                                    // if(nowprimarycuisine  && completeDetail[`${day.name}`].Lunch.length <= 1){
                                    //     completeDetail[`${day.name}`].Lunch.push(value);
                                    // }
                                    // if(nowsecondarycuisine && completeDetail[`${day.name}`].Lunch.length <= 2){
                                    //     completeDetail[`${day.name}`].Lunch.push(value);
                                    // }
                                    completeDetail[`${day.name}`].Lunch.push(value);
                                    // count ++;
                                }
                                else if (type == 'dinner' ) {
                                    // && count < percentage && completeDetail[`${day.name}`].Dinner.length < 2
                                    // let nowcuisine = value.cuisine;
                                    // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                                    // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);
                                    // if(nowprimarycuisine  && completeDetail[`${day.name}`].Breakfast.length <= 2){
                                    //     completeDetail[`${day.name}`].Dinner.push(value);
                                    // }
                                    completeDetail[`${day.name}`].Dinner.push(value);
                                    // count ++;

                                }
                            // }
                            // else if(meallength == 2 || meallength == 1 ){


                            //     if (type == 'breakfast') {
                                    
                            //         // let nowcuisine = value.cuisine;
                            //         // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                            //         // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);

                            //         // if(nowprimarycuisine && completeDetail[`${day.name}`].Breakfast.length <= 1){
                                        
                                
                            //         //     completeDetail[`${day.name}`].Breakfast.push(value);

                            //         // }
                            //         // if(nowsecondarycuisine  && completeDetail[`${day.name}`].Breakfast.length <= 2){
                            //         //     // if(!nowbreakfast && !nowlunch && !nowdinner){
                            //         //     completeDetail[`${day.name}`].Breakfast.push(value);
                            //         //     // }
                            //         // }
                            //         // completeDetail[`${day.name}`].Breakfast.push(value);
                            //         completeDetail[`${day.name}`].Breakfast.push(value);
                            //     }
                            //     else if (type == 'lunch') {
                            //         // let nowcuisine = value.cuisine;
                            //         // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                            //         // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);
                            //         // // let nowbreakfast = completeDetail[`${day.name}`].Breakfast.find((element)=> element == value);
                            //         // //     let nowlunch = completeDetail[`${day.name}`].Lunch.find((element)=> element == value);
                            //         // //     let nowdinner = completeDetail[`${day.name}`].Dinner.find((element)=> element == value);
                            //         // if(nowprimarycuisine  && completeDetail[`${day.name}`].Lunch.length <= 2){
                            //         //     // if(!nowbreakfast && !nowlunch && !nowdinner){
                            //         //     completeDetail[`${day.name}`].Lunch.push(value);
                            //         // }
                            //         // // if(nowsecondarycuisine && completeDetail[`${day.name}`].Lunch.length <= 2){
                            //         // //     if(!nowbreakfast && !nowlunch && !nowdinner){
                            //         // //     completeDetail[`${day.name}`].Lunch.push(value);
                            //         // // }}
                            //         completeDetail[`${day.name}`].Lunch.push(value);
                            //     }
                            //     else if (type == 'dinner') {
                            //         // let nowcuisine = value.cuisine;
                            //         // let nowprimarycuisine = req.body.primaryCuisine.find((elementofprimarycuisine)=> elementofprimarycuisine == nowcuisine);
                            //         // let nowsecondarycuisine = req.body.secondaryCuisine.find((elementofsecondarycuisine)=> elementofsecondarycuisine == nowcuisine);
                            //         // // let nowbreakfast = completeDetail[`${day.name}`].Breakfast.find((element)=> element == value);
                            //         // //     let nowlunch = completeDetail[`${day.name}`].Lunch.find((element)=> element == value);
                            //         // //     console.log(completeDetail[`${day.name}`].Lunch);
                            //         // //     let nowdinner = completeDetail[`${day.name}`].Dinner.find((element)=> element == value);
                            //         // if(nowprimarycuisine  && completeDetail[`${day.name}`].Breakfast.length <= 2){
                            //         //     // if(!nowbreakfast && !nowlunch && !nowdinner){
                            //         //     completeDetail[`${day.name}`].Dinner.push(value);
                            //         // }
                            //         // // if(nowsecondarycuisine){
                            //         // //     completeDetail[`${day.name}`].Dinner.push(value);
                            //         // // }
                            //         completeDetail[`${day.name}`].Dinner.push(value);
                            //     }

                            // }
                                completeDetail[`${day.name}`].Breakfast = completeDetail[`${day.name}`].Breakfast.sort(() => Math.random() - 0.5);
                                completeDetail[`${day.name}`].Lunch = completeDetail[`${day.name}`].Lunch.sort(() => Math.random() - 0.5);
                                completeDetail[`${day.name}`].Dinner = completeDetail[`${day.name}`].Dinner.sort(() => Math.random() - 0.5);
                                // let numberOfItems = completeDetail[`${day.name}`].Breakfast.length;
                                // completeDetail[`${day.name}`].Breakfast.splice(2, numberOfItems);
                                // let numberOfItems2 = completeDetail[`${day.name}`].Lunch.length;
                                // completeDetail[`${day.name}`].Lunch.splice(2, numberOfItems2);
                                // let numberOfItems3 = completeDetail[`${day.name}`].Dinner.length;
                                // completeDetail[`${day.name}`].Dinner.splice(2, numberOfItems3);
                            }
                        // }
                    }
                }
            }


            await listfood(breakfast,'breakfast', completeDetail, daysDetails);
            console.log(lunch.length);
            for(let day of selectedday){
            console.log(completeDetail[`${day}`].Breakfast.length);
            }
            for(let day of selectedday){
                // console.log(day);
                for await (let eachitem of completeDetail[`${day}`].Breakfast){
                    let found_item_in_lunch = lunch.find((element)=> element.id == eachitem.id);
                    // console.log(found_item_in_lunch);
                    if(found_item_in_lunch){
                        for( var i = 0; i < lunch.length; i++){
                             if ( lunch[i] === found_item_in_lunch) {
                                //  console.log("hchsjgchjsgcgj"); 
                                lunch.splice(i, 1); 
                            }}
                    }
                }
            }

            console.log(lunch.length);
            await listfood(lunch,'lunch', completeDetail, daysDetails);

            for(let day of selectedday){
            for await (let eachitem of completeDetail[`${day}`].Breakfast){
                let found_item_in_dinner = dinner.find((element)=> element.id == eachitem.id);
                // console.log(found_item_in_dinner);
                if(found_item_in_dinner){
                    for( var i = 0; i < dinner.length; i++){
                         if ( dinner[i] === found_item_in_dinner) { 
                            //  console.log("iiiiiiiiiiiiiiiii");
                            dinner.splice(i, 1); 
                        }}
                }
            }

            for await (let eachitem of completeDetail[`${day}`].Lunch){
                let founded_item_in_dinner = dinner.find((element)=> element.id == eachitem.id);
                // console.log(founded_item_in_dinner);
                if(founded_item_in_dinner){
                    for( var i = 0; i < dinner.length; i++){
                         if ( dinner[i] === founded_item_in_dinner) { 
                             console.log("uuuuuuuuuuuuuuuuu");
                            dinner.splice(i, 1); 
                        }}
                }
            }
        }
            await listfood(dinner,'dinner', completeDetail, daysDetails);
            
            res.json(completeDetail);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    }
,
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

    listplans: async (req, res) => {
        try {
            let allPlans = await plans.model.find({});
            res.json({ plans: allPlans });
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    savefoodplan: async (req, res) => {
        try {
            let daysObj = req.body.foodDetails;

            let startday;
            let endday;

            for (const property in daysObj) {
                let day = String(property);

                let today = new Date();
                let daynumber = today.getDay();;
                let startdate = (7 - daynumber) + 1;
                let enddate = (7 - daynumber) + 7;

                startday = moment(today, "YYYY-MM-DD").add('days', startdate);
                endday = moment(today, "YYYY-MM-DD").add('days', enddate);

            }
            let foundplan = await foodplans.model.findOne({ user: req.body.userId });
            // let selections = req.body.choices;


            if (!foundplan) {
                let foundUser = await users.model.findOne({ _id: req.body.userId });
                let selections = req.body.choices;
                console.log(req.body.choices);
                createdPlan = await foodplans.model.create({
                    name: foundUser.name,
                    user: req.body.userId,
                    foodDetails: req.body.foodDetails,
                    Primary_Cuisine: selections.primaryCuisine,
                    Secondary_Cuisine: selections.secondaryCuisine,
                    Meal_Types: selections.foodType,
                    Spice_Level: selections.spicy,
                    Allergens: selections.allergens,
                    Meal_Timing: selections.mealType,
                    Order_For: selections.orderFor,
                    Other_Mentions: selections.extraMention,
                    Breakfast_Time_Interval: selections.Breakfast_Time_Interval,
                    Lunch_Time_Interval: selections.Lunch_Time_Interval,
                    Dinner_Time_Interval: selections.Dinner_Time_Interval,
                    Days: selections.day,

                    startdate: startday,
                    enddate: endday
                });
                await updateFood(req);

                res.json({ error: 0, message: "Success" });
            }
            else {
                let selections = req.body.choices;
                updatedPlan = await foodplans.model.update({ user: req.body.userId }, {
                    startdate: startday, enddate: endday,
                    foodDetails: req.body.foodDetails,
                    Primary_Cuisine: selections.primaryCuisine,
                    Secondary_Cuisine: selections.secondaryCuisine,
                    Meal_Types: selections.foodType,
                    Spice_Level: selections.spicy,
                    Allergens: selections.allergens,
                    Meal_Timing: selections.mealType,
                    Order_For: selections.orderFor,
                    Other_Mentions: selections.extraMention,
                    Breakfast_Time_Interval: selections.Breakfast_Time_Interval,
                    Lunch_Time_Interval: selections.Lunch_Time_Interval,
                    Dinner_Time_Interval: selections.Dinner_Time_Interval,
                    Days: selections.day,
                }, async (err, data) => {
                    if (err) {
                        req.json({ error: 1, message: err });
                    } else {
                        console.log(data);
                    }
                })
                await updateFood(req);
                res.json({ error: 0, message: "Success" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },


    showfoodplan: async (req, res) => {
        try {
            let foundFood = await foodplans.model.findOne({ user: req.body.userId });
            if (foundFood) {
                let days = foundFood.foodDetails;
                let timing;
                let mealType;
                let foundDishObject = {};
                for (const property in days) {
                    foundDishObject[`${property}`] = {};
                    timing = days[`${property}`]
                    for (const item in timing) {
                        foundDishObject[`${property}`][`${item}`] = []
                        mealType = timing[`${item}`];
                        for await (let element of mealType) {
                            let foundDish = await dishes.model.findOne({ _id: element });
                            if (foundDish) {
                                foundDishObject[`${property}`][`${item}`].push({ name: foundDish.name, _id: foundDish._id });
                            } else {
                                console.log("No food Found with this id");
                            }

                        }
                    }
                }
                foundDishObject.startdate = foundFood.startdate;
                foundDishObject.enddate = foundFood.enddate;
                let choices = {};
                choices.Primary_Cuisine = foundFood.Primary_Cuisine;
                choices.Secondary_Cuisine = foundFood.Secondary_Cuisine;
                choices.Meal_Types = foundFood.Meal_Types;
                choices.Spice_Level = foundFood.Spice_Level;
                choices.Meal_Timing = foundFood.Meal_Timing;
                choices.Days = foundFood.Days;
                choices.Allergens = foundFood.Allergens;
                choices.Order_For = foundFood.Order_For;
                choices.Other_Mentions = foundFood.Other_Mentions;
                choices.Breakfast_Time_Interval = foundFood.Breakfast_Time_Interval;
                choices.Lunch_Time_Interval = foundFood.Lunch_Time_Interval;
                choices.Dinner_Time_Interval = foundFood.Dinner_Time_Interval;
                foundDishObject.choices = choices;


                res.json(foundDishObject);
            } else {
                res.status(500).json({ error: 1, message: "No Food Found." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }



    },

    cronsender: async () => {
        try {
            let data = await users.model.find({});
            for await (let element of data) {
                let email = element.email;
                let text = "Hello, Select delicious food on Zesty to kill your hunger."
                let subject = "Get Delocious Dishes."

                passverify.reminderservice(text, email, subject);
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    test:  async (req, res) => {
        res.json({success: true});
    },

    listAllergens: async function (req, res) {
        try {
            let data = await allergens.model.find({});
            res.json(data)
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    paymentStart: async (req, res) => {
        try{
            axios({
                method: 'post',
                url: 'https://api.dapi.co/v1/auth/ExchangeToken',
                data: {
                    "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
                    "accessCode": req.body.accessCode,
                    "connectionID": req.body.connectionID
                }
              }).then(function (response) {
                console.log(response.data);
                let token = response.data.accessToken;
                console.log(token);
                
                if(response.data.accessToken){

                    axios({
                        method: 'post',
                        url: 'https://api.dapi.co/v1/data/accounts/get',
                        headers: {'Authorization': 'Bearer ' + token},
                        data: {
                            "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
                            "userSecret": req.body.userSecret,
                            "sync": true,
                        }
                      }).then(function (response) {
                        console.log(response.data);
                        if(response.data.status){
                            let senderId = response.data.accounts[0].id
                            axios({
                                method: 'post',
                                url: 'https://api.dapi.co/v1/payment/transfer/create',
                                headers: {'Authorization': 'Bearer ' + token},
                                data: {
                                    "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
                                    "userSecret": req.body.userSecret,
                                    "sync": true,
                                     "amount": 1,
                                     "senderID": senderId,
                                    // "senderID":  process.env.SENDER_ID,
                                    "receiverID": process.env.RECEIVER_ID,
                                    "remark": "remarks for transaction"
                                }
                              }).then(function (response) {
                                console.log(response.data);
                                let finalResponse = {};
                                finalResponse.data = response.data;
                                finalResponse.token = token;
                                finalResponse.userSecret = req.body.userSecret;
                                res.json(finalResponse);
                                // res.json({data: response.data, token: token, userSecret: req.body.userSecret});
                              }).catch(function (error) {
                                console.log(error);
                                res.status(500).json({ error: 1, message: error });
                              });
                        }else{
                            console.log(error);
                            res.status(500).json({ error: 1, message: error });
                        }
                      }).catch(function (error) {
                        console.log(error);
                        res.status(500).json({ error: 1, message: error });
                      });
                    
                    // axios({
                    //     method: 'post',
                    //     url: 'https://api.dapi.co/v1/payment/transfer/create',
                    //     headers: {'Authorization': 'Bearer ' + token},
                    //     data: {
                    //         "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
                    //         "userSecret": req.body.userSecret,
                    //         "sync": true,
                    //          "amount": 1,
                    //         "senderID":  process.env.SENDER_ID,
                    //         "receiverID": process.env.RECEIVER_ID,
                    //         "remark": "remarks for transaction"
                    //     }
                    //   }).then(function (response) {
                    //     console.log(response);
                    //     res.json({data: response, token: token, userSecret: req.body.userSecret});
                    //   }).catch(function (error) {
                    //     console.log(error);
                    //     res.status(500).json({ error: 1, message: error });
                    //   });
                }else{
                    console.log(error);
                    res.status(500).json({ error: 1, message: error });
                }
              })
              .catch(function (error) {
                console.log(error);
                res.status(500).json({ error: 1, message: error });
              });
        }catch(error){
            console.log(error);
            res.status(500).json({ error: 1, message: error });
        }
    },

    resumeJobs: async (req, res) => {
        axios({
            method: 'post',
            url: 'https://api.dapi.co/v1/job/resume',
            headers: {"Authorization": "Bearer " + req.body.token},
            data: {
                "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
                "userSecret": req.body.userSecret,
                "sync": true,
                "jobID": req.body.jobID,
                "userInputs": req.body.userInputs
            }
          }).then(function (response) {
            console.log(response.data);
            res.json(response.data);
          }).catch(function (error) {
              console.log("jjjjjjjjjjjjjjjj");
            console.log(error);
            res.status(500).json({ error: 1, message: error });
          });
    },

    // paymentSender: async (req, res) => {
    //     try{
    //         axios({
    //             method: 'post',
    //             url: 'https://api.dapi.co/v1/auth/ExchangeToken',
    //             data: {
    //                 "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
    //                 "accessCode": req.body.accessCode,
    //                 "connectionID": req.body.connectionID
    //             }
    //           }).then(function (response) {
    //             console.log(response.data);
    //             let token = response.data.accessToken;
    //             console.log(token);
                
    //             if(response.data.accessToken){

    //                 axios({
    //                     method: 'post',
    //                     url: 'https://api.dapi.co/v1/data/accounts/get',
    //                     headers: {'Authorization': 'Bearer ' + token},
    //                     data: {
    //                         "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
    //                         "userSecret": req.body.userSecret,
    //                         "sync": true,
    //                     }
    //                   }).then(function (response) {
    //                     console.log(response.data);
    //                   }).catch(function (error) {
    //                     console.log(error);
    //                     res.status(500).json({ error: 1, message: error });
    //                   });

    //                   axios({
    //                     method: 'post',
    //                     url: 'https://api.dapi.co/v1/payment/beneficiaries/get',
    //                     headers: {'Authorization': 'Bearer ' + token},
    //                     data: {
    //                         "appSecret": "43836f1547d1c9c2123698e084420a72dccbad2a32fa8399e7b01057773c8c52a53acafe3e9560778074baa3887a614ccbefca2707a013186492a2c074ee3830e994ae75445e8df085c01d604e3ad52d0cf15a5c8650009c96d27a211c45fe568dc440bc13bbae1ef9aff33b17cd2d727712f983b41e6dd814fe4b83c0d5f01a",
    //                         "userSecret": req.body.userSecret,
    //                         "sync": true,
    //                     }
    //                   }).then(function (response) {
    //                     console.log(response.data);
    //                   }).catch(function (error) {
    //                     console.log(error);
    //                     res.status(500).json({ error: 1, message: error });
    //                   });
                    
                    
    //             }else{
    //                 console.log(error);
    //                 res.status(500).json({ error: 1, message: error });
    //             }
    //           })
    //           .catch(function (error) {
    //             console.log(error);
    //             res.status(500).json({ error: 1, message: error });
    //           });
    //     }catch(error){
    //         console.log(error);
    //         res.status(500).json({ error: 1, message: error });
    //     }
    // }

}