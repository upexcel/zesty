let jwt = require('jsonwebtoken');
let keystone = require('keystone');
let users = keystone.list('User');
let carts = keystone.list('Cart');
let dishes = keystone.list('Dishes');
let allergens = keystone.list('Allergens');
let availability = keystone.list('Availability');
let days = keystone.list('Days');
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
    createuser: async (req, res) => {
        try {
            let user = await users.model.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin: req.body.isAdmin,
            });
            let token = jwt.sign({ token: {name: user.name, id: user.id}}, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            res.json({error: 0,
            message: "user created",
            token: token});
        } catch (error) {
            res.status(500).json({error: 1, message: error});
        }
    },


    sociallogin: async (req, res) => {
        newuser = await users.model.findOne({ email: req.body.email });
        if(!newuser){
            try {
                console.log("entered");
                let user = await users.model.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: "socialaccess",
                    isAdmin: req.body.isAdmin,
                });
                let token = jwt.sign({ token: {name: user.name, id: user.id}}, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                res.json({error: 0,
                message: "user created",
                token: token});
            } catch (error) {
                console.log(error);
                res.status(500).json({error: 1, message: error});
            }
        }else{
            let token = jwt.sign({ token: {name: newuser.name, id: newuser.id}}, process.env.TOKEN_SECRET, { expiresIn: "1d" });
            res.json({error: 0,
            message: "login successful",
            token: token});
        }
        
    },

    loginuser: async (req, res) => {
        try{
            keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, function (user) {
                    let token = jwt.sign({ token: {name: user.name, id: user.id} }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
                    return res.json({error: 0,
                        message: "login Successful",
                        token: token});
                
            }, function(err){
                return res.json({
                    success: true,
                    session: false,
                    message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
                });           
            });
            
        }catch(err){
            console.log(error);
            res.status(500).json({error: 1, message: error});
            
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
        let newBreakfast = [];
        let lunch = [];
        let newLunch = [];
        let dinner = [];
        let newDinner = [];
        let completeDetail = {};

        async function pushArray(foundItem, arrayName){
            await foundItem.map((item)=> {
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
        let newDays = await days.model.find({ name: { $in: req.body.day } });
        pushArray(newDays, daysDetails);

        let cuisines = [...req.body.primaryCuisine, ...req.body.secondaryCuisine];
        const finalfood = await dishes.model.find({ cuisine: { $in: cuisines }, diet: { $in: req.body.foodType }, spice_level: { $in: spicyDetail }, allergens: { $nin: allergyDetails }, available_days: { $in: daysDetails }, availability: { $in: availableDetails } }).populate("available_days").populate("availability");
        console.log(JSON.stringify(finalfood));
        for await (let ele of finalfood) {
            ele = JSON.parse(JSON.stringify(ele));
            let timing = ele.availability;
            for await (let elem of timing) {
                if(elem.name == 'Breakfast'){
                    breakfast.push(ele)
                }
                else if(elem.name == 'Lunch'){
                    lunch.push(ele)
                }
                else if(elem.name == 'Dinner') {
                    dinner.push(ele)
                }
            }                       

            for await(let element of ele.available_days){
                for await (let item of daysDetails) {
                    if(element._id == item){
                        completeDetail[`${element.name}`] = {Breakfast: breakfast, Lunch: lunch, Dinner: dinner};
                    }
                    delete ele.allergens;
                    delete ele.availability;
                    delete ele.available_days;
                }
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