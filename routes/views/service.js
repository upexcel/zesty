var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
let keystone = require('keystone');
let foodplans = keystone.list('Foodplan');
let dishes = keystone.list('Dishes');
let Chef = keystone.list('Chef');

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
			let allDishes = await dishes.model.find({}).populate("chef").populate("allergens").populate("Spicelevel").lean()
			let chefs = await Chef.model.find({})

			allDishes = JSON.parse(JSON.stringify(allDishes))
			// data = JSON.parse(JSON.stringify(data))
			let daysMeal = ["Sunday_Breakfast", "Sunday_Lunch", "Sunday_Dinner", "Monday_Breakfast", "Monday_Lunch", "Monday_Dinner", "Tuesday_Breakfast", "Tuesday_Lunch", "Tuesday_Dinner", "Wednesday_Breakfast", "Wednesday_Lunch", "Wednesday_Dinner", "Thursday_Breakfast", "Thursday_Lunch", "Thursday_Dinner", "Friday_Breakfast", "Friday_Lunch", "Friday_Dinner", "Saturday_Breakfast", "Saturday_Lunch", "Saturday_Dinner"]

			for await (let item of chefs) {
				if (item.email) {
					let dishData = await dishes.model.find({
						chef: item._id
					})
					console.log(dishData.length)
					let dishIds = dishData.map(val => {
						return val._id
					})
					console.log(dishIds.length)
					let mailMessage = `Hey ${item.name},<br/>
Your menu for the week is:<br/>`
					let foodPlanDataByChef = await foodplans.model.find({
						$or: [{
							"Sunday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Sunday_Lunch": {
								$in: dishIds
							}
						}, {
							"Sunday_Dinner": {
								$in: dishIds
							}
						}, {
							"Monday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Monday_Lunch": {
								$in: dishIds
							}
						}, {
							"Monday_Dinner": {
								$in: dishIds
							}
						}, {
							"Tuesday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Tuesday_Lunch": {
								$in: dishIds
							}
						}, {
							"Tuesday_Dinner": {
								$in: dishIds
							}
						}, {
							"Wednesday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Wednesday_Lunch": {
								$in: dishIds
							}
						}, {
							"Wednesday_Dinner": {
								$in: dishIds
							}
						}, {
							"Thursday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Thursday_Lunch": {
								$in: dishIds
							}
						}, {
							"Thursday_Dinner": {
								$in: dishIds
							}
						}, {
							"Friday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Friday_Lunch": {
								$in: dishIds
							}
						}, {
							"Friday_Dinner": {
								$in: dishIds
							}
						}, {
							"Saturday_Breakfast": {
								$in: dishIds
							}
						}, {
							"Saturday_Lunch": {
								$in: dishIds
							}

						}, {
							"Saturday_Dinner": {
								$in: dishIds
							}

						}],
						startdate: {
							$gt: new Date()
						}
					})
					foodPlanDataByChef = JSON.parse(JSON.stringify(foodPlanDataByChef))
					let Sunday_Breakfast = ``
					let Sunday_Lunch = ``
					let Sunday_Dinner = ``
					let Monday_Breakfast = ``
					let Monday_Lunch = ``
					let Monday_Dinner = ``
					let Tuesday_Breakfast = ``
					let Tuesday_Lunch = ``
					let Tuesday_Dinner = ``
					let Wednesday_Breakfast = ``
					let Wednesday_Lunch = ``
					let Wednesday_Dinner = ``
					let Thursday_Breakfast = ``
					let Thursday_Lunch = ``
					let Thursday_Dinner = ``
					let Friday_Breakfast = ``
					let Friday_Lunch = ``
					let Friday_Dinner = ``
					let Saturday_Breakfast = ``
					let Saturday_Lunch = ``
					let Saturday_Dinner = ``
					if (Sunday_Breakfast) {
						console.log("1212121212121212")
					} else {
						console.log("121211sas1212121212")
					}
					
					if (foodPlanDataByChef.length) {
						for await (let foodPlan of foodPlanDataByChef) {
							for await (let val of daysMeal) {
								if (foodPlan[val]) {
									console.log(allDishes.length, foodPlan[val], "009900899")
									let dish = allDishes.find((value) => {
										// console.log(typeof value._id, "0-0", typeof foodPlan[val])
										return value._id == foodPlan[val]
									})
									if (dish && dish.chef && dish.chef.name == item.name) {
										console.log(dish.chef.name, item.name, "jjjjjjjjjjjjjjjjjjj")
										let daytime = val.split('_')
										// if
										let mailMessageToAdd = `, ${dish.name}=> ${foodPlan.Spice_Level[0]} spicy`
										if (foodPlan.Allergens.length && foodPlan.Allergens[0] != "Nothing") {
											mailMessageToAdd += ` and ${foodPlan.Allergens.toString()} allergy`
										}
										if (val === "Sunday_Breakfast") {
											if (!Sunday_Breakfast) {
												Sunday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Sunday_Breakfast += mailMessageToAdd
										}
										if (val === "Sunday_Lunch") {
											if (!Sunday_Lunch) {
												Sunday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Sunday_Lunch += mailMessageToAdd
										}
										if (val === "Sunday_Dinner") {
											if (!Sunday_Dinner) {
												Sunday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Sunday_Dinner += mailMessageToAdd
										}
										if (val === "Monday_Breakfast") {
											if (!Monday_Breakfast) {
												Monday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Monday_Breakfast += mailMessageToAdd
										}
										if (val === "Monday_Lunch") {
											if (!Monday_Lunch) {
												Monday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Monday_Lunch += mailMessageToAdd
										}
										if (val === "Monday_Dinner") {
											if (!Monday_Dinner) {
												Monday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Monday_Dinner += mailMessageToAdd
										}
										if (val === "Tuesday_Breakfast") {
											if (!Tuesday_Breakfast) {
												Tuesday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Tuesday_Breakfast += mailMessageToAdd
										}
										if (val === "Tuesday_Lunch") {
											if (!Tuesday_Lunch) {
												Tuesday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Tuesday_Lunch += mailMessageToAdd
										}
										if (val === "Tuesday_Dinner") {
											if (!Tuesday_Dinner) {
												Tuesday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Tuesday_Dinner += mailMessageToAdd
										}
										if (val === "Wednesday_Breakfast") {
											if (!Wednesday_Breakfast) {
												Wednesday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Wednesday_Breakfast += mailMessageToAdd
										}
										if (val === "Wednesday_Lunch") {
											if (!Wednesday_Lunch) {
												Wednesday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Wednesday_Lunch += mailMessageToAdd
										}
										if (val === "Wednesday_Dinner") {
											if (!Wednesday_Dinner) {
												Wednesday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Wednesday_Dinner += mailMessageToAdd
										}
										if (val === "Thursday_Breakfast") {
											if (!Thursday_Breakfast) {
												Thursday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Thursday_Breakfast += mailMessageToAdd
										}
										if (val === "Thursday_Lunch") {
											if (!Thursday_Lunch) {
												Thursday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Thursday_Lunch += mailMessageToAdd
										}
										if (val === "Thursday_Dinner") {
											if (!Thursday_Dinner) {
												Thursday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Thursday_Dinner += mailMessageToAdd
										}
										if (val === "Friday_Breakfast") {
											if (!Friday_Breakfast) {
												Friday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Friday_Breakfast += mailMessageToAdd
										}
										if (val === "Friday_Lunch") {
											if (!Friday_Lunch) {
												Friday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Friday_Lunch += mailMessageToAdd
										}
										if (val === "Friday_Dinner") {
											if (!Friday_Dinner) {
												Friday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Friday_Dinner += mailMessageToAdd
										}
										if (val === "Saturday_Breakfast") {
											if (!Saturday_Breakfast) {
												Saturday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
											}
											Saturday_Breakfast += mailMessageToAdd
										}
										if (val === "Saturday_Lunch") {
											if (!Saturday_Lunch) {
												Saturday_Lunch = `${daytime[0]}: ${daytime[1]}- `
											}
											Saturday_Lunch += mailMessageToAdd
										}
										if (val === "Saturday_Dinner") {
											if (!Saturday_Dinner) {
												Saturday_Dinner = `${daytime[0]}: ${daytime[1]}- `
											}
											Saturday_Dinner += mailMessageToAdd
										}
										// mailMessage += `<br/>`
									}
								}
							}
						}
						// if()
						mailMessage += Sunday_Breakfast ? `${Sunday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Sunday_Lunch ? `${Sunday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Sunday_Dinner ? `${Sunday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Monday_Breakfast ? `${Monday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Monday_Lunch ? `${Monday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Monday_Dinner ? `${Monday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Tuesday_Breakfast ? `${Tuesday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Tuesday_Lunch ? `${Tuesday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Tuesday_Dinner ? `${Tuesday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Wednesday_Breakfast ? `${Wednesday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Wednesday_Lunch ? `${Wednesday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Wednesday_Dinner ? `${Wednesday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Thursday_Breakfast ? `${Thursday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Thursday_Lunch ? `${Thursday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Thursday_Dinner ? `${Thursday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Friday_Breakfast ? `${Friday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Friday_Lunch ? `${Friday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Friday_Dinner ? `${Friday_Dinner.replace("- , ","- ")}<br/>` : ''
						mailMessage += Saturday_Breakfast ? `${Saturday_Breakfast.replace("- , ","- ")}<br/>` : ''
						mailMessage += Saturday_Lunch ? `${Saturday_Lunch.replace("- , ","- ")}<br/>` : ''
						mailMessage += Saturday_Dinner ? `${Saturday_Dinner.replace("- , ","- ")}` : ''
						console.log(Saturday_Dinner, "asjalsaklsalksjalskj")
						let mailSendData = await module.exports.reminderservice(mailMessage, item.email, "Dishes for the next week");
					}
					console.log(mailMessage, "asasaasasasasas")
				}
			}
			return "data";
		} catch (err) {
			console.log(err)
		}
	}
}
