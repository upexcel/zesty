var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
let keystone = require('keystone');
let foodplans = keystone.list('Foodplan');
let dishes = keystone.list('Dishes');
let Chef = keystone.list('Chef');
let users = keystone.list('User');
let side_dish = keystone.list('side_dish');
let moment = require('moment');

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
					let statement = '';
					if (foodPlanDataByChef.length) {
						for await (let foodPlan of foodPlanDataByChef) {
							console.log(foodPlan._id,'_ID')
							let Customer_Name = ''
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
							let foodPlanMessage = '';
							if (Sunday_Breakfast) {
								console.log("1212121212121212")
							} else {
								console.log("121211sas1212121212")
							}
							
							console.log(foodPlan,'FOOD PLAN')
							Customer_Name = `${foodPlan.name.first} ${foodPlan.name.last}`
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
										let mailMessageToAdd = `${dish.name}=> ${foodPlan.Spice_Level[0]} spicy`
										if (foodPlan.Allergens.length && foodPlan.Allergens[0] != "Nothing") {
											mailMessageToAdd += ` and ${foodPlan.Allergens.toString()} allergy`
										}
										if (val === "Sunday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Sunday_Breakfast) {
												Sunday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Sunday_Breakfast_Extra && foodPlan.Sunday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Sunday_Breakfast_Standard && foodPlan.Sunday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Sunday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Sunday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Sunday_Breakfast += ` and extra ${extraText.join(',')}`

											}
										}
										if (val === "Sunday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Sunday_Lunch) {
												Sunday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Sunday_Lunch_Extra && foodPlan.Sunday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Sunday_Lunch_Standard && foodPlan.Sunday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Sunday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Sunday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Sunday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Sunday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Sunday_Dinner) {
												Sunday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Sunday_Dinner_Extra && foodPlan.Sunday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Sunday_Dinner_Standard && foodPlan.Sunday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Sunday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Sunday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Sunday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Sunday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Monday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Monday_Breakfast) {
												Monday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Monday_Breakfast_Extra && foodPlan.Monday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Monday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Monday_Breakfast_Standard && foodPlan.Monday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Monday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Monday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Monday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Monday_Breakfast += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Monday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Monday_Lunch) {
												Monday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Monday_Lunch_Extra && foodPlan.Monday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Monday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Monday_Lunch_Standard && foodPlan.Monday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Monday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Monday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Monday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Monday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Monday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Monday_Dinner) {
												Monday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Monday_Dinner_Extra && foodPlan.Monday_Dinner_Extra.length ) {
													console.log(foodPlan.Monday_Dinner_Extra,'EXTRAAAAAAAAAAAAAAAAA')
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Monday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Monday_Dinner_Standard && foodPlan.Monday_Dinner_Standard.length ) {
													console.log(foodPlan.Monday_Dinner_Standard,'EXTRAAAAAAAAAAAAAAAAA')
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Monday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Monday_Dinner += mailMessageToAdd
											console.log(standardText,'STANDARD TEXT')
											if (standardText.length) {
												console.log("INSIDE")
												Monday_Dinner += ` with ${standardText.join(',')}`
											}
											console.log(extraText,'EXTRA TEXT')
											if (extraText.length) {
												console.log('INSIDE EXTRA')
												Monday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Tuesday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Tuesday_Breakfast) {
												Tuesday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Tuesday_Breakfast_Extra && foodPlan.Tuesday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Tuesday_Breakfast_Standard && foodPlan.Tuesday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Tuesday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Tuesday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Tuesday_Breakfast += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Tuesday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Tuesday_Lunch) {
												Tuesday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Tuesday_Lunch_Extra && foodPlan.Tuesday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Tuesday_Lunch_Standard && foodPlan.Tuesday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Tuesday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Tuesday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Tuesday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Tuesday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Tuesday_Dinner) {
												Tuesday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Tuesday_Dinner_Extra && foodPlan.Tuesday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Tuesday_Dinner_Standard && foodPlan.Tuesday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Tuesday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Tuesday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Tuesday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Tuesday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Wednesday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Wednesday_Breakfast) {
												Wednesday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Wednesday_Breakfast_Extra && foodPlan.Wednesday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Wednesday_Breakfast_Standard && foodPlan.Wednesday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Wednesday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Wednesday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Wednesday_Breakfast += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Wednesday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Wednesday_Lunch) {
												Wednesday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Wednesday_Lunch_Extra && foodPlan.Wednesday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Wednesday_Lunch_Standard && foodPlan.Wednesday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Wednesday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Wednesday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Wednesday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Wednesday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Wednesday_Dinner) {
												Wednesday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Wednesday_Dinner_Extra && foodPlan.Wednesday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Wednesday_Dinner_Standard && foodPlan.Wednesday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Wednesday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Wednesday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Wednesday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Wednesday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Thursday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Thursday_Breakfast) {
												Thursday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Thursday_Breakfast_Extra && foodPlan.Thursday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Thursday_Breakfast_Standard && foodPlan.Thursday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Thursday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Thursday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Thursday_Breakfast += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Thursday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Thursday_Lunch) {
												Thursday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Thursday_Lunch_Extra && foodPlan.Thursday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Thursday_Lunch_Standard && foodPlan.Thursday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Thursday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Thursday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Thursday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Thursday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Thursday_Dinner) {
												Thursday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Thursday_Dinner_Extra && foodPlan.Thursday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Thursday_Dinner_Standard && foodPlan.Thursday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Thursday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Thursday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Thursday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Thursday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Friday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Friday_Breakfast) {
												Friday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Friday_Breakfast_Extra && foodPlan.Friday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Friday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Friday_Breakfast_Standard && foodPlan.Friday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Friday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Friday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Friday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Friday_Breakfast += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Friday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Friday_Lunch) {
												Friday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Friday_Lunch_Extra && foodPlan.Friday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Friday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Friday_Lunch_Standard && foodPlan.Friday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Friday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Friday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Friday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Friday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Friday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Friday_Dinner) {
												Friday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Friday_Dinner_Extra && foodPlan.Friday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Friday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Friday_Dinner_Standard && foodPlan.Friday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Friday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Friday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Friday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Friday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Saturday_Breakfast") {
											let extraText = []
											let standardText = []
											if (!Saturday_Breakfast) {
												Saturday_Breakfast = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Saturday_Breakfast_Extra && foodPlan.Saturday_Breakfast_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Breakfast_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Saturday_Breakfast_Standard && foodPlan.Saturday_Breakfast_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Breakfast_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Saturday_Breakfast += mailMessageToAdd
											if (standardText.length) {
												Saturday_Breakfast += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Saturday_Breakfast += ` and extra ${` and extra ${extraText.join(',')}`}`
											}
										}
										if (val === "Saturday_Lunch") {
											let extraText = []
											let standardText = []
											if (!Saturday_Lunch) {
												Saturday_Lunch = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.Saturday_Lunch_Extra && foodPlan.Saturday_Lunch_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Lunch_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Saturday_Lunch_Standard && foodPlan.Saturday_Lunch_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Lunch_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Saturday_Lunch += mailMessageToAdd
											if (standardText.length) {
												Saturday_Lunch += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Saturday_Lunch += ` and extra ${extraText.join(',')}`
											}
										}
										if (val === "Saturday_Dinner") {
											let extraText = []
											let standardText = []
											if (!Saturday_Dinner) {
												Saturday_Dinner = `${daytime[0]}: ${daytime[1]}- `
												if (foodPlan.SSaturday_Dinner_Extra && foodPlan.Saturday_Dinner_Extra.length ) {
													let sideExtra = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Dinner_Extra}}) 
													for (let detail of sideExtra) {
														if (detail) {
															extraText.push(detail.name)
														}
													}
												}

												if (foodPlan.Saturday_Dinner_Standard && foodPlan.Saturday_Dinner_Standard.length ) {
													let sideStandard = await side_dish.model.find({_id : {$in : foodPlan.Saturday_Dinner_Standard}}) 
													for (let detail of sideStandard) {
														if (detail) {
															standardText.push(detail.name)
														}
													}
												}
											}
											Saturday_Dinner += mailMessageToAdd
											if (standardText.length) {
												Saturday_Dinner += ` with ${standardText.join(',')}`
											}
											if (extraText.length) {
												Saturday_Dinner += ` and extra ${extraText.join(',')}`
											}
										}
										// mailMessage += `<br/>`
									}
								}
							}
							foodPlanMessage += Customer_Name ? `Customer Name: <b>${Customer_Name}</b><br/><br/>` : ''
							foodPlanMessage += Sunday_Breakfast ? `${Sunday_Breakfast}<br/>` : ''
							foodPlanMessage += Sunday_Lunch ? `${Sunday_Lunch}<br/>` : ''
							foodPlanMessage += Monday_Lunch ? `${Monday_Lunch}<br/>` : ''
							foodPlanMessage += Monday_Dinner ? `${Monday_Dinner}<br/>` : ''
							foodPlanMessage += Tuesday_Breakfast ? `${Tuesday_Breakfast}<br/>` : ''
							foodPlanMessage += Monday_Breakfast ? `${Monday_Breakfast}<br/>` : ''
							foodPlanMessage += Tuesday_Lunch ? `${Tuesday_Lunch}<br/>` : ''
							foodPlanMessage += Sunday_Dinner ? `${Sunday_Dinner}<br/>` : ''
							foodPlanMessage += Tuesday_Dinner ? `${Tuesday_Dinner}<br/>` : ''
							foodPlanMessage += Wednesday_Breakfast ? `${Wednesday_Breakfast}<br/>` : ''
							foodPlanMessage += Wednesday_Lunch ? `${Wednesday_Lunch}<br/>` : ''
							foodPlanMessage += Wednesday_Dinner ? `${Wednesday_Dinner}<br/>` : ''
							foodPlanMessage += Thursday_Breakfast ? `${Thursday_Breakfast}<br/>` : ''
							foodPlanMessage += Thursday_Lunch ? `${Thursday_Lunch}<br/>` : ''
							foodPlanMessage += Thursday_Dinner ? `${Thursday_Dinner}<br/>` : ''
							foodPlanMessage += Friday_Breakfast ? `${Friday_Breakfast}<br/>` : ''
							foodPlanMessage += Friday_Lunch ? `${Friday_Lunch}<br/>` : ''
							foodPlanMessage += Friday_Dinner ? `${Friday_Dinner}<br/>` : ''
							foodPlanMessage += Saturday_Breakfast ? `${Saturday_Breakfast}<br/>` : ''
							foodPlanMessage += Saturday_Lunch ? `${Saturday_Lunch}<br/>` : ''
							foodPlanMessage += Saturday_Dinner ? `${Saturday_Dinner}<br/><br/>` : '<br/>'
							statement = statement + foodPlanMessage
						}
					}
					let finalMessage = `${mailMessage}<br/>${statement}`
					console.log(finalMessage,'FINAL MESSAGE')
					let mailSendData = await module.exports.reminderservice(finalMessage, item.email, "Dishes for the next week");
				}
			}
			return "data";
		} catch (err) {
			console.log(err)
		}
	},
	previousFoodPlanUpdate: async () => {
		let allUsers = await users.model.find({'blockFoodPlan': false}).lean();
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
				console.log('QQQQQQQQQQQQQQQQQ<')
				let foodPlanDataByChef = await foodplans.model
					.findOne({
						user: userData._id,
						enddate: {
							$lt: upcomingSunday,	
							$gt: new Date (lastTolastweekSaturday)			 
						},
					})
					.lean();
				if (foodPlanDataByChef) {
					console.log(',,,,,,,,,,,,,,,,,,,,,,')
					let today = new Date();
					let daynumber = today.getDay();
					let startdate = (7 - daynumber);
					let enddate = (7 - daynumber) + 6;
					let startday = moment(today, "YYYY-MM-DD").add('days', startdate).set("hour", 0).set("minute", 0).set("seconds", 0);
					let endday = moment(today, "YYYY-MM-DD").add('days', enddate).set("hour", 0).set("minute", 0).set("seconds", 0);
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
						Sunday_Breakfast_Chef: foodPlanDataByChef.Sunday_Breakfast_Chef,
						Sunday_Lunch: foodPlanDataByChef.Sunday_Lunch,
						Sunday_Lunch_Chef: foodPlanDataByChef.Sunday_Lunch_Chef,
						Sunday_Dinner: foodPlanDataByChef.Sunday_Dinner,
						Sunday_Dinner_Chef: foodPlanDataByChef.Sunday_Dinner_Chef,
						Monday_Breakfast: foodPlanDataByChef.Monday_Breakfast,
						Monday_Breakfast_Chef: foodPlanDataByChef.Monday_Breakfast_Chef,
						Monday_Lunch: foodPlanDataByChef.Monday_Lunch,
						Monday_Lunch_Chef: foodPlanDataByChef.Monday_Lunch_Chef,
						Monday_Dinner: foodPlanDataByChef.Monday_Dinner,
						Monday_Dinner_Chef: foodPlanDataByChef.Monday_Dinner_Chef,
						Tuesday_Breakfast: foodPlanDataByChef.Tuesday_Breakfast,
						Tuesday_Breakfast_Chef: foodPlanDataByChef.Tuesday_Breakfast_Chef,
						Tuesday_Lunch: foodPlanDataByChef.Tuesday_Lunch,
						Tuesday_Lunch_Chef: foodPlanDataByChef.Tuesday_Lunch_Chef,
						Tuesday_Dinner: foodPlanDataByChef.Tuesday_Dinner,
						Tuesday_Dinner_Chef: foodPlanDataByChef.Tuesday_Dinner_Chef,
						Wednesday_Breakfast: foodPlanDataByChef.Wednesday_Breakfast,
						Wednesday_Breakfast_Chef: foodPlanDataByChef.Wednesday_Breakfast_Chef,
						Wednesday_Lunch: foodPlanDataByChef.Wednesday_Lunch,
						Wednesday_Lunch_Chef: foodPlanDataByChef.Wednesday_Lunch_Chef,
						Wednesday_Dinner: foodPlanDataByChef.Wednesday_Dinner,
						Wednesday_Dinner_Chef: foodPlanDataByChef.Wednesday_Dinner_Chef,
						Thursday_Breakfast: foodPlanDataByChef.Thursday_Breakfast,
						Thursday_Breakfast_Chef: foodPlanDataByChef.Thursday_Breakfast_Chef,
						Thursday_Lunch: foodPlanDataByChef.Thursday_Lunch,
						Thursday_Lunch_Chef: foodPlanDataByChef.Thursday_Lunch_Chef,
						Thursday_Dinner: foodPlanDataByChef.Thursday_Dinner,
						Thursday_Dinner_Chef: foodPlanDataByChef.Thursday_Dinner_Chef,
						Friday_Breakfast: foodPlanDataByChef.Friday_Breakfast,
						Friday_Breakfast_Chef: foodPlanDataByChef.Friday_Breakfast_Chef,
						Friday_Lunch: foodPlanDataByChef.Friday_Lunch,
						Friday_Lunch_Chef: foodPlanDataByChef.Friday_Lunch_Chef,
						Friday_Dinner: foodPlanDataByChef.Friday_Lunch,
						Friday_Dinner_Chef: foodPlanDataByChef.Friday_Dinner_Chef,
						Saturday_Breakfast: foodPlanDataByChef.Saturday_Breakfast,
						Saturday_Breakfast_Chef: foodPlanDataByChef.Saturday_Breakfast_Chef,
						Saturday_Lunch: foodPlanDataByChef.Saturday_Breakfast,
						Saturday_Lunch_Chef: foodPlanDataByChef.Saturday_Lunch_Chef,
						Saturday_Dinner: foodPlanDataByChef.Saturday_Breakfast,
						Saturday_Dinner_Chef: foodPlanDataByChef.Saturday_Dinner_Chef,
						Receiver_Name: foodPlanDataByChef.Friday_Dinner,
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
						Sunday_Breakfast_Extra:  foodPlanDataByChef.Sunday_Breakfast_Extra,
						Sunday_Lunch_Extra: foodPlanDataByChef.Sunday_Lunch_Extra,
						Sunday_Dinner_Extra: foodPlanDataByChef.Sunday_Dinner_Extra,
						Monday_Breakfast_Extra:foodPlanDataByChef.Monday_Breakfast_Extra,
						Monday_Lunch_Extra: foodPlanDataByChef.Monday_Lunch_Extra,
						Monday_Dinner_Extra: foodPlanDataByChef.Monday_Dinner_Extra,
						Tuesday_Breakfast_Extra: foodPlanDataByChef.Tuesday_Breakfast_Extra,
						Tuesday_Lunch_Extra: foodPlanDataByChef.Tuesday_Lunch_Extra,
						Tuesday_Dinner_Extra:  foodPlanDataByChef.Tuesday_Dinner_Extra,
						Wednesday_Breakfast_Extra:  foodPlanDataByChef.Wednesday_Breakfast_Extra,
						Wednesday_Lunch_Extra: foodPlanDataByChef.Wednesday_Lunch_Extra,
						Wednesday_Dinner_Extra: foodPlanDataByChef.Wednesday_Dinner_Extra,
						Thursday_Breakfast_Extra:foodPlanDataByChef.Thursday_Breakfast_Extra ,
						Thursday_Lunch_Extra:  foodPlanDataByChef.Thursday_Lunch_Extra,
						Thursday_Dinner_Extra:  foodPlanDataByChef.Thursday_Dinner_Extra,
						Friday_Breakfast_Extra: foodPlanDataByChef.Friday_Breakfast_Extra,
						Friday_Lunch_Extra: foodPlanDataByChef.Friday_Lunch_Extra,
						Friday_Dinner_Extra: foodPlanDataByChef.Friday_Dinner_Extra,
						Saturday_Breakfast_Extra: foodPlanDataByChef.Saturday_Breakfast_Extra,
						Saturday_Lunch_Extra: foodPlanDataByChef.Saturday_Lunch_Extra,
						Saturday_Dinner_Extra: foodPlanDataByChef.Saturday_Dinner_Extra,
						Sunday_Breakfast_Standard:  foodPlanDataByChef.Sunday_Breakfast_Standard,
						Sunday_Lunch_Standard: foodPlanDataByChef.Sunday_Lunch_Standard,
						Sunday_Dinner_Standard: foodPlanDataByChef.Sunday_Dinner_Standard,
						Monday_Breakfast_Standard:foodPlanDataByChef.Monday_Breakfast_Standard,
						Monday_Lunch_Standard: foodPlanDataByChef.Monday_Lunch_Standard,
						Monday_Dinner_Standard: foodPlanDataByChef.Monday_Dinner_Standard,
						Tuesday_Breakfast_Standard: foodPlanDataByChef.Tuesday_Breakfast_Standard,
						Tuesday_Lunch_Standard: foodPlanDataByChef.Tuesday_Lunch_Standard,
						Tuesday_Dinner_Standard:  foodPlanDataByChef.Tuesday_Dinner_Standard,
						Wednesday_Breakfast_Standard:  foodPlanDataByChef.Wednesday_Breakfast_Standard,
						Wednesday_Lunch_Standard: foodPlanDataByChef.Wednesday_Lunch_Standard,
						Wednesday_Dinner_Standard: foodPlanDataByChef.Wednesday_Dinner_Standard,
						Thursday_Breakfast_Standard:foodPlanDataByChef.Thursday_Breakfast_Standard ,
						Thursday_Lunch_Standard:  foodPlanDataByChef.Thursday_Lunch_Standard,
						Thursday_Dinner_Standard:  foodPlanDataByChef.Thursday_Dinner_Standard,
						Friday_Breakfast_Standard: foodPlanDataByChef.Friday_Breakfast_Standard,
						Friday_Lunch_Standard: foodPlanDataByChef.Friday_Lunch_Standard,
						Friday_Dinner_Standard: foodPlanDataByChef.Friday_Dinner_Standard,
						Saturday_Breakfast_Standard: foodPlanDataByChef.Saturday_Breakfast_Standard,
						Saturday_Lunch_Standard: foodPlanDataByChef.Saturday_Lunch_Standard,
						Saturday_Dinner_Standard: foodPlanDataByChef.Saturday_Dinner_Standard
					};

					let createNext = await foodplans.model.create(saveObject);
				}
			}
		}
	}
}