var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
let keystone = require('keystone');
let foodplans = keystone.list('Foodplan');
let dishes = keystone.list('Dishes');
let Chef = keystone.list('Chef');
const Handlebars = require("handlebars");
let users = keystone.list('User');
let userDish = keystone.list("UserDish");
let side_dish = keystone.list('side_dish');
let moment = require('moment');


async function updateMealPrevious (extra_details , standard_details){
	let common_dish = extra_details.concat(standard_details)
	let resp = []
	for (let val of common_dish) {
		let findsideDish = await side_dish.model.findOne({_id : val})
		const newUserDish = await userDish.model.create({
			name : findsideDish.name,
			count : findsideDish.default_count,
			dish : findsideDish._id
		})
		resp.push(newUserDish._id)
	}
	return resp
}

async function fetchChef (dishId) {
	if (dishId) {
		const dishDetail = await dishes.model.findOne({_id : dishId}).populate('chef')
		console.log(dishDetail,'DISH DETAIl')
		console.log(dishDetail.chef._id,'CHEF ID')
		return dishDetail.chef._id
	}
}

const foodEntry = (val,foodTime) => {
	if(val[foodTime] != ""){
		let data =  {
			'Customer_Name': val.Customer_Name,
			'dish': val[`${foodTime}`],
			'allergy': val.allergy,
			'adult_count': val.adult_count,
			'children_count': val.children_count,
		}
		foodTime = foodTime.split("_")
		if(foodTime[1]=="Breakfast") data['Timing'] = val.Breakfast_Time_Interval
		if(foodTime[1]=="Lunch") data['Timing'] = val.Lunch_Time_Interval
		if(foodTime[1]=="Dinner") data['Timing'] = val.Dinner_Time_Interval
		return data
	}else{
		return ""
	}
}

module.exports = {
	newemailservice: async (link, email, subject) => {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		const msg = {
			to: email,
			from: process.env.EMAIL,
			subject: subject,
			text: "click here to verify- " + link,
			// html: '<strong>${link}</strong>',
		}
		sgMail
			.send(msg)
			.then(() => {
				console.log('Email sent')
			})
			.catch((error) => {
				console.error(error);
			})
	},

	reminderservice: async (html, email, subject) => {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		console.log(html, "----------------------111111111111111111111111111111")
		const msg = {
			to: email,
			from: process.env.EMAIL,
			subject: subject,
			html: html
		}
		sgMail
			.send(msg)
			.then(() => {
				console.log('Email sent')
			})
			.catch((error) => {
				console.error(error);
			})
	},

	makeDayData: async (variableName, mailMessageToAdd, daytime) => {
		try {
			if (!variableName) {
				variableName = `${daytime[0]}: ${daytime[1]}- `
			}
			variableName += mailMessageToAdd
		} catch (err) {
			console.error(error);
		}
	},
	chefMailForNextWeek: async () => {
		try {
			let chefs = await Chef.model.find({})
			for await (let item of chefs) { 
				if (item.email) {
					let html = `Hello, Below is the link of your Dishes.
					<a href={{link}}> {{link}} </a>`;
					let subject = "Dishes for the next week";
					const template = Handlebars.compile(html);
					let mailHtml = template({
						link: `${process.env.webBaseUrl}/chef/${item.name}`,
					});
					let mailSendData = await module.exports.reminderservice(mailHtml, [item.email,'praveena.nadi@gmail.com','gaganpreetkaur@yahoo.com'], subject);
				}
			}
		} catch (err) {
			console.log(err)
		}
	},
	
	createChefMail : ( details ) => {
		let response = {
			'Sunday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Monday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Tuesday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Wednesday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Thursday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Friday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			},'Saturday' : {
			  'Lunch': [],
			  'Breakfast': [],
			  'Dinner': []
			}
		  }
		  
		  
		  for (let val of details) {

			let meals = [
				'Sunday_Breakfast',
				'Sunday_Lunch',
				'Sunday_Dinner',
				'Monday_Breakfast',
				'Monday_Lunch',
				'Monday_Dinner',
				'Tuesday_Breakfast',
				'Tuesday_Lunch',
				'Tuesday_Dinner',
				'Wednesday_Breakfast',
				'Wednesday_Lunch',
				'Wednesday_Dinner',
				'Thursday_Breakfast',
				'Thursday_Lunch',
				'Thursday_Dinner',
				'Friday_Breakfast',
				'Friday_Lunch',
				'Friday_Dinner',
				'Saturday_Breakfast',
				'Saturday_Lunch',
				'Saturday_Dinner'
			  ]

			for (let meal of meals){
				if(foodEntry(val,meal)==""){

				}else{
					let dayandtime = meal.split("_")
					response[`${dayandtime[0]}`][`${dayandtime[1]}`].push(foodEntry(val,meal))
				}
			}
		}
		  
		return response
	},

	previousFoodPlanUpdate: async () => {
		let allUsers = await users.model.find({'pauseSubscription': false}).lean();
		let upcomingSunday = new Date();
		upcomingSunday = upcomingSunday.setDate(
			upcomingSunday.getDate() + ((0 - 1 - upcomingSunday.getDay() + 7) % 7) + 1
		);
		upcomingSunday = new Date(upcomingSunday);
		console.log(upcomingSunday,'UPCOMING SUNDAY')
		let lastTolastweekSaturday = new Date(Date.now() - 12096e5)
		console.log(new Date(lastTolastweekSaturday),'LAST TO LAST WEEK SATURDAY')
		for (let userData of allUsers) {
			let foodPlanDataExist = await foodplans.model
				.findOne({
					user: userData._id,
					enddate: {
						$gte: upcomingSunday,
					},
				}).lean();
				if (!foodPlanDataExist) {
				console.log(lastTolastweekSaturday,'<<<<<<<<<<<<<<<<<<<<<<')
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

					console.log(',,,,,,,,,,,,,,,,,,,,,,')
					let today = new Date();
					let daynumber = today.getDay();
					let startdate = (7 - daynumber);
					let enddate = (7 - daynumber) + 6;
					let startday = moment(today, "YYYY-MM-DD").add(startdate, 'days').set("hour", 0).set("minute", 0).set("seconds", 0)
					let endday = moment(today, "YYYY-MM-DD").add(enddate,'days' ).set("hour", 0).set("minute", 0).set("seconds", 0)
					console.log(startday,endday,'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
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

						Sunday_Breakfast_Meal: await updateMealPrevious (foodPlanDataByChef.Sunday_Breakfast_Extra,foodPlanDataByChef.Sunday_Breakfast_Standard  ) ,
						Sunday_Lunch_Meal: await updateMealPrevious (foodPlanDataByChef.Sunday_Lunch_Extra,foodPlanDataByChef.Sunday_Lunch_Standard  ),
						Sunday_Dinner_Meal: await updateMealPrevious(foodPlanDataByChef.Sunday_Dinner_Extra,foodPlanDataByChef.Sunday_Dinner_Standard  ),
						
						Monday_Breakfast_Meal: await updateMealPrevious(foodPlanDataByChef.Monday_Breakfast_Extra,foodPlanDataByChef.Monday_Breakfast_Standard  ) ,
						Monday_Lunch_Meal: await updateMealPrevious(foodPlanDataByChef.Monday_Lunch_Extra,foodPlanDataByChef.Monday_Lunch_Standard  ) ,
						Monday_Dinner_Meal: await updateMealPrevious(foodPlanDataByChef.Monday_Dinner_Extra,foodPlanDataByChef.Monday_Dinner_Standard  ) ,
						
						Tuesday_Breakfast_Meal: await updateMealPrevious(foodPlanDataByChef.Tuesday_Breakfast_Extra,foodPlanDataByChef.Tuesday_Breakfast_Standard  ) ,
						Tuesday_Lunch_Meal: await updateMealPrevious(foodPlanDataByChef.Tuesday_Lunch_Extra,foodPlanDataByChef.Tuesday_Lunch_Standard  ) ,
						Tuesday_Dinner_Meal:  await updateMealPrevious(foodPlanDataByChef.Tuesday_Dinner_Extra,foodPlanDataByChef.Tuesday_Dinner_Standard  ) ,
						
						Wednesday_Breakfast_Meal:  await updateMealPrevious(foodPlanDataByChef.Wednesday_Breakfast_Extra,foodPlanDataByChef.Wednesday_Breakfast_Standard  ) ,
						Wednesday_Lunch_Meal: await updateMealPrevious(foodPlanDataByChef.Wednesday_Lunch_Extra,foodPlanDataByChef.Wednesday_Lunch_Standard  ) ,
						Wednesday_Dinner_Meal: await updateMealPrevious(foodPlanDataByChef.Wednesday_Dinner_Extra,foodPlanDataByChef.Wednesday_Dinner_Standard  ) ,
						
						Thursday_Breakfast_Meal: await updateMealPrevious(foodPlanDataByChef.Thursday_Breakfast_Extra,foodPlanDataByChef.Thursday_Breakfast_Standard  ) ,
						Thursday_Lunch_Meal:  await updateMealPrevious(foodPlanDataByChef.Thursday_Lunch_Extra,foodPlanDataByChef.Thursday_Lunch_Standard  ) ,
						Thursday_Dinner_Meal:  await updateMealPrevious(foodPlanDataByChef.Thursday_Dinner_Extra,foodPlanDataByChef.Thursday_Dinner_Standard  ) ,
						
						Friday_Breakfast_Meal: await updateMealPrevious(foodPlanDataByChef.Friday_Breakfast_Extra,foodPlanDataByChef.Friday_Breakfast_Standard  ) ,
						Friday_Lunch_Meal: await updateMealPrevious(foodPlanDataByChef.Friday_Lunch_Extra,foodPlanDataByChef.Friday_Lunch_Standard  ) ,
						Friday_Dinner_Meal: await updateMealPrevious(foodPlanDataByChef.Friday_Dinner_Extra,foodPlanDataByChef.Friday_Dinner_Standard  ) ,
						
						Saturday_Breakfast_Meal: await updateMealPrevious(foodPlanDataByChef.Saturday_Breakfast_Extra,foodPlanDataByChef.Saturday_Breakfast_Standard  ) ,
						Saturday_Lunch_Meal: await updateMealPrevious(foodPlanDataByChef.Saturday_Lunch_Extra,foodPlanDataByChef.Saturday_Lunch_Standard  ) ,
						Saturday_Dinner_Meal: await updateMealPrevious(foodPlanDataByChef.Saturday_Dinner_Extra,foodPlanDataByChef.Saturday_Dinner_Standard  ) ,

					};

					let createNext = await foodplans.model.create(saveObject);
				}
			}
		}
	}
}