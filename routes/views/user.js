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
let foodplans = keystone.list('Foodplan');
let passverify = require('./service');
const cloudinary = require('cloudinary').v2;
var CronJob = require('cron').CronJob;



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


// async function foodLogic(req, foodDayDetails, dayname) {
//     for(let item in foodDayDetails){
//         if(foodDayDetails[`${item}`]){
//             if (foodDayDetails[`${item}`].Breakfast) {
//                 await foodplans.model.update({ user: req.body.userId }, { Sunday_Breakfast: foodDayDetails.Sunday.Breakfast[0] })
//             }
//         }
//     }
// }

async function updateFood(req) {
    let text = '';
    let foodDayDetails = req.body.foodDetails;

    if (foodDayDetails.Sunday) {
        let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Breakfast[0] });
        let suntextb = "Sunday_Breakfast- " + founditem.name;
        text = text + "\n" + suntextb;
        if (foodDayDetails.Sunday.Breakfast) {
            await foodplans.model.update({ user: req.body.userId }, { Sunday_Breakfast: foodDayDetails.Sunday.Breakfast[0] })
        }
        if (foodDayDetails.Sunday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Lunch[0] });
            let suntextl = "Sunday_Lunch- " + founditem.name;
            text = text + "\n" + suntextl;
            await foodplans.model.update({ user: req.body.userId }, { Sunday_Lunch: foodDayDetails.Sunday.Lunch[0] })
        }
        if (foodDayDetails.Sunday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Sunday.Dinner[0] });
            let suntextd = "Sunday_Dinner- " + founditem.name;
            text = text + "\n" + suntextd;
            await foodplans.model.update({ user: req.body.userId }, { Sunday_Dinner: foodDayDetails.Sunday.Dinner[0] })
        }
    }
    if (foodDayDetails.Monday) {
        if (foodDayDetails.Monday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Breakfast[0] });
            let montextb = "Monday_Breakfast- " + founditem.name;
            text = text + "\n" + montextb;
            await foodplans.model.update({ user: req.body.userId }, { Monday_Breakfast: foodDayDetails.Monday.Breakfast[0] })
        }
        if (foodDayDetails.Monday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Lunch[0] });
            let montextl = "Monday_Lunch- " + founditem.name;
            text = text + "\n" + montextl;
            await foodplans.model.update({ user: req.body.userId }, { Monday_Lunch: foodDayDetails.Monday.Lunch[0] })
        }
        if (foodDayDetails.Monday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Monday.Dinner[0] });
            let montextd = "Monday_Dinner- " + founditem.name;
            text = text + "\n" + montextd;
            await foodplans.model.update({ user: req.body.userId }, { Monday_Dinner: foodDayDetails.Monday.Dinner[0] })
        }
    }
    if (foodDayDetails.Tuesday) {
        if (foodDayDetails.Tuesday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Breakfast[0] });
            let tuetextb = "Tuesday_Breakfast- " + founditem.name;
            text = text + "\n" + tuetextb;
            await foodplans.model.update({ user: req.body.userId }, { Tuesday_Breakfast: foodDayDetails.Tuesday.Breakfast[0] })
        }
        if (foodDayDetails.Tuesday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Lunch[0] });
            let tuetextl = "Tuesday_Lunch- " + founditem.name;
            text = text + "\n" + tuetextl;
            await foodplans.model.update({ user: req.body.userId }, { Tuesday_Lunch: foodDayDetails.Tuesday.Lunch[0] })
        }
        if (foodDayDetails.Tuesday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Tuesday.Dinner[0] });
            let tuetextl = "Tuesday_Dinner- " + founditem.name;
            text = text + "\n" + tuetextd;
            await foodplans.model.update({ user: req.body.userId }, { Tuesday_Dinner: foodDayDetails.Tuesday.Dinner[0] })
        }
    }
    if (foodDayDetails.Wednesday) {
        if (foodDayDetails.Wednesday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Breakfast[0] });
            let wedtextb = "Wednesday_Breakfast- " + founditem.name;
            text = text + "\n" + wedtextb;
            await foodplans.model.update({ user: req.body.userId }, { Wednesday_Breakfast: foodDayDetails.Wednesday.Breakfast[0] })
        }
        if (foodDayDetails.Wednesday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Lunch[0] });
            let wedtextl = "Wednesday_Lunch- " + founditem.name;
            text = text + "\n" + wedtextbl;
            await foodplans.model.update({ user: req.body.userId }, { Wednesday_Lunch: foodDayDetails.Wednesday.Lunch[0] })
        }
        if (foodDayDetails.Wednesday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Wednesday.Dinner[0] });
            let wedtextd = "Wednesday_Dinner- " + founditem.name;
            text = text + "\n" + wedtextd;
            await foodplans.model.update({ user: req.body.userId }, { Wednesday_Dinner: foodDayDetails.Wednesday.Dinner[0] })
        }
    }
    if (foodDayDetails.Thursday) {

        if (foodDayDetails.Thursday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Breakfast[0] });
            let thutextb = "Thursday_Breakfast- " + founditem.name;
            text = text + "\n" + thutextb;
            await foodplans.model.update({ user: req.body.userId }, { Thursday_Breakfast: foodDayDetails.Thursday.Breakfast[0] })
        }
        if (foodDayDetails.Thursday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Lunch[0] });
            let thutextl = "Thursday_Lunch- " + founditem.name;
            text = text + "\n" + thutextl;
            await foodplans.model.update({ user: req.body.userId }, { Thursday_Lunch: foodDayDetails.Thursday.Lunch[0] })
        }
        if (foodDayDetails.Thursday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Thursday.Dinner[0] });
            let thutextd = "Thursday_Dinner- " + founditem.name;
            text = text + "\n" + thutextd;
            await foodplans.model.update({ user: req.body.userId }, { Thursday_Dinner: foodDayDetails.Thursday.Dinner[0] })
        }
    }
    if (foodDayDetails.Friday) {
        if (foodDayDetails.Friday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Breakfast[0] });
            let fritextb = "Friday_Breakfast- " + founditem.name;
            text = text + "\n" + fritextb;
            await foodplans.model.update({ user: req.body.userId }, { Friday_Breakfast: foodDayDetails.Friday.Breakfast[0] })
        }
        if (foodDayDetails.Friday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Lunch[0] });
            let fritextl = "Friday_Lunch- " + founditem.name;
            text = text + "\n" + fritextl;
            await foodplans.model.update({ user: req.body.userId }, { Friday_Lunch: foodDayDetails.Friday.Lunch[0] })
        }
        if (foodDayDetails.Friday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Friday.Dinner[0] });
            let fritextd = "Friday_Dinner- " + founditem.name;
            text = text + "\n" + fritextd;
            await foodplans.model.update({ user: req.body.userId }, { Friday_Dinner: foodDayDetails.Friday.Dinner[0] })
        }
    }
    if (foodDayDetails.Saturday) {
        if (foodDayDetails.Saturday.Breakfast) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Breakfast[0] });
            let sattextb = "Saturday_Breakfast- " + founditem.name;
            text = text + "\n" + sattextb;
            await foodplans.model.update({ user: req.body.userId }, { Saturday_Breakfast: foodDayDetails.Saturday.Breakfast[0] })
        }
        if (foodDayDetails.Saturday.Lunch) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Lunch[0] });
            let sattextl = "Saturday_Lunch- " + founditem.name;
            text = text + "\n" + sattextl;
            await foodplans.model.update({ user: req.body.userId }, { Saturday_Lunch: foodDayDetails.Saturday.Lunch[0] })
        }
        if (foodDayDetails.Saturday.Dinner) {
            let founditem = await dishes.model.findOne({ _id: foodDayDetails.Saturday.Dinner[0] });
            let sattextd = "Saturday_Dinner- " + founditem.name;
            text = text + "\n" + sattextd;
            await foodplans.model.update({ user: req.body.userId }, { Saturday_Dinner: foodDayDetails.Saturday.Dinner[0] })
        }
    }

    let foundUser = await users.model.findOne({ _id: req.body.userId });
    let email = foundUser.email;
    let subject = "Your Order Details."
    await passverify.reminderservice(text, email, subject);


}


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
                res.json({ error: 1, message: "No user found with this id." });
            }
        } catch (error) {
            res.json({ error: 1, message: error });
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
                res.json({ error: 1, message: "This email already exists." });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },


    updateUserProfile: async (req, res) => {
        try {
            let userdata = req.body
            let founduser = await users.model.findOne({ _id: req.body.userId });
            if (founduser) {
                await uploadImage(req);
                if (req.body.firstName || req.body.lastName) {
                    if (req.body.firstName != undefined && req.body.firstName != "") {
                        req.body.name = { "first": req.body.firstName, "last": req.body.lastName }
                        console.log(req.body.name);
                        updatedUser = await users.model.update({ _id: req.body.userId }, req.body, async (err, data) => {
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
                res.json({ message: "No Plan with this Email Exists" });
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
                res.json({ error: 1, message: "No User with this email exists." });
            } else {
                let token = jwt.sign({ token: { date: date, _id: user._id } }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
                let subject = "Verify your Password"
                let link = process.env.PASSWORD_LINK + token;
                let message = passverify.newemailservice(link, useremail, subject);

                res.json({ error: 0, message: "Success" });
            }
        } catch (error) {
            res.status(500).json({ error: 1, message: error });
        }
    },

    verifypassword: async (req, res) => {
        try {
            let receivedtoken = req.query.token;
            let m = req.body;
            jwt.verify(receivedtoken, process.env.TOKEN_SECRET, async function (err, decoded) {
                if (err) {
                    res.json({ error: 1, messagr: err });
                } else {

                    let userid = decoded.token._id;
                    res.redirect("https://web-zesty-app.herokuapp.com/updatepassword/" + userid);
                }
            });
        } catch (error) {
            res.json({ error: 1, message: error });
        }
    },

    updatepassword: async (req, res) => {
        try {
            let founduser = await users.model.findOne({ _id: req.body.id });
            founduser.password = req.body.password
            let update = await founduser.save();
            res.json({ error: 0, message: "Password Updated" });
        } catch (error) {
            res.json({ error: 1, message: error });
        }
    },



    sociallogin: async (req, res) => {
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
                res.status(500).json({ error: 1, message: error });
            }
        } else {

            let token = jwt.sign({ token: { name: newuser.name, id: newuser.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            let subDetail = await subscriptions.model.findOne({ userId: newuser._id });
            if (subDetail) {
                let plan = subDetail.planId;
                let planDetail = await plans.model.findOne({ _id: plan });
                console.log(planDetail.title);
                let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                if (remaingSubscription > 0) {
                    return res.json({
                        error: 0,
                        message: "login Successful",
                        token: token,
                        id: newuser._id,
                        name: newuser.name,
                        subscribed: true,
                        remtime: remaingSubscription,
                        title: planDetail.title

                    });
                } else {
                    return res.json({
                        error: 0,
                        message: "login Successful",
                        token: token,
                        id: newuser._id,
                        name: newuser.name,
                        subscribed: false,
                        remtime: remaingSubscription

                    });
                }
            } else {
                return res.json({
                    error: 0,
                    message: "login Successful",
                    token: token,
                    id: newuser._id,
                    name: newuser.name,
                    subscribed: false,
                    remtime: null

                });
            }
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
                            res.json({ error: 0, message: "Email Verified" });
                        } else {
                            res.json({ error: 1, message: "No User Found With this Email." })
                        }

                    } catch (error) {
                        res.json({ error: 1, message: error });
                    }
                }
            });
        } catch (error) {
            res.json({ error: 1, message: error });
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
                    res.json({ error: 1, message: "No Plan found with this name." });
                }
            } else {
                res.json({ error: 1, message: "User had no plans." });
            }

        } catch (error) {
            res.json({ error: 1, message: error });
        }

    },

    loginuser: async (req, res) => {
        try {
            keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, async function (user) {
                let token = jwt.sign({ token: { name: user.name, id: user.id } }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                let subDetail = await subscriptions.model.findOne({ userId: user.id });
                if (subDetail) {
                    let plan = subDetail.planId;
                    let planDetail = await plans.model.findOne({ _id: plan });
                    console.log(planDetail.title);
                    let remaingSubscription = subDetail.validityPeriodEnd - new Date();

                    if (remaingSubscription > 0) {
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            id: user.id,
                            name: user.name,
                            subscribed: true,
                            remtime: remaingSubscription,
                            title: planDetail.title

                        });
                    } else {
                        return res.json({
                            error: 0,
                            message: "login Successful",
                            token: token,
                            id: user.id,
                            name: user.name,
                            subscribed: false,
                            remtime: remaingSubscription

                        });
                    }
                } else {
                    return res.json({
                        error: 0,
                        message: "login Successful",
                        token: token,
                        id: user.id,
                        name: user.name,
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
        try {
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

            // async function deleteExtras(item) {
            //     newitem = JSON.parse(JSON.stringify(item));
            //                 delete newitem.allergens;
            //                 delete newitem.availability;
            //                 delete newitem.available_days;
            // }


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






            // async function listfood(food, type, completeDetail, daysDetails){
            //     for await (let value of food) {
            //         let gotDays = value.available_days;
            //         for await (let k of g) {
            //             for await (let i of daysDetails) {
            //                 if (i == k._id) {
            //                     console.log(typeof(i));
            //                     v = JSON.parse(JSON.stringify(v));
            //                     console.log("heroo");
            //                     delete v.allergens;
            //                     delete v.availability;
            //                     delete v.available_days;
            //                     let m = String(food);
            //                     console.log(m);
            //                     if (completeDetail[`${k.name}`].Breakfast.length < 2 && type == 'breakfast') {
            //                         console.log("doneeeeee");
            //                         completeDetail[`${k.name}`].Breakfast.push(v);
            //                         console.log(completeDetail);
            //                     }
            //                     else if (completeDetail[`${k.name}`].Lunch.length < 2 && type == 'lunch') {
            //                         console.log("hhhhh");
            //                         completeDetail[`${k.name}`].Lunch.push(v);
            //                     }
            //                     else if (completeDetail[`${k.name}`].Dinner.length < 2 && type == 'dinner') {
            //                         console.log("hhhhhhhhhnnnnnnnnnnn");
            //                         completeDetail[`${k.name}`].Dinner.push(v);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
            // await listfood(breakfast,'breakfast', completeDetail, daysDetails);
            // await listfood(lunch,'lunch', completeDetail, daysDetails);
            // await listfood(dinner,'dinner', completeDetail, daysDetails);




            for await (let v of breakfast) {
                g = v.available_days;
                for await (let k of g) {
                    for await (let i of daysDetails) {
                        if (i == k._id) {
                            // deleteExtras(v);
                            v = JSON.parse(JSON.stringify(v));
                            delete v.allergens;
                            delete v.availability;
                            delete v.available_days;
                            if (completeDetail[`${k.name}`].Breakfast.length < 2) {
                                completeDetail[`${k.name}`].Breakfast.push(v);
                            }


                        }
                    }
                }
            }



            for await (let v of lunch) {
                g = v.available_days;
                for await (let k of g) {
                    daysDetails.map((i) => {
                        if (i == k._id) {
                            // deleteExtras(v);
                            v = JSON.parse(JSON.stringify(v));
                            delete v.allergens;
                            delete v.availability;
                            delete v.available_days;
                            if (completeDetail[`${k.name}`].Lunch.length < 2) {
                                completeDetail[`${k.name}`].Lunch.push(v);
                            }





                        }
                    });
                }
            }


            for await (let v of dinner) {
                g = v.available_days;
                for await (let k of g) {
                    daysDetails.map((i) => {
                        if (i == k._id) {
                            // deleteExtras(v);
                            v = JSON.parse(JSON.stringify(v));
                            delete v.allergens;
                            delete v.availability;
                            delete v.available_days;
                            if (completeDetail[`${k.name}`].Dinner.length < 2) {
                                // console.log();
                                completeDetail[`${k.name}`].Dinner.push(v);
                            }

                        }
                    });
                }
            }
            console.log(completeDetail.Monday.Dinner);

            res.json(completeDetail);
        } catch (error) {
            console.log(error);
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

    listplans: async (req, res) => {
        try {
            let allPlans = await plans.model.find({});
            res.json({ plans: allPlans });
        } catch (error) {
            res.json({ error: 1, message: error });
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



            if (!foundplan) {
                let selections = req.body.choices;
                console.log(req.body.choices);
                createdPlan = await foodplans.model.create({
                    user: req.body.userId,
                    foodDetails: req.body.foodDetails,
                    Primary_Cuisine: selections.primaryCuisine,
                    Secondary_Cuisine: selections.secondaryCuisine,
                    Meal_Types: selections.foodType,
                    Spice_Level: selections.spicy,
                    Allergens: selections.allergens,
                    Meal_Timing: selections.mealType,
                    Days: selections.day,

                    startdate: startday,
                    enddate: endday
                });
                await updateFood(req);

                res.json({ error: 0, message: "Success" });
            }
            else {
                let selections = req.body.choices;
                updatedPlan = await foodplans.model.update({ user: req.body.userId }, { startdate: startday, enddate: endday,
                    foodDetails: req.body.foodDetails,
                    Primary_Cuisine: selections.primaryCuisine,
                    Secondary_Cuisine: selections.secondaryCuisine,
                    Meal_Types: selections.foodType,
                    Spice_Level: selections.spicy,
                    Allergens: selections.allergens,
                    Meal_Timing: selections.mealType,
                    Days: selections.day,}, async (err, data) => {
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
            res.json({ error: 1, message: error });
        }
    },


    showfoodplan: async (req, res) => {
        try{
            let foundFood = await foodplans.model.findOne({ user: req.body.userId });
            // console.log(foundFood);
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
                        // console.log(element);
                        let foundDish = await dishes.model.findOne({ _id: element });
                        if(foundDish){
                            foundDishObject[`${property}`][`${item}`].push({ name: foundDish.name, _id: foundDish._id });
                        }else{
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
            foundDishObject.choices = choices;
            

            res.json(foundDishObject);
        } else {
            res.json({ message: "No Food Found." });
        }
        }catch(error){
            console.log(error);
            res.json({ error: 1, message: error });
        }

        

    },

    cronsender: async () => {
        try {
            let data = await users.model.find({});
            // console.log(data.length);

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


}