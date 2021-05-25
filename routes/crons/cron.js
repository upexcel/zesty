const keystone = require("keystone");
const users = keystone.list("User");
const Chef = keystone.list("Chef");
const systemDates = keystone.list('SystemDates');
const foodplans = keystone.list("Foodplan");
const WeekRevenue = keystone.list("ZestyWeekRevenue");
const ZestyRevenue = keystone.list("ZestyRevenue");
const service = require("../views/service");
const CronJob = require("cron").CronJob;
const Handlebars = require("handlebars");
const moment = require('moment')

const accountSid = process.env.twilio_account_sid
const authtoken = process.env.twilio_auth_token
const twilioNumber = process.env.twilio_number
const client = require('twilio')(accountSid,authtoken);

const sendSms =  async (smsbody,number)=> {
	try {
		const msg = await client.messages.create({
			body : smsbody,
			from : twilioNumber,
			to :  number
		})
		console.log(msg,"response from sendsms function");
		return msg
	} catch(err) {
		console.log(err,"error from send msg")
		throw err
	}
}

const getdishdetails = async (id)=>{
	const dish = await dishes.model.findOne({_id:id})
	return dish.name
	
}
const getsidedishdetails = async(ids)=>{
	if(ids.length>=1){
		let sidedish = []
		for (let id of ids){
			let dish = await userDish.model.findOne({_id:id})
			if(dish){
				sidedish.push(`${dish.count} ${dish.name}`)
			}

		}
		return `with ${sidedish.join(",")}`
	} else {
		return ""
	}
}

async function fetchChef (dishId) {
	if (dishId) {
		const dishDetail = await dishes.model.findOne({_id : dishId}).populate('chef')
		return dishDetail.chef._id
	}
}

const cronService = async () => {
	try {
		const clientFoodplanForNextWeek = new CronJob("35 1 * * 6", async () => {
			try {
				let data = await users.model.find();
				for await (let element of data) {
					let email = element.email;
					let html = `Hello, Select delicious food on Zesty to kill your hunger.
                you can select your next week's menu from here -
                <a href={{link}}> {{link}} </a>`;
					let subject = "Your menu for next week.";
					console.log(
						`${process.env.webBaseUrl}/subscribe?_id=${element._id}`,
						"a-s-as-as-as-as-as-as-"
					);
					const template = Handlebars.compile(html);
					let mailHtml = template({
						link: `${process.env.webBaseUrl}/subscribe?_id=${element._id}`,
					});
					service.reminderservice(mailHtml, email, subject);
				}
			} catch (error) {
				console.log(error, " Error from Client Food Plan for Next week Cron");
			}
		}, null, true, 'Asia/Kolkata');
		clientFoodplanForNextWeek.start();

		const chefMailForNextWeek = new CronJob("35 1 * * 6", async () => {
			try {
				let chefs = await Chef.model.find({});
				for await (let item of chefs) {
					if (item.email) {
						let html = `Hello, Below is the link of your Dishes.
					<a href={{link}}> {{link}} </a>`;
						let subject = "Dishes for the next week";
						const template = Handlebars.compile(html);
						let mailHtml = template({
							link: `${process.env.webBaseUrl}/chef/${item.name}`,
						});
						let mailSendData = await service.reminderservice(
							mailHtml,
							[
								item.email,
								"praveena.nadi@gmail.com",
								"gaganpreetkaur@yahoo.com",
							],
							subject
						);
					}
                }
			} catch (error) {
				console.log(error, "Error from Chef Mail For Next Week Cron");
			}
		}, null, true, 'Asia/Kolkata');
        chefMailForNextWeek.start();

        const setSystemDates = new CronJob('40 1 * * 6', function (){
            try {
                const weekendDates = await systemDates.model.findOne({})
                let newWeekEndDate = moment(weekendDates.weekenddate).add(7,"days").format('YYYY-MM-DDTHH:mm:ss.SSS')
                let newWeekStartDate =  moment(weekendDates.weekstartdate).add(7,"days").format('YYYY-MM-DDTHH:mm:ss.SSS')
                let newChefEndDate = moment(weekendDates.chefenddate).add(7,"days").format('YYYY-MM-DDTHH:mm:ss.SSS')
                let newChefStartDate =  moment(weekendDates.chefstartdate).add(7,"days").format('YYYY-MM-DDTHH:mm:ss.SSS')
                console.log(newWeekEndDate,"update of new week end date")
                console.log(newWeekStartDate,"update of new week Start date")
                console.log(newChefEndDate,"update of new chef end date")
                console.log(newChefStartDate,"update of new chef start date")
                const updated = await systemDates.model.update({_id: weekendDates},
                    {weekenddate : newWeekEndDate,
                    weekstartdate : newWeekStartDate,
                    chefenddate : newChefEndDate,
                    chefstartdate : newChefStartDate
                })
            } catch (error) {
                console.log(error,"Error from Set System Dates cron ")
            }
        }, null, true, 'Asia/Kolkata')
        setSystemDates.start();

        const addweeklyrevenue = new CronJob("50 1 * * *",async ()=>{
            try {
                const currentsystemdate = await systemDates.model.findOne({})
                const currentfoodplans = await  foodplans.model.find({startdate:{$gte :currentsystemdate.weekstartdate }}).lean()
                console.log(currentfoodplans)
                let weeklyrevenuedata = {
                    startdate : currentsystemdate.weekstartdate,
                    enddate : currentsystemdate.weekenddate,
                    totalBill: 0,
                    ZestyMargin : 0,
                    Memberbership : 0,
                    totalRevenue : 0
                }
                if (currentfoodplans.length>0){
                    for (let foodplan of currentfoodplans){
                        weeklyrevenuedata.totalBill +=  foodplan.totalBill
                        weeklyrevenuedata.ZestyMargin += foodplan.zesty_margin
                        weeklyrevenuedata.Memberbership +=  foodplan.membership
                        weeklyrevenuedata.totalRevenue +=  foodplan.total_revenue
                    }
                }
                await WeekRevenue.model.remove({startdate:currentsystemdate.weekstartdate})
                const weeklyrevenuesaved = await WeekRevenue.model.create(weeklyrevenuedata)
                console.log(weeklyrevenuesaved,"weekly revenue saved")
            } catch (error) {
                console.log(error, "Error from add weekly revenue cron")
            }
        }, null, true, 'Asia/Kolkata')
        addweeklyrevenue.start();
        
        const addtotalrevenue = new CronJob('0 2 * * *', async ()=>{
            try {
                const allweeksrevenue = await WeekRevenue.model.find({})
                let revenuetobesaved = {
                    name: 'Zesty Revenue',
                    totalBill: 0,
                    ZestyMargin : 0,
                    Memberbership : 0,
                    totalRevenue : 0
                }
                if (allweeksrevenue.length>0){
                    for(let weeksrevenue of allweeksrevenue){
                        revenuetobesaved.totalBill += weeksrevenue.totalBill
                        revenuetobesaved.ZestyMargin += weeksrevenue.ZestyMargin
                        revenuetobesaved.Memberbership += weeksrevenue.Memberbership
                        revenuetobesaved.totalRevenue += weeksrevenue.totalRevenue 
                    }
                }
                await ZestyRevenue.model.remove({})
                const createdrevenue = await ZestyRevenue.model.create(revenuetobesaved)
                console.log(createdrevenue,"total revenue saved ")
            } catch (error) {
                console.log(error, "Error from add total revenue cron ")
            }
        }, null, true, 'Asia/Kolkata')
        addtotalrevenue.start();

        const sendChefSms = new CronJob('0 19 * * *', () => {
            try{
                let chefs = await Chef.model.find({})
                let days =["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
                let day = (new Date()).getDay() + 1
                for await (let item of chefs) { 
                    if (item.mobile_no) {
                        let msg = `Your Menu for the day is 
                        
                        ${process.env.webBaseUrl}/chef/${item.name}?day=${days[day]} `
                        let mailSendData = await sendSms(msg, `+${item.mobile_no}`);
                    }
                }
            } catch (error) {
                console.log(error, "error from send sms to chef cron")
            }
        }, null, true, 'Asia/Kolkata')
        sendChefSms.start();

        const previousFoodPlanUpdate = new CronJob('20 1 * * 6', async () => {
            try {
                    let allUsers = await users.model.find({'pauseSubscription': false}).lean();
                    let upcomingSunday = moment().add(1,'weeks').isoWeekday(0)
                    let lastTolastweekSaturday = moment().subtract(2,"weeks").isoWeekday(6)
                    for (let userData of allUsers) {
                        let text = `<p>Hi ${userData.name.first} ${userData.name.last}</p>
                        <br>
                        <p>Your foodplan for this week is : </p>`
                        let foodPlanDataExist = await foodplans.model
                            .findOne({
                                user: userData._id,
                                enddate: {
                                    $gte: upcomingSunday,
                                },
                            }).lean();
                            if (!foodPlanDataExist) {
                            let foodPlanData = await foodplans.model
                                .find({
                                    user: userData._id,
                                    enddate: {
                                        $lt: upcomingSunday,	
                                        $gt: new Date (lastTolastweekSaturday)			 
                                    },
                                }).sort({'startdate': -1})
                                .lean();
                            if (foodPlanData.length) {
                                let foodPlanDataByChef = foodPlanData[0]
                                let today = new Date();
                                let daynumber = today.getDay();
                                let startdate = (7 - daynumber);
                                let enddate = (7 - daynumber) + 6;
                                let startday = moment(today, "YYYY-MM-DD").add(startdate, 'days').set("hour", 0).set("minute", 0).set("seconds", 0)
                                let endday = moment(today, "YYYY-MM-DD").add(enddate,'days' ).set("hour", 0).set("minute", 0).set("seconds", 0)
                                console.log(startday,endday,'Start AND END DATE')
                                console.log("****************************************************************************************************")
                                let saveObject = {
                                    user: foodPlanDataByChef.user,
                                    foodDetails: foodPlanDataByChef.foodDetails,
                                    adult_count: foodPlanDataByChef.adult_count,
                                    children_count : foodPlanDataByChef.children_count,
                                    Breakfast_Time_Interval: foodPlanDataByChef.Breakfast_Time_Interval,
                                    Lunch_Time_Interval: foodPlanDataByChef.Lunch_Time_Interval,
                                    Dinner_Time_Interval: foodPlanDataByChef.Dinner_Time_Interval,
                                    startdate: startday,
                                    enddate: endday,
                                    Receiver_Email: foodPlanDataByChef.Receiver_Email,
                                    Shipping_Address: foodPlanDataByChef.Shipping_Address,
                                    Shipping_State: foodPlanDataByChef.Shipping_State,
                                    mobile : foodPlanDataByChef.mobile,
                                    other_breakfast_choices: foodPlanDataByChef.other_breakfast_choices,
                                    other_lunch_choices: foodPlanDataByChef.other_lunch_choices,
                                    other_dinner_choices: foodPlanDataByChef.other_dinner_choices,
                                    Sunday_Breakfast: foodPlanDataByChef.Sunday_Breakfast,
                                    Sunday_Breakfast_Chef: await fetchChef(foodPlanDataByChef.Sunday_Breakfast),
                                    Sunday_Lunch: foodPlanDataByChef.Sunday_Lunch,
                                    Sunday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Sunday_Lunch),
                                    Sunday_Dinner: foodPlanDataByChef.Sunday_Dinner,
                                    Sunday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Sunday_Dinner),
                                    Monday_Breakfast: foodPlanDataByChef.Monday_Breakfast,
                                    Monday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Monday_Breakfast),
                                    Monday_Lunch: foodPlanDataByChef.Monday_Lunch,
                                    Monday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Monday_Lunch),
                                    Monday_Dinner: foodPlanDataByChef.Monday_Dinner,
                                    Monday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Monday_Dinner),
                                    Tuesday_Breakfast: foodPlanDataByChef.Tuesday_Breakfast,
                                    Tuesday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Tuesday_Breakfast),
                                    Tuesday_Lunch: foodPlanDataByChef.Tuesday_Lunch,
                                    Tuesday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Tuesday_Lunch),
                                    Tuesday_Dinner: foodPlanDataByChef.Tuesday_Dinner,
                                    Tuesday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Tuesday_Dinner),
                                    Wednesday_Breakfast: foodPlanDataByChef.Wednesday_Breakfast,
                                    Wednesday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Wednesday_Breakfast),
                                    Wednesday_Lunch: foodPlanDataByChef.Wednesday_Lunch,
                                    Wednesday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Wednesday_Lunch),
                                    Wednesday_Dinner: foodPlanDataByChef.Wednesday_Dinner,
                                    Wednesday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Wednesday_Dinner),
                                    Thursday_Breakfast: foodPlanDataByChef.Thursday_Breakfast,
                                    Thursday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Thursday_Breakfast),
                                    Thursday_Lunch: foodPlanDataByChef.Thursday_Lunch,
                                    Thursday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Thursday_Lunch),
                                    Thursday_Dinner: foodPlanDataByChef.Thursday_Dinner,
                                    Thursday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Thursday_Dinner),
                                    Friday_Breakfast: foodPlanDataByChef.Friday_Breakfast,
                                    Friday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Friday_Breakfast),
                                    Friday_Lunch: foodPlanDataByChef.Friday_Lunch,
                                    Friday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Friday_Lunch),
                                    Friday_Dinner: foodPlanDataByChef.Friday_Dinner,
                                    Friday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Friday_Dinner),
                                    Saturday_Breakfast: foodPlanDataByChef.Saturday_Breakfast,
                                    Saturday_Breakfast_Chef: await fetchChef (foodPlanDataByChef.Saturday_Breakfast),
                                    Saturday_Lunch: foodPlanDataByChef.Saturday_Lunch,
                                    Saturday_Lunch_Chef: await fetchChef (foodPlanDataByChef.Saturday_Lunch),
                                    Saturday_Dinner: foodPlanDataByChef.Saturday_Dinner,
                                    Saturday_Dinner_Chef: await fetchChef (foodPlanDataByChef.Saturday_Dinner),
                                    Receiver_Name: foodPlanDataByChef.Receiver_Name,
                                    Order_For: foodPlanDataByChef.Order_For,
                                    Other_Mentions: foodPlanDataByChef.Other_Mentions,
                                    Days: foodPlanDataByChef.Days,
                                    Meal_Timing: foodPlanDataByChef.Meal_Timing,
                                    Allergens: foodPlanDataByChef.Allergens,
                                    Spice_Level: foodPlanDataByChef.Spice_Level,
                                    Meal_Types: foodPlanDataByChef.Meal_Types,
                                    Secondary_Cuisine: foodPlanDataByChef.Secondary_Cuisine,
                                    Primary_Cuisine: foodPlanDataByChef.Primary_Cuisine,
                                    name: foodPlanDataByChef.name,
                                    totalBill : foodPlanDataByChef.totalBill,
                                    Sunday_Breakfast_Meal: foodPlanDataByChef.Sunday_Breakfast_Meal,
                                    Sunday_Lunch_Meal: foodPlanDataByChef.Sunday_Lunch_Meal,
                                    Sunday_Dinner_Meal: foodPlanDataByChef.Sunday_Dinner_Meal,	
                                    Monday_Breakfast_Meal: foodPlanDataByChef.Monday_Breakfast_Meal,
                                    Monday_Lunch_Meal: foodPlanDataByChef.Monday_Lunch_Meal,
                                    Monday_Dinner_Meal: foodPlanDataByChef.Monday_Dinner_Meal,		
                                    Tuesday_Breakfast_Meal: foodPlanDataByChef.Tuesday_Breakfast_Meal,
                                    Tuesday_Lunch_Meal: foodPlanDataByChef.Tuesday_Lunch_Meal,		
                                    Tuesday_Dinner_Meal:  foodPlanDataByChef.Tuesday_Dinner_Meal,				
                                    Wednesday_Breakfast_Meal: foodPlanDataByChef.Wednesday_Breakfast_Meal,
                                    Wednesday_Lunch_Meal: foodPlanDataByChef.Wednesday_Lunch_Meal,						
                                    Wednesday_Dinner_Meal: foodPlanDataByChef.Wednesday_Dinner_Meal,
                                    Thursday_Breakfast_Meal:  foodPlanDataByChef.Thursday_Breakfast_Meal,
                                    Thursday_Lunch_Meal:  foodPlanDataByChef.Thursday_Lunch_Meal,		
                                    Thursday_Dinner_Meal:  foodPlanDataByChef.Thursday_Dinner_Meal,						
                                    Friday_Breakfast_Meal: foodPlanDataByChef.Friday_Breakfast_Meal,
                                    Friday_Lunch_Meal: foodPlanDataByChef.Friday_Lunch_Meal,
                                    Friday_Dinner_Meal: foodPlanDataByChef.Friday_Dinner_Meal,	
                                    Saturday_Breakfast_Meal: foodPlanDataByChef.Saturday_Breakfast_Meal,
                                    Saturday_Lunch_Meal: foodPlanDataByChef.Saturday_Lunch_Meal,		
                                    Saturday_Dinner_Meal: foodPlanDataByChef.Saturday_Dinner_Meal,
                                    totalBill:foodPlanDataByChef.totalBill,
                                    zesty_margin:foodPlanDataByChef.zesty_margin,
                                    membership:foodPlanDataByChef.membership,
                                    total_revenue:foodPlanDataByChef.total_revenue
                                };
                                text += (saveObject.Sunday_Breakfast)? `<br>
                                <p>Sunday Breakfast - ${await  getdishdetails(saveObject.Sunday_Breakfast)}  ${await getsidedishdetails(saveObject.Sunday_Breakfast_Meal)} </p>`:""
                                text += (saveObject.Sunday_Lunch)? `
                                <p>Sunday Lunch - ${await  getdishdetails(saveObject.Sunday_Lunch)}  ${await getsidedishdetails(saveObject.Sunday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Sunday_Dinner)? `
                                <p>Sunday Dinner - ${await  getdishdetails(saveObject.Sunday_Dinner)}  ${await getsidedishdetails(saveObject.Sunday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Monday_Breakfast)? `
                                <p>Monday Breakfast - ${await  getdishdetails(saveObject.Monday_Breakfast)}  ${await getsidedishdetails(saveObject.Monday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Monday_Lunch)? `
                                <p>Monday Lunch - ${await  getdishdetails(saveObject.Monday_Lunch)}  ${await getsidedishdetails(saveObject.Monday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Monday_Dinner)? `
                                <p>Monday Dinner -${await  getdishdetails(saveObject.Monday_Dinner)}  ${await getsidedishdetails(saveObject.Monday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Tuesday_Breakfast)? `
                                <p>Tuesday Breakfast - ${await  getdishdetails(saveObject.Tuesday_Breakfast)}  ${await getsidedishdetails(saveObject.Tuesday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Tuesday_Lunch)? `
                                <p>Tuesday Lunch - ${await  getdishdetails(saveObject.Tuesday_Lunch)}  ${await getsidedishdetails(saveObject.Tuesday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Tuesday_Dinner)? `
                                <p>Tuesday Dinner - ${await  getdishdetails(saveObject.Tuesday_Dinner)}  ${await getsidedishdetails(saveObject.Tuesday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Wednesday_Breakfast)? `
                                <p>Wednesday Breakfast - ${await  getdishdetails(saveObject.Wednesday_Breakfast)}  ${await getsidedishdetails(saveObject.Wednesday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Wednesday_Lunch)? `
                                <p> Wednesday Lunch -${await  getdishdetails(saveObject.Wednesday_Lunch)}  ${await getsidedishdetails(saveObject.Wednesday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Wednesday_Dinner)? `
                                <p>Wednesday Dinner -${await  getdishdetails(saveObject.Wednesday_Dinner)}  ${await getsidedishdetails(saveObject.Wednesday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Thursday_Breakfast)? `
                                <p>Thrusday Breakfast -${await  getdishdetails(saveObject.Thursday_Breakfast)}  ${await getsidedishdetails(saveObject.Thursday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Thursday_Lunch)? `
                                <p>Thrusday Lunch - ${await  getdishdetails(saveObject.Thursday_Lunch)}  ${await getsidedishdetails(saveObject.Thursday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Thursday_Dinner)? `
                                <p>Thrusday Dinner - ${await  getdishdetails(saveObject.Thursday_Dinner)}  ${await getsidedishdetails(saveObject.Thursday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Friday_Breakfast)? `
                                <p>Friday Breakfast - ${await  getdishdetails(saveObject.Friday_Breakfast)}  ${await getsidedishdetails(saveObject.Friday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Friday_Lunch)? `
                                <p>Friday Lunch - ${await  getdishdetails(saveObject.Friday_Lunch)}  ${await getsidedishdetails(saveObject.Friday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Friday_Dinner)? `
                                <p>Friday Dinner -${await  getdishdetails(saveObject.Friday_Dinner)}  ${await getsidedishdetails(saveObject.Friday_Dinner_Meal)}</p>`:""
                                text += (saveObject.Saturday_Breakfast)? `
                                <p>Saturday Breakfast -${await  getdishdetails(saveObject.Saturday_Breakfast)}  ${await getsidedishdetails(saveObject.Saturday_Breakfast_Meal)}</p>`:""
                                text += (saveObject.Saturday_Lunch)? `
                                <p>Saturday Lunch - ${await  getdishdetails(saveObject.Saturday_Lunch)}  ${await getsidedishdetails(saveObject.Saturday_Lunch_Meal)}</p>`:""
                                text += (saveObject.Saturday_Dinner)? `
                                <p>Saturday Dinner - ${await  getdishdetails(saveObject.Saturday_Dinner)}  ${await getsidedishdetails(saveObject.Saturday_Dinner_Meal)}</p>`:""
                                text +=  '<br>' +
                                `<p>your order price is ${foodPlanDataByChef.totalBill}</p>`
                                console.log(text)
                                let subject = "Food plan for the week "
                                let email = userData.email
                                await service.reminderservice(text,email,subject)
                                let createNext = await foodplans.model.create(saveObject);
                            }
                        }
                    }
                
            } catch (error) {
                console.log(error, "Error from previous foodplan update cron")
            }
        }, null, true, 'Asia/Kolkata');
        previousFoodPlanUpdate.start();

    } catch (error) {
		console.log(error);
	}
};

module.exports = cronService;
