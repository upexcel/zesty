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
const systemDates = keystone.list('SystemDates');

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
	} else {
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
			text: "click here to verify- " + link
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
		console.log(html, "HTML SENDING MAIL")
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

	createChefMail : ( details ) => {
		let response = {
			'Sunday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Monday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Tuesday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Wednesday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Thursday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Friday' : {
			  'Breakfast': [],
			  'Lunch': [],
			  'Dinner': []
			},'Saturday' : {
			  'Breakfast': [],
			  'Lunch': [],
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
				} else {
					let dayandtime = meal.split("_")
					response[`${dayandtime[0]}`][`${dayandtime[1]}`].push(foodEntry(val,meal))
				}
			}
		}
		  
		return response
	},

}