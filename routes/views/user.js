let jwt = require("jsonwebtoken");
let moment = require("moment");
let keystone = require("keystone");
let users = keystone.list("User");
// let plans = keystone.list('Plan');
// let subscriptions = keystone.list('Subscription');
// let carts = keystone.list('Cart');
let dishes = keystone.list("Dishes");
let side_dish = keystone.list("side_dish");
let allergens = keystone.list("Allergens");
let primary_ingredeints = keystone.list("primary_ingredeints");
let availability = keystone.list("Availability");
let days = keystone.list("Days");
let userDish = keystone.list("UserDish");
let spicelevels = keystone.list("Spicelevel");
let cuisine = keystone.list("cuisine");
let dietary_requirement = keystone.list("dietary_requirement");
let foodplans = keystone.list("Foodplan");
let typeOfFood = keystone.list("type_of_food");
let otherChoicesModel = keystone.list("otherChoices");
let passverify = require("./service");
const { select } = require("async");
const { indexOf } = require("lodash");
const cloudinary = require("cloudinary").v2;
var CronJob = require("cron").CronJob;
const axios = require("axios");
const Handlebars = require("handlebars");
const service = require("./service");
const Chef = keystone.list('Chef');
const systemDates = keystone.list('SystemDates')


async function uploadImage(req) {
	try {
		let imageUpload = await cloudinary.uploader.upload(req.files.image.path);
		url = imageUpload.secure_url;
		updatedUser = await users.model.update(
			{ _id: req.body.userId },
			{ image: url },
			async (err, data) => {
				if (err) {
					req.json({ error: 1, message: err });
				} else {
					console.log("image updated");
				}
			}
		);
	} catch (err) {
		console.log(err);
	}
}


async function createUserSide (details) {
	let resp = []
	let text = []
	for (let data of details) {
		const newUserDish = await userDish.model.create({
			name : data.name,
			count : data.default_count,
			dish : data._id
		})
		resp.push(newUserDish._id)
		text.push(`${data.default_count} ${data.name}`)
	}
	return {resp,text}
} 

async function updateFood(req) {
	console.log("entttttttttttttttttt");
	try {
		let dataToReturn = {};
		let text = "";
		let foodDayDetails = req.body.foodDetails;
		let standardMealDetails = req.body.updatedMealData;
		for (let item in foodDayDetails) {
			if (foodDayDetails[`${item}`]) {
				if (foodDayDetails[`${item}`].Breakfast.length) {
					let founditem = await dishes.model.findOne({
						_id: foodDayDetails[`${item}`].Breakfast[0],
					});
					let daytextbreakfast = [`${item}`] + "_Breakfast- " + founditem.name;
					let itemToUpdate1 = [`${item}`] + "_Breakfast";
					let chefForBreakFast = [`${item}`] + "_Breakfast_Chef";
					if (text != "") {
						text += "<br/>";
					}
					text = text + "</br>" + daytextbreakfast;

					let standardDishText = [];
					let standardDishId = [];
					if (
						standardMealDetails[item] &&
						standardMealDetails[item].Breakfast &&
						standardMealDetails[item].Breakfast.length &&
						standardMealDetails[item].Breakfast[0].standard_meal && 
						standardMealDetails[item].Breakfast[0].standard_meal.length
					) {
						const createUserDish = await createUserSide(standardMealDetails[item].Breakfast[0].standard_meal)
						standardDishText = createUserDish.text
						standardDishId = createUserDish.resp
					}

					if (standardDishText.length) {
						text =
							text +
							"<br/>" +
							`${item}_Breakfast_Meal-${standardDishText.join()}`;
					}
					if (standardDishId.length) {
						dataToReturn[`${itemToUpdate1}_Meal`] = standardDishId;
					}

					dataToReturn[`${itemToUpdate1}`] = foodDayDetails[`${item}`].Breakfast[0];
					dataToReturn[`${chefForBreakFast}`] = founditem.chef;
				}
				if (foodDayDetails[`${item}`].Lunch.length) {
					let founditem = await dishes.model.findOne({
						_id: foodDayDetails[`${item}`].Lunch[0],
					});
					let daytextlunch = [`${item}`] + "_Lunch- " + founditem.name;
					let itemToUpdate2 = [`${item}`] + "_Lunch";
					let chefForLunch = [`${item}`] + "_Lunch_Chef";
					text = text + "<br/>" + daytextlunch;

					let standardDishText = [];
					let standardDishId = [];
					if (
						standardMealDetails[item] &&
						standardMealDetails[item].Lunch &&
						standardMealDetails[item].Lunch.length &&
						standardMealDetails[item].Lunch[0].standard_meal && 
						standardMealDetails[item].Lunch[0].standard_meal.length
					) {
						const createUserDish = await createUserSide(standardMealDetails[item].Lunch[0].standard_meal)
						standardDishText = createUserDish.text
						standardDishId = createUserDish.resp
					}

					if (standardDishText.length) {
						text =
							text +
							"<br/>" +
							`${item}_Lunch_Meal-${standardDishText.join()}`;
					}
					if (standardDishId.length) {
						dataToReturn[`${itemToUpdate2}_Meal`] = standardDishId;
					}

					dataToReturn[`${chefForLunch}`] = founditem.chef;
					dataToReturn[`${itemToUpdate2}`] = foodDayDetails[`${item}`].Lunch[0];
				}
				if (foodDayDetails[`${item}`].Dinner.length) {
					let founditem = await dishes.model.findOne({
						_id: foodDayDetails[`${item}`].Dinner[0],
					});
					let daytextdinner = [`${item}`] + "_Dinner- " + founditem.name;
					let chefForDinner = [`${item}`] + "_Dinner_Chef";
					let itemToUpdate3 = [`${item}`] + "_Dinner";
					text = text + "<br/>" + daytextdinner;

					let standardDishText = [];
					let standardDishId = [];
					if (
						standardMealDetails[item] &&
						standardMealDetails[item].Dinner &&
						standardMealDetails[item].Dinner.length &&
						standardMealDetails[item].Dinner[0].standard_meal && 
						standardMealDetails[item].Dinner[0].standard_meal.length
					) {
						const createUserDish = await createUserSide(standardMealDetails[item].Dinner[0].standard_meal)
						standardDishText = createUserDish.text
						standardDishId = createUserDish.resp
					}

					if (standardDishText.length) {
						text =
							text +
							"<br/>" +
							`${item}_Dinner_Meal-${standardDishText.join()}`;
					}
					if (standardDishId.length) {
						dataToReturn[`${itemToUpdate3}_Meal`] = standardDishId;
					}

					dataToReturn[`${chefForDinner}`] = founditem.chef;
					dataToReturn[`${itemToUpdate3}`] = foodDayDetails[`${item}`].Dinner[0];
				}
			}
		}
		let foundUser = await users.model.findOne({ _id: req.body.userId });
		let email = foundUser.email;
		let subject = "Your Order Details.";
		await passverify.reminderservice(text, email, subject, null);
		return dataToReturn;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

module.exports = {
	getuser: async function (req, res) {
		try {
			let data = await users.model.find({});
			res.json(data);
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	userdetails: async (req, res) => {
		try {
			let founduser = await users.model.findOne({ _id: req.body.userId });
			if (founduser) {
				res.json({
					name: founduser.name,
					image: founduser.image,
					email: founduser.email,
					id: founduser._id,
				});
			} else {
				res
					.status(500)
					.json({ error: 1, message: "No user found with this id." });
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
				let token = jwt.sign(
					{ token: { name: user.name, id: user.id } },
					process.env.TOKEN_SECRET,
					{ expiresIn: "1d" }
				);
				res.json({
					error: 0,
					message: "user created",
					token: token,
					id: user._id,
					name: user.name,
				});
			} else {
				res
					.status(409)
					.json({ error: 1, message: "This email already exists." });
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
					if (req.body.firstName || req.body.lastName) {
						req.body.name = {
							first: req.body.firstName,
							last: req.body.lastName,
						};
						updatedUser = await users.model.update(
							{ _id: req.body.userId },
							{ name: req.body.name },
							async (err, data) => {
								if (err) {
									req.json({ error: 1, message: err });
								} else {
									console.log(data);
									// let updatedUser = await users.model.findOne({_id: req.body.userId});
									res.json({ error: 0, message: "Success" });
								}
							}
						);
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
				if (planTitle == "Monthly") {
					validityend = moment(validitystart, "YYYY-MM-DD").add("days", 30);
				} else if (planTitle == "Yearly") {
					validityend = moment(validitystart, "YYYY-MM-DD").add("days", 365);
				}

				let subsDetail = await subscriptions.model.create({
					userId: req.body.userId,
					planId: req.body.planId,
					validityPeriodStart: validitystart,
					validityPeriodEnd: validityend,
					subscriptionId: req.body.subscriptionId,
				});
				res.json({ detail: subsDetail });
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
				res
					.status(500)
					.json({ error: 1, message: "No User with this email exists." });
			} else {
				let token = jwt.sign(
					{ token: { date: date, _id: user._id } },
					process.env.TOKEN_SECRET,
					{ expiresIn: "1h" }
				);
				let subject = "Verify your Password";
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
			jwt.verify(
				receivedtoken,
				process.env.TOKEN_SECRET,
				async function (err, decoded) {
					if (err) {
						console.log(error);
						res.status(500).json({ error: 1, messagr: err });
					} else {
						let userid = decoded.token._id;
						res.redirect(
							"https://web-zesty-app.herokuapp.com/updatepassword/" + userid
						);
					}
				}
			);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 1, message: error });
		}
	},

	updatepassword: async (req, res) => {
		try {
			let founduser = await users.model.findOne({ _id: req.body.id });
			founduser.password = req.body.password;
			let update = await founduser.save();
			res.json({ error: 0, message: "Password Updated" });
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	sociallogin: async (req, res) => {
		try {
			let newuser;
			let query = {};
			if (req.body.email) {
				query.email = req.body.email;
			}
			if (req.body.facebookId) {
				query.facebookId = req.body.facebookId;
			}
			if (req.body.email || req.body.facebookId) {
				newuser = await users.model.findOne(query);
			}
			if (!newuser) {
				console.log("11o21212192");
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
						facebookId: req.body.facebookId,
					});
					if (logintype == "facebook") {
						let date = new Date().getTime();
						useremail = user.email;
						subject = "Verify Your Email";
						let token = jwt.sign(
							{ token: { date: date, _id: user._id } },
							process.env.TOKEN_SECRET,
							{ expiresIn: "1h" }
						);

						let link = process.env.EMAIL_LINK + token;
						passverify.newemailservice(link, useremail, subject);
					}
					let token = jwt.sign(
						{ token: { name: user.name, id: user.id } },
						process.env.TOKEN_SECRET,
						{ expiresIn: "1d" }
					);
					res.json({
						error: 0,
						message: "user created",
						token: token,
						id: user._id,
						name: user.name,
					});
				} catch (error) {
					console.log(error);
					res.status(500).json({ error: 1, message: error });
				}
			} else {
				console.log("=========1111111");
				let token = jwt.sign(
					{ token: { name: newuser.name, id: newuser.id } },
					process.env.TOKEN_SECRET,
					{ expiresIn: "1d" }
				);
				return res.json({
					error: 0,
					message: "login Successful",
					token: token,
					id: newuser._id,
					name: newuser.name,
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
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 1, message: error });
		}
	},

	verifyemail: async (req, res) => {
		try {
			let receivedtoken = req.query.token;
			jwt.verify(
				receivedtoken,
				process.env.TOKEN_SECRET,
				async function (err, decoded) {
					let id = decoded.token._id;
					if (err) {
						res.send(err.message);
					} else {
						try {
							let founduser = await users.model.findOne({ _id: id });
							if (founduser) {
								founduser.emailVerified = true;
								let update = await founduser.save();

								res.redirect("https://web-zesty-app.herokuapp.com");
							} else {
								res
									.status(500)
									.json({
										error: 1,
										message: "No User Found With this Email.",
									});
							}
						} catch (error) {
							res.status(500).json({ error: 1, message: error });
						}
					}
				}
			);
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	getsubscription: async (req, res) => {
		try {
			let subDetail = await subscriptions.model.findOne({
				userId: req.body.id,
			});
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
						title: planDetail.title,
					});
				} else {
					return res.json({
						error: 0,
						subscribed: false,
						remtime: remaingSubscription,
						title: null,
					});
				}
			} else {
				return res.json({
					error: 0,
					subscribed: false,
				});
			}
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	updateSubscription: async (req, res) => {
		try {
			let subDetail = await subscriptions.model.findOne({
				userId: req.body.userId,
			});
			if (subDetail) {
				planDetail = await plans.model.findOne({ title: req.body.title });
				let validitystart = new Date();
				if (planDetail) {
					let planTitle = planDetail.title;
					console.log(planTitle);
					let validityend;
					if (planTitle == "Monthly") {
						validityend = moment(validitystart, "YYYY-MM-DD").add("days", 30);
					} else if (planTitle == "Yearly") {
						validityend = moment(validitystart, "YYYY-MM-DD").add("days", 365);
					}
					subDetail.planId = planDetail._id;
					subDetail.validityPeriodStart = validitystart;
					subDetail.validityPeriodStart = validityend;
					let update = await subDetail.save();
					res.json({ error: 0, message: "Plan Updated" });
				} else {
					res
						.status(500)
						.json({ error: 1, message: "No Plan found with this name." });
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
			keystone.session.signin(
				{ email: req.body.email, password: req.body.password },
				req,
				res,
				async function (user) {
					let token = jwt.sign(
						{ token: { name: user.name, id: user.id } },
						process.env.TOKEN_SECRET,
						{ expiresIn: "1d" }
					);
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
				},
				function (err) {
					return res.status(401).json({
						error: 1,
						message:
							(err && err.message ? err.message : false) ||
							"Sorry, there was an issue signing you in, please try again.",
					});
				}
			);
		} catch (err) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	listFood: async (req, res) => {
		try {
			let alltime = req.body.mealType;
			let spicyDetail = [];
			let spicyLevel = req.body.spicy;
			let data = await spicelevels.model.findOne({
				spice_level: spicyLevel[0],
			});
			spicyDetail.push(`${data._id}`);
			let breakfast = [];
			let lunch = [];
			let dinner = [];
			let completeDetail = {};
			async function pushArray(foundItem, arrayName) {
				await foundItem.map((item) => {
					arrayName.push(item.id);
				});
			}
			let allergyDetails = [];
			let newAllergens = await allergens.model.find({
				name: {
					$in: req.body.allergens,
				},
			});
			pushArray(newAllergens, allergyDetails);
			let availableDetails = [];
			let newAvailable = await availability.model.find({
				name: {
					$in: req.body.mealType,
				},
			});
			pushArray(newAvailable, availableDetails);
			let daysDetails = [];
			let daysNames = [];
			let newDays = await days.model.find({
				name: {
					$in: req.body.day,
				},
			});
			pushArray(newDays, daysDetails);
			newDays.map((i) => {
				daysNames.push(i.name);
			});
			let dietaryRequirement = await dietary_requirement.model.find({
				name: {
					$in: req.body.foodType,
				},
			});
			let foodType = dietaryRequirement.map((val) => {
				return `${val._id}`;
			});
			req.body.foodType = foodType;
			let selectedday = req.body.day;
			let cuisines = [...req.body.primaryCuisine, ...req.body.secondaryCuisine];
			let cusineData = await cuisine.model.find({
				name: {
					$in: cuisines,
				},
			});
			let cusineIds = cusineData.map((val) => {
				return val._id;
			});
			let cuisineNames = cuisines;
			cuisines = cusineIds;
			let primary_ingredeints_data = [];

			if (req.body.breakfast_primary_ingredient) {
				primary_ingredeints_data.push(req.body.breakfast_primary_ingredient);
			}
			if (req.body.lunch_primary_ingredient) {
				primary_ingredeints_data.push(req.body.lunch_primary_ingredient);
			}
			if (req.body.dinner_primary_ingredient) {
				primary_ingredeints_data.push(req.body.dinner_primary_ingredient);
			}
			primary_ingredeints_data = [
				...primary_ingredeints_data,
				...req.body.primary_ingredeints,
			];
			console.log(primary_ingredeints_data, "aksalksalksalksaslalksaskl");

			let finalfood = await dishes.model
				.find({
					_id: {
						$nin: req.body.dislikes,
					},
					primary_ingredeints: {
						$nin: primary_ingredeints_data,
					},
					cuisine: {
						$in: cuisines,
					},
					diet: {
						$in: req.body.foodType,
					},
					spice_level: {
						$in: spicyDetail,
					},
					allergens: {
						$nin: allergyDetails,
					},
					available_days: {
						$in: daysDetails,
					},
					availability: {
						$in: availableDetails,
					},
				})
				.populate("available_days")
				.populate("availability")
				.populate("standard_meal")
				.populate("side_dish")
				.populate('Chef')
				.lean();
			console.log(finalfood.length, "--aa--aa--aa--aa--aa");
			if (req.body.mealType.includes("Breakfast")) {
				let type_of_food_id = await typeOfFood.model.findOne({
					name: "Breakfast",
				});
				type_of_food_id = [type_of_food_id._id];
				if (!cuisineNames.includes("Continental")) {
					let continentalcuisineData = await cuisine.model
						.findOne({
							name: "Continental",
						})
						.lean();
					const continentalDishes = await dishes.model
						.find({
							_id: {
								$nin: req.body.dislikes,
							},
							cuisine: continentalcuisineData._id,
							diet: {
								$in: req.body.foodType,
							},
							spice_level: {
								$in: spicyDetail,
							},
							allergens: {
								$nin: allergyDetails,
							},
							available_days: {
								$in: daysDetails,
							},
							availability: {
								$in: availableDetails,
							},
						})
						.populate("available_days")
						.populate("availability")
						.populate("standard_meal")
						.populate("side_dish")
						.populate('Chef')
						.lean();
					finalfood = [...finalfood, ...continentalDishes];
				}
			}

			let preferredIngredientsDishesFinal = await dishes.model
				.find({
					_id: {
						$nin: req.body.dislikes,
					},
					primary_ingredeints: {
						$in: primary_ingredeints_data,
					},
					cuisine: {
						$in: cuisines,
					},
					diet: {
						$in: req.body.foodType,
					},
					spice_level: {
						$in: spicyDetail,
					},
					allergens: {
						$nin: allergyDetails,
					},
					available_days: {
						$in: daysDetails,
					},
					availability: {
						$in: availableDetails,
					},
				})
				.populate("available_days")
				.populate("availability")
				.populate("standard_meal")
				.populate("side_dish")
				.populate('Chef')
				.lean();
			preferredIngredientsDishesFinal = JSON.parse(
				JSON.stringify(preferredIngredientsDishesFinal)
			);
			preferredIngredientsDishesFinal = preferredIngredientsDishesFinal.sort(
				() => Math.random() - 0.5
			);
			console.log(
				preferredIngredientsDishesFinal.length,
				"=================11111111111111222222222222222"
			);
			for await (let elemoffinalfood of finalfood) {
				elemoffinalfood = JSON.parse(JSON.stringify(elemoffinalfood));
				let timing = elemoffinalfood.availability;
				for await (let elem of timing) {
					for await (let time of alltime) {
						if (elem.name == "Breakfast" && time == "Breakfast") {
							breakfast.push(elemoffinalfood);
						} else if (elem.name == "Lunch" && time == "Lunch") {
							lunch.push(elemoffinalfood);
						} else if (elem.name == "Dinner" && time == "Dinner") {
							dinner.push(elemoffinalfood);
						}
					}
				}
			}
			let breakfastLength = breakfast.length;
			let lunchLength = lunch.length;
			let dinnerLength = dinner.length;

			for await (let itemofbreakfast of daysNames) {
				completeDetail[`${itemofbreakfast}`] = {
					Breakfast: [],
					Lunch: [],
					Dinner: [],
				};
			}

			async function listfood(food, type, completeDetail, daysDetails) {
				for await (let value of food) {
					let count = 0;
					let gotDays = value.available_days;
					for await (let day of gotDays) {
						let founddday = selectedday.find((elem) => elem == day.name);
						if (founddday) {
							value = JSON.parse(JSON.stringify(value));
							delete value.allergens;
							delete value.availability;
							delete value.available_days;

							if (type == "breakfast") {
								completeDetail[`${day.name}`].Breakfast.push(value);
							} else if (type == "lunch") {
								completeDetail[`${day.name}`].Lunch.push(value);
							} else if (type == "dinner") {
								completeDetail[`${day.name}`].Dinner.push(value);
							}
							completeDetail[`${day.name}`].Breakfast = completeDetail[
								`${day.name}`
							].Breakfast.sort(() => Math.random() - 0.5);
							completeDetail[`${day.name}`].Lunch = completeDetail[
								`${day.name}`
							].Lunch.sort(() => Math.random() - 0.5);
							completeDetail[`${day.name}`].Dinner = completeDetail[
								`${day.name}`
							].Dinner.sort(() => Math.random() - 0.5);
						}
					}
				}
			}
			await listfood(breakfast, "breakfast", completeDetail, daysDetails);

			for (let day of selectedday) {
				let numberOfItems = completeDetail[`${day}`].Breakfast.length;
				completeDetail[`${day}`].Breakfast.splice(1, numberOfItems);
			}
			for (let day of selectedday) {
				// console.log(day);
				for await (let eachitem of completeDetail[`${day}`].Breakfast) {
					console.log(eachitem._id);
					let found_item_in_lunch = lunch.find(
						(element) => element._id == eachitem._id
					);
					// console.log(found_item_in_lunch);
					if (found_item_in_lunch) {
						for (var i = 0; i < lunch.length; i++) {
							if (lunch[i] === found_item_in_lunch) {
								//  console.log("hchsjgchjsgcgj");
								lunch.splice(i, 1);
							}
						}
					}
				}
			}

			await listfood(lunch, "lunch", completeDetail, daysDetails);
			for (let day of selectedday) {
				let numberOfItems2 = completeDetail[`${day}`].Breakfast.length;
				// console.log(numberOfItems2,"============111111111")
				completeDetail[`${day}`].Breakfast.splice(1, numberOfItems2);

				let numberOfItems3 = completeDetail[`${day}`].Lunch.length;
				completeDetail[`${day}`].Lunch.splice(1, numberOfItems3);
			}
			for (let day of selectedday) {
				for await (let eachitem of completeDetail[`${day}`].Breakfast) {
					let found_item_in_dinner = dinner.find(
						(element) => element._id == eachitem._id
					);
					// console.log(found_item_in_dinner);
					if (found_item_in_dinner) {
						for (var i = 0; i < dinner.length; i++) {
							if (dinner[i] == found_item_in_dinner) {
								//  console.log("iiiiiiiiiiiiiiiii");
								dinner.splice(i, 1);
							}
						}
					}
				}
				for await (let eachitem of completeDetail[`${day}`].Lunch) {
					let founded_item_in_dinner = dinner.find(
						(element) => element._id == eachitem._id
					);
					// console.log(founded_item_in_dinner);
					if (founded_item_in_dinner) {
						for (var i = 0; i < dinner.length; i++) {
							if (dinner[i] == founded_item_in_dinner) {
								console.log("uuuuuuuuuuuuuuuuu");
								dinner.splice(i, 1);
							}
						}
					}
				}
			}
			// dinner = dinner.sort(() => Math.random() - 0.5);
			await listfood(dinner, "dinner", completeDetail, daysDetails);
			for (let day of selectedday) {
				let numberOfItems3 = completeDetail[`${day}`].Dinner.length;
				completeDetail[`${day}`].Dinner.splice(1, numberOfItems3);
			}
			for (let day of selectedday) {
				if (req.body.mealType.includes("Breakfast")) {
					pushPreferredIngredientDish(
						"Breakfast",
						completeDetail[`${day}`].Breakfast,
						preferredIngredientsDishesFinal,
						req.body.breakfast_primary_ingredient
					);
					if (completeDetail[`${day}`].Breakfast.length !== 1) {
						pushPreferredIngredientDish(
							"Breakfast",
							completeDetail[`${day}`].Breakfast,
							preferredIngredientsDishesFinal,
							req.body.breakfast_primary_ingredient
						);
					}
					console.log(preferredIngredientsDishesFinal.length);
				}
				if (req.body.mealType.includes("Lunch")) {
					pushPreferredIngredientDish(
						"Lunch",
						completeDetail[`${day}`].Lunch,
						preferredIngredientsDishesFinal,
						req.body.lunch_primary_ingredient
					);
					if (completeDetail[`${day}`].Lunch.length !== 1) {
						pushPreferredIngredientDish(
							"Lunch",
							completeDetail[`${day}`].Lunch,
							preferredIngredientsDishesFinal,
							req.body.lunch_primary_ingredient
						);
					}
					console.log(preferredIngredientsDishesFinal.length);
				}
				if (req.body.mealType.includes("Dinner")) {
					pushPreferredIngredientDish(
						"Dinner",
						completeDetail[`${day}`].Dinner,
						preferredIngredientsDishesFinal,
						req.body.dinner_primary_ingredient
					);
					if (completeDetail[`${day}`].Dinner.length !== 1) {
						pushPreferredIngredientDish(
							"Dinner",
							completeDetail[`${day}`].Dinner,
							preferredIngredientsDishesFinal,
							req.body.dinner_primary_ingredient
						);
					}
					console.log(preferredIngredientsDishesFinal.length);
				}
			}
			// console.log(breakfast.length,lunch.length,dinner.length,"asdlkasldkasdkasdaskkkdasdkaskdasdkask")
			if (req.body.specificDay) {
				let specificData = {};
				specificData[`${req.body.specificDay}`] = {
					[`${req.body.specificMealTime}`]: completeDetail[
						`${req.body.specificDay}`
					][`${req.body.specificMealTime}`],
				};
				res.json(specificData);
			} else {
				completeDetail.breakfastLength = breakfastLength;
				completeDetail.lunchLength = lunchLength;
				completeDetail.dinnerLength = dinnerLength;
				// console.log(breakfast.length,lunch.length,dinner.length,"asdlkasldkasdkasdaskkkdasdkaskdasdkask")
				res.json(completeDetail);
			}

			function pushPreferredIngredientDish(
				mealTime,
				data,
				preferredIngredientsDishesFinal,
				specificMealTimePrimaryData,
				lastDay
			) {
				let foundIndex = preferredIngredientsDishesFinal.findIndex((value) => {
					return (
						value.availability.find((item) => {
							return item.name == mealTime;
						}) &&
						value.primary_ingredeints.includes(specificMealTimePrimaryData)
					);
				});
				if (foundIndex == -1) {
					foundIndex = preferredIngredientsDishesFinal.findIndex((value) => {
						return value.availability.find((item) => {
							return item.name == mealTime;
						});
					});
				}
				if (foundIndex != -1) {
					let dataToInsert = preferredIngredientsDishesFinal[foundIndex];
					let findData = data.find((val) => {
						return val._id == dataToInsert._id;
					});
					if (!findData) {
						if (data.length >= 1) {
							data.splice(0, 1);
							data.push(dataToInsert);
							preferredIngredientsDishesFinal.splice(foundIndex, 1);
						} else {
							data.push(dataToInsert);
							preferredIngredientsDishesFinal.splice(foundIndex, 1);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: 1,
				message: error,
			});
		}
	},

	dishDetails: async (req, res) => {
		try {
			let details = await carts.model.create({
				userId: req.body.userId,
				foodId: req.body.foodId,
				itemNum: req.body.itemNum,
			});
			res.json(details);
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},
	getDishDetails: async (req, res) => {
		try {
			const userfood = await carts.model
				.findOne({ userId: req.body.userId })
				.populate("foodId");
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
			let lastWeekStartDate;
			let lastWeekEndDate;
			let today = new Date();
			let daynumber = today.getDay();
			let startdate = 7 - daynumber;
			let enddate = 7 - daynumber + 6;
			startday = moment(today, "YYYY-MM-DD")
				.add("days", startdate)
				.set("hour", 0)
				.set("minute", 0)
				.set("seconds", 0);
			endday = moment(today, "YYYY-MM-DD")
				.add("days", enddate)
				.set("hour", 0)
				.set("minute", 0)
				.set("seconds", 0);
			lastWeekStartDate = new Date(
				new Date(
					Date.now() - (daynumber - 1) * 24 * 60 * 60 * 1000
				).setUTCHours(0, 0, 0, 0)
			);
			lastWeekEndDate = new Date(
				new Date(Date.now() + startdate * 24 * 60 * 60 * 1000).setUTCHours(
					0,
					0,
					0,
					0
				)
			);
			console.log(
				startdate,
				enddate,
				new Date(startday),
				endday,
				lastWeekStartDate,
				lastWeekEndDate
			);
			let foundplan = await foodplans.model.findOne({
				user: req.body.userId,
				startdate: { $gt: new Date() },
			});
			let lastWeekFoodPlan = await foodplans.model.findOne({
				$and: [
					{ user: req.body.userId },
					{ startdate: { $gte: lastWeekStartDate } },
					{ startdate: { $lte: lastWeekEndDate } },
				],
			});
			let foundPlanForReference = JSON.parse(JSON.stringify(foundplan));
			// let selections = req.body.choices;
			let fieldsToUpdate = await updateFood(req);
			let selections = req.body.choices;
			let deliveryDetails = req.body.deliveryInfo;
			let foundUser = await users.model.findOne({ _id: req.body.userId });
			// if (!selections.adult_count){
			// 	selections.adult_count = 0
			// }
			// if(!selections.children_count){
			// 	selections.children_count = 0
			// }
			// if (selections.adult_count == 0 && selections.children_count == 0){
			// 	if(lastWeekFoodPlan){
			// 		selections.adult_count = lastWeekFoodPlan.adult_count,
			// 		selections.children_count = lastWeekFoodPlan.children_count
			// 	}else{
			// 		selections.adult_count = 1,
			// 		selections.children_count = 0
			// 	}
			// }
			let dataToCreate = {
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
				adult_count: selections.adult_count,
				children_count: selections.children_count,
				Other_Mentions: selections.extraMention,
				Breakfast_Time_Interval: selections.Breakfast_Time_Interval,
				Lunch_Time_Interval: selections.Lunch_Time_Interval,
				Dinner_Time_Interval: selections.Dinner_Time_Interval,
				Days: selections.day,
				startdate: startday,
				enddate: endday,
				Receiver_Name: deliveryDetails.receiverName,
				Receiver_Email: deliveryDetails.receiverEmail,
				Shipping_Address: deliveryDetails.shippingAddress,
				Shipping_State: deliveryDetails.shippingState,
				Shipping_Zipcode: deliveryDetails.shippingZipcode,
				mobile: deliveryDetails.mobile,
				primary_ingredeints: selections.primary_ingredeints,
			};
			if (req.body.other_breakfast_choices_data) {
				let otherChoices = await otherChoicesModel.model.create(
					req.body.other_breakfast_choices_data
				);
				dataToCreate.other_breakfast_choices = otherChoices._id;
			}
			if (req.body.other_lunch_choices_data) {
				let otherChoices = await otherChoicesModel.model.create(
					req.body.other_lunch_choices_data
				);
				dataToCreate.other_lunch_choices = otherChoices._id;
			}
			if (req.body.other_dinner_choices_data) {
				let otherChoices = await otherChoicesModel.model.create(
					req.body.other_dinner_choices_data
				);
				dataToCreate.other_dinner_choices = otherChoices._id;
			}
			console.log("========");
			// console.log(dataToCreate,"----------------")
			let completeDataToCreate = Object.assign(dataToCreate, fieldsToUpdate);
			console.log("========");
			// console.log(lastWeekFoodPlan._id,lastWeekFoodPlan.startdate,lastWeekFoodPlan.enddate,"===========111222333")
			console.log("========");

			if (lastWeekFoodPlan) {
				console.log("lastWeekFoodPlan", "================");
				let updatedUser = await users.model.update(
					{ _id: req.body.userId },
					{ orderForThisWeek: lastWeekFoodPlan._id }
				);
			}
			console.log("========");

			let updatedUserData = await users.model.update(
				{ _id: req.body.userId },
				{ mobile: deliveryDetails.mobile }
			);
			console.log("========");

			if (!foundplan) {
				console.log("1111");
				let mailData = await sendMailToStaff(foundUser);
				let createdPlan = await foodplans.model.create(completeDataToCreate);
				console.log(mailData, "askkasaksalksalksalksaksk");
				res.json({ error: 0, message: "Success", lastWeekFoodPlan });
			} else {
				console.log("2222");
				let removeOld = await foodplans.model.remove({
					user: req.body.userId,
					startdate: { $gt: new Date() },
				});
				let mailData = await sendMailToStaff(foundUser);
				let newRecord = await foodplans.model.create(completeDataToCreate);
				console.log(mailData, "askkasaksalksalksalksakskkkkk");
				res.json({ error: 0, message: "Success", foundUser });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 1, message: error });
		}
	},

	saveSamefoodplanAsLastWeek: async (req, res) => {
		try {
			let today = new Date();
			let daynumber = today.getDay();
			let startdate = 7 - daynumber;
			let enddate = 7 - daynumber + 6;
			let startday = moment(today, "YYYY-MM-DD")
				.add("days", startdate)
				.set("hour", 0)
				.set("minute", 0)
				.set("seconds", 0);
			let endday = moment(today, "YYYY-MM-DD")
				.add("days", enddate)
				.set("hour", 0)
				.set("minute", 0)
				.set("seconds", 0);
			let currentPlan = await foodplans.model.findOne({ _id: req.body.planId });
			let foundplan = await foodplans.model.findOne({
				user: req.body.userId,
				startdate: { $gt: new Date() },
			});

			let completeDataToCreate = JSON.parse(JSON.stringify(currentPlan));
			delete completeDataToCreate._id;
			completeDataToCreate.startdate = startday;
			completeDataToCreate.enddate = endday;
			if (!foundplan) {
				console.log("sldkkfdslkfslsfdslkaaaa");
				let createdPlan = await foodplans.model.create(completeDataToCreate);
				res.json({ error: 0, message: "Success", completeDataToCreate });
			} else {
				console.log("ttttttttttttttttttttt");
				let removeOld = await foodplans.model.remove({
					user: req.body.userId,
					startdate: { $gt: new Date() },
				});
				let newRecord = await foodplans.model.create(completeDataToCreate);
				res.json({ error: 0, message: "Success", completeDataToCreate });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 1, message: error });
		}
	},

	showfoodplan: async (req, res) => {
		try {
			let dateToFind = new Date();
			let query = req.body.current
				? {
						user: req.body.userId,
						startdate: { $lt: dateToFind },
						enddate: { $gt: dateToFind },
				  }
				: { user: req.body.userId, startdate: { $gt: dateToFind } };
			let foundFood = await foodplans.model.findOne(query);
			if (foundFood) {
				let days = foundFood.foodDetails;
				let timing;
				let mealType;
				let foundDishObject = {};
				for (const property in days) {
					foundDishObject[`${property}`] = {};
					timing = days[`${property}`];
					for (const item in timing) {
						foundDishObject[`${property}`][`${item}`] = [];
						mealType = timing[`${item}`];
						for await (let element of mealType) {
							let foundDish = await dishes.model.findOne({ _id: element });
							if (foundDish) {
								foundDishObject[`${property}`][`${item}`].push({
									name: foundDish.name,
									_id: foundDish._id,
									images: foundDish.images,
								});
							} else {
								console.log("No food Found with this id");
							}
						}
					}
				}
				foundDishObject.startdate = foundFood.startdate;
				foundDishObject.enddate = foundFood.enddate;
				let choices = {};
				let deliveryDetails = {};
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

				deliveryDetails.Receiver_Name = foundFood.Receiver_Name;
				deliveryDetails.Receiver_Email = foundFood.Receiver_Email;
				deliveryDetails.Shipping_Address = foundFood.Shipping_Address;
				deliveryDetails.Shipping_State = foundFood.Shipping_State;
				deliveryDetails.Shipping_Zipcode = foundFood.Shipping_Zipcode;
				deliveryDetails.Shipping_Zipcode = foundFood.Shipping_Zipcode;
				foundDishObject.choices = choices;
				foundDishObject.deliveryDetails = deliveryDetails;
				foundDishObject._id = foundFood._id;

				res.json(foundDishObject);
			} else {
				res.status(500).json({ error: 1, message: "No Food Found." });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 1, message: error });
		}
	},

	showPastAndCurrentfoodplan: async (req, res) => {
		try {
			let dateToFind = new Date();
			let finalData = [];
			let foundFoodData = await foodplans.model.find({
				user: req.body.userId,
				startdate: { $lt: dateToFind },
			});
			if (foundFoodData.length) {
				for await (let foundFood of foundFoodData) {
					console.log(new Date(foundFood.startdate));
					let days = foundFood.foodDetails;
					let timing;
					let mealType;
					let foundDishObject = {};
					for (const property in days) {
						foundDishObject[`${property}`] = {};
						timing = days[`${property}`];
						for (const item in timing) {
							foundDishObject[`${property}`][`${item}`] = [];
							mealType = timing[`${item}`];
							for await (let element of mealType) {
								let foundDish = await dishes.model.findOne({ _id: element });
								if (foundDish) {
									foundDishObject[`${property}`][`${item}`].push({
										name: foundDish.name,
										_id: foundDish._id,
										images: foundDish.images,
									});
								} else {
									console.log("No food Found with this id");
								}
							}
						}
					}
					foundDishObject.startdate = foundFood.startdate;
					foundDishObject.enddate = foundFood.enddate;
					let choices = {};
					let deliveryDetails = {};
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

					deliveryDetails.Receiver_Name = foundFood.Receiver_Name;
					deliveryDetails.Receiver_Email = foundFood.Receiver_Email;
					deliveryDetails.Shipping_Address = foundFood.Shipping_Address;
					deliveryDetails.Shipping_State = foundFood.Shipping_State;
					deliveryDetails.Shipping_Zipcode = foundFood.Shipping_Zipcode;
					foundDishObject.choices = choices;
					foundDishObject.deliveryDetails = deliveryDetails;

					finalData.push({
						startdate: foundDishObject.startdate,
						enddate: foundDishObject.enddate,
						data: foundDishObject,
					});
				}
				res.json(finalData);
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
				passverify.reminderservice(mailHtml, email, subject);
			}
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	test: async (req, res) => {
		res.json({ success: true });
	},

	listAllergens: async function (req, res) {
		try {
			let data = await allergens.model.find({});
			res.json(data);
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	updatespice: async (req, res) => {
		try {
			const finalfood = await dishes.model
				.find({ spice_level: { $in: ["1", "2", "3"] } })
				.populate("available_days")
				.populate("availability");
			console.log(finalfood);
			for await (let item of finalfood) {
				if (item.spice_level == "1") {
					let foundspicelevel = await spicelevels.model.findOne({ name: "1" });
					console.log(foundspicelevel._id);
					if (foundspicelevel) {
						item.spice_level == foundspicelevel._id;
					}
				}
				if (item.spice_level == "2") {
					let foundspicelevel1 = await spicelevels.model.findOne({ name: "2" });
					if (foundspicelevel1) {
						item.spice_level == foundspicelevel1._id;
					}
				}
				if (item.spice_level == "3") {
					let foundspicelevel2 = await spicelevels.model.findOne({ name: "3" });
					if (foundspicelevel2) {
						item.spice_level == foundspicelevel2._id;
					}
				}
			}
			res.json({ success: "true" });
		} catch (error) {
			console.log(error);
			res.json({ error: "true" });
		}
	},

    chefMailForNextWeek :  async (req,res) => {
        try {
            let textResponse = []
            let systemDetails = await systemDates.model.findOne({})

            let allDishes = await dishes.model
                .find()
                .populate("chef")
                .populate("allergens")
                .populate("Spicelevel")
                .lean();
            let chefs = await Chef.model.find({name: req.params.chefName});
            console.log(systemDetails.chefstartdate,systemDetails.chefenddate,'<<<<<<<<<<<<<<<<<<<<<<<<<<<')
            allDishes = JSON.parse(JSON.stringify(allDishes));
            // data = JSON.parse(JSON.stringify(data))
            let daysMeal = [
                "Sunday_Breakfast",
                "Sunday_Lunch",
                "Sunday_Dinner",
                "Monday_Breakfast",
                "Monday_Lunch",
                "Monday_Dinner",
                "Tuesday_Breakfast",
                "Tuesday_Lunch",
                "Tuesday_Dinner",
                "Wednesday_Breakfast",
                "Wednesday_Lunch",
                "Wednesday_Dinner",
                "Thursday_Breakfast",
                "Thursday_Lunch",
                "Thursday_Dinner",
                "Friday_Breakfast",
                "Friday_Lunch",
                "Friday_Dinner",
                "Saturday_Breakfast",
                "Saturday_Lunch",
                "Saturday_Dinner",
            ];
    
            for await (let item of chefs) {
                if (item.email) {
                    let dishData = await dishes.model.find({
                        chef: item._id,
                    });
                    console.log(dishData.length);
                    let dishIds = dishData.map((val) => {
                        return val._id;
                    });
                    console.log(dishIds.length);
                    let mailMessage = `Hey ${item.name},<br/> Your menu for the week is:<br/>`;
                    let foodPlanDataByChef = await foodplans.model.find({
                        $or: [
                            {
                                Sunday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Sunday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Sunday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Monday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Monday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Monday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Tuesday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Tuesday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Tuesday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Wednesday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Wednesday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Wednesday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Thursday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Thursday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Thursday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Friday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Friday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Friday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Saturday_Breakfast: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Saturday_Lunch: {
                                    $in: dishIds,
                                },
                            },
                            {
                                Saturday_Dinner: {
                                    $in: dishIds,
                                },
                            },
                        ],
                        startdate: {
                            $gte: systemDetails.chefstartdate,
                        }, enddate : {
                            $lt : systemDetails.chefenddate
                        }
                    });
                    foodPlanDataByChef = JSON.parse(JSON.stringify(foodPlanDataByChef));
                    let statement = "";
                    if (foodPlanDataByChef.length) {
                        for await (let foodPlan of foodPlanDataByChef) {
                            let Customer_Name = ``;
                            let Sunday_Breakfast = ``;
                            let Sunday_Lunch = ``;
                            let Sunday_Dinner = ``;
                            let Monday_Breakfast = ``;
                            let Monday_Lunch = ``;
                            let Monday_Dinner = ``;
                            let Tuesday_Breakfast = ``;
                            let Tuesday_Lunch = ``;
                            let Tuesday_Dinner = ``;
                            let Wednesday_Breakfast = ``;
                            let Wednesday_Lunch = ``;
                            let Wednesday_Dinner = ``;
                            let Thursday_Breakfast = ``;
                            let Thursday_Lunch = ``;
                            let Thursday_Dinner = ``;
                            let Friday_Breakfast = ``;
                            let Friday_Lunch = ``;
                            let Friday_Dinner = ``;
                            let Saturday_Breakfast = ``;
                            let Saturday_Lunch = ``;
                            let Saturday_Dinner = ``;
                            let allergy = `Nothing`;
                            let Breakfast_Time_Interval = ``;
                            let Lunch_Time_Interval = ``;
                            let Dinner_Time_Interval = ``;
                            let adult_count = 0;
                            let children_count = 0;
                            
                            // console.log(foodPlan, "FOOD PLAN");
                            Customer_Name = `${foodPlan.name.first} ${foodPlan.name.last}`;
                            for await (let val of daysMeal) {
                                if (foodPlan[val]) {
                                    let dish = allDishes.find((value) => {
                                        return value._id == foodPlan[val];
                                    });
                                    if (dish && dish.chef && dish.chef.name == item.name) {
                                        console.log(dish.chef.name, item.name, "Details");
                                        let daytime = val.split("_");
                                        let mailMessageToAdd = `${dish.name}(${foodPlan.Spice_Level[0]}) spicy`;
                                        if ( foodPlan.Allergens.length && foodPlan.Allergens[0] != "Nothing") {
                                            allergy = foodPlan.Allergens.join('');
                                        } else {
                                            allergy = 'Nothing'
                                        }

                                        if (foodPlan.Breakfast_Time_Interval) {
                                            Breakfast_Time_Interval = foodPlan.Breakfast_Time_Interval ? foodPlan.Breakfast_Time_Interval : "07:00 AM"
                                        }

                                        if (foodPlan.Lunch_Time_Interval) {
                                            Lunch_Time_Interval = foodPlan.Lunch_Time_Interval ? foodPlan.Lunch_Time_Interval : "02:00 PM"
                                        }

                                        if (foodPlan.Dinner_Time_Interval) {
                                            Dinner_Time_Interval = foodPlan.Dinner_Time_Interval ? foodPlan.Dinner_Time_Interval: "07:00 PM"
                                        }

                                        adult_count = foodPlan.adult_count ? foodPlan.adult_count : 0
                                        children_count = foodPlan.children_count ? foodPlan.children_count: 0 
                                        if (val === "Sunday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Sunday_Breakfast) {
												Sunday_Breakfast = ``;
                                                if (
                                                    foodPlan.Sunday_Breakfast_Extra &&
                                                    foodPlan.Sunday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Sunday_Breakfast_Standard &&
                                                    foodPlan.Sunday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Sunday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Sunday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Sunday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Sunday_Lunch") {
											let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Sunday_Lunch) {
												Sunday_Lunch = ``;
                                                if (
                                                    foodPlan.Sunday_Lunch_Extra &&
                                                    foodPlan.Sunday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Sunday_Lunch_Standard &&
                                                    foodPlan.Sunday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Sunday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Sunday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Sunday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Sunday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Sunday_Dinner) {
												Sunday_Dinner = ``;
                                                if (
                                                    foodPlan.Sunday_Dinner_Extra &&
                                                    foodPlan.Sunday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Sunday_Dinner_Standard &&
                                                    foodPlan.Sunday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Sunday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Sunday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Sunday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Sunday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Monday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Monday_Breakfast) {
												Monday_Breakfast = ``;
                                                if (
                                                    foodPlan.Monday_Breakfast_Extra &&
                                                    foodPlan.Monday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Monday_Breakfast_Standard &&
                                                    foodPlan.Monday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Monday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Monday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Monday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Monday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Monday_Lunch) {
												Monday_Lunch = ``;
                                                if (
                                                    foodPlan.Monday_Lunch_Extra &&
                                                    foodPlan.Monday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Monday_Lunch_Standard &&
                                                    foodPlan.Monday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Monday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Monday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Monday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Monday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Monday_Dinner) {
												Monday_Dinner = ``;
                                                if (
                                                    foodPlan.Monday_Dinner_Extra &&
                                                    foodPlan.Monday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Monday_Dinner_Standard &&
                                                    foodPlan.Monday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Monday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Monday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Monday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Monday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Tuesday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Tuesday_Breakfast) {
												Tuesday_Breakfast = ``;
                                                if (
                                                    foodPlan.Tuesday_Breakfast_Extra &&
                                                    foodPlan.Tuesday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Tuesday_Breakfast_Standard &&
                                                    foodPlan.Tuesday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Tuesday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Tuesday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Tuesday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Tuesday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Tuesday_Lunch) {
												Tuesday_Lunch = ``;
                                                if (
                                                    foodPlan.Tuesday_Lunch_Extra &&
                                                    foodPlan.Tuesday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Tuesday_Lunch_Standard &&
                                                    foodPlan.Tuesday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Tuesday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Tuesday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Tuesday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Tuesday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Tuesday_Dinner) {
												Tuesday_Dinner = ``;
                                                if (
                                                    foodPlan.Tuesday_Dinner_Extra &&
                                                    foodPlan.Tuesday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Tuesday_Dinner_Standard &&
                                                    foodPlan.Tuesday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Tuesday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Tuesday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Tuesday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Tuesday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Wednesday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Wednesday_Breakfast) {
												Wednesday_Breakfast = ``;
                                                if (
                                                    foodPlan.Wednesday_Breakfast_Extra &&
                                                    foodPlan.Wednesday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Wednesday_Breakfast_Standard &&
                                                    foodPlan.Wednesday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Wednesday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Wednesday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Wednesday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Wednesday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Wednesday_Lunch) {
												Wednesday_Lunch = ``;
                                                if (
                                                    foodPlan.Wednesday_Lunch_Extra &&
                                                    foodPlan.Wednesday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Wednesday_Lunch_Standard &&
                                                    foodPlan.Wednesday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Wednesday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Wednesday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Wednesday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Wednesday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Wednesday_Dinner) {
												Wednesday_Dinner = ``;
                                                if (
                                                    foodPlan.Wednesday_Dinner_Extra &&
                                                    foodPlan.Wednesday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Wednesday_Dinner_Standard &&
                                                    foodPlan.Wednesday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Wednesday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Wednesday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Wednesday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Wednesday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Thursday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Thursday_Breakfast) {
												Thursday_Breakfast = ``;
                                                if (
                                                    foodPlan.Thursday_Breakfast_Extra &&
                                                    foodPlan.Thursday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Thursday_Breakfast_Standard &&
                                                    foodPlan.Thursday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Thursday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Thursday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Thursday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Thursday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Thursday_Lunch) {
												Thursday_Lunch = ``;
                                                if (
                                                    foodPlan.Thursday_Lunch_Extra &&
                                                    foodPlan.Thursday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Thursday_Lunch_Standard &&
                                                    foodPlan.Thursday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Thursday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Thursday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Thursday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Thursday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Thursday_Dinner) {
												Thursday_Dinner = ``;
                                                if (
                                                    foodPlan.Thursday_Dinner_Extra &&
                                                    foodPlan.Thursday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Thursday_Dinner_Standard &&
                                                    foodPlan.Thursday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Thursday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Thursday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Thursday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Thursday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Friday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Friday_Breakfast) {
												Friday_Breakfast = ``;
                                                if (
                                                    foodPlan.Friday_Breakfast_Extra &&
                                                    foodPlan.Friday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Friday_Breakfast_Standard &&
                                                    foodPlan.Friday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Friday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Friday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Friday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Friday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Friday_Lunch) {
												Friday_Lunch = ``;
                                                if (
                                                    foodPlan.Friday_Lunch_Extra &&
                                                    foodPlan.Friday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Friday_Lunch_Standard &&
                                                    foodPlan.Friday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Friday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Friday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Friday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Friday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Friday_Dinner) {
												Friday_Dinner = ``;
                                                if (
                                                    foodPlan.Friday_Dinner_Extra &&
                                                    foodPlan.Friday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Friday_Dinner_Standard &&
                                                    foodPlan.Friday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Friday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Friday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Friday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Friday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Saturday_Breakfast") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Saturday_Breakfast) {
												Saturday_Breakfast = ``;
                                                if (
                                                    foodPlan.Saturday_Breakfast_Extra &&
                                                    foodPlan.Saturday_Breakfast_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Breakfast_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Saturday_Breakfast_Standard &&
                                                    foodPlan.Saturday_Breakfast_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Breakfast_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Saturday_Breakfast += mailMessageToAdd;
                                            if (standardText.length) {
                                                Saturday_Breakfast += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Saturday_Breakfast += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Saturday_Lunch") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Saturday_Lunch) {
												Saturday_Lunch = ``;
                                                if (
                                                    foodPlan.Saturday_Lunch_Extra &&
                                                    foodPlan.Saturday_Lunch_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Lunch_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Saturday_Lunch_Standard &&
                                                    foodPlan.Saturday_Lunch_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Lunch_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Saturday_Lunch += mailMessageToAdd;
                                            if (standardText.length) {
                                                Saturday_Lunch += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Saturday_Lunch += `,${extraText.join(",")}`;
                                            }
                                        }
                                        if (val === "Saturday_Dinner") {
                                            let extraText = [];
											let standardText = [];
											let extraStatment = ``
                                            if (!Saturday_Dinner) {
												Saturday_Dinner = ``;
                                                if (
                                                    foodPlan.Saturday_Dinner_Extra &&
                                                    foodPlan.Saturday_Dinner_Extra.length
                                                ) {
                                                    let sideExtra = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Dinner_Extra },
                                                    });
                                                    for (let detail of sideExtra) {
                                                        if (detail) {
                                                            extraText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
                                                        }
                                                    }
												}

												extraStatment = extraText.join()

                                                if (
                                                    foodPlan.Saturday_Dinner_Standard &&
                                                    foodPlan.Saturday_Dinner_Standard.length
                                                ) {
                                                    let sideStandard = await side_dish.model.find({
                                                        _id: { $in: foodPlan.Saturday_Dinner_Standard },
													});
													
                                                    for (let detail of sideStandard) {
                                                        if (detail) { 
															if (extraText.length) {
																let extraCount = extraStatment.match(new RegExp(detail.name, "g")) 
																if (extraCount) {
																	const index = extraText.indexOf(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);(detail.name);
																	if (index > -1) {
																		extraText.splice(index, 1);
																	}
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count + extraCount.length : '1'} ${detail.name}`);
																} else {
																	standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);	
																}
															} else {
																standardText.push(`${detail.default_count && detail.default_count != 0 ? detail.default_count : '1'} ${detail.name}`);
															}
                                                        }
                                                    }
                                                }
											}
                                            Saturday_Dinner += mailMessageToAdd;
                                            if (standardText.length) {
                                                Saturday_Dinner += ` with ${standardText.join(",")}`;
                                            }

											if (extraText.length) {
                                                Saturday_Dinner += `,${extraText.join(",")}`;
                                            }
                                        }
                                    }
                                }
                            }
                            let result = {
                                Customer_Name,
                                Sunday_Breakfast,
                                Sunday_Lunch,
                                Monday_Lunch,
                                Monday_Dinner,
                                Monday_Breakfast,
                                Tuesday_Breakfast,
                                Tuesday_Lunch,
                                Sunday_Dinner,
                                Tuesday_Dinner,
                                Wednesday_Breakfast,
                                Wednesday_Lunch,
                                Wednesday_Dinner,
                                Thursday_Breakfast,
                                Thursday_Lunch,
                                Thursday_Dinner,
                                Friday_Breakfast,
                                Friday_Lunch,
                                Friday_Dinner,
                                Saturday_Breakfast,
                                Saturday_Lunch,
                                Saturday_Dinner,
                                allergy,
                                adult_count,
                                children_count,
                                Dinner_Time_Interval,
                                Breakfast_Time_Interval,
                                Lunch_Time_Interval
                            }
                            textResponse.push(result)
                            
                        }
                    }
                }
            }
            let resp = await service.createChefMail(textResponse)
            res.send(resp).status(200);
        } catch (err) {
            console.log(err);
        }
    },

	getPreviousWeekData: async (req, res) => {
		try {
			let dateToFind = new Date();
			console.log(dateToFind, "Saskaslaskalsalsk");
			let foundFood = await foodplans.model.findOne({
				user: req.params.userId,
				startdate: {
					$lt: dateToFind,
				},
			});
			if (foundFood) {
				let response = {
					primaryCuisine: foundFood.Primary_Cuisine,
					secondaryCuisine: foundFood.Secondary_Cuisine,
					foodType: foundFood.Meal_Types,
					allergens: foundFood.Allergens,
					spicy: foundFood.Spice_Level,
					mealType: foundFood.Meal_Timing,
					day: foundFood.Days,
					Breakfast_Time_Interval: foundFood.Breakfast_Time_Interval,
					Lunch_Time_Interval: foundFood.Lunch_Time_Interval,
					Dinner_Time_Interval: foundFood.Dinner_Time_Interval,
					orderFor: foundFood.Order_For,
					extraMention: foundFood.Other_Mentions,
					primary_ingredeints: foundFood.primary_ingredeints,
				};
				res.json({ response });
			} else {
				res.json(null);
			}
		} catch (error) {
			res.status(500).json({ error: 1, message: error });
		}
	},

	getDishesByMealTime: async (req, res) => {
		try {
			let spicyDetail = [];
			let spicyLevel = req.body.spicy;
			let data = await spicelevels.model.findOne({
				spice_level: spicyLevel[0],
			});
			spicyDetail.push(`${data._id}`);
			async function pushArray(foundItem, arrayName) {
				await foundItem.map((item) => {
					arrayName.push(item.id);
				});
			}
			let allergyDetails = [];
			let newAllergens = await allergens.model.find({
				name: {
					$in: req.body.allergens,
				},
			});
			pushArray(newAllergens, allergyDetails);
			let availableDetails = [];
			let newAvailable = await availability.model.find({
				name: req.body.mealType,
			});
			pushArray(newAvailable, availableDetails);
			let daysDetails = [];
			let daysNames = [];
			let newDays = await days.model.find({
				name: {
					$in: req.body.day,
				},
			});
			pushArray(newDays, daysDetails);
			newDays.map((i) => {
				daysNames.push(i.name);
			});
			let dietaryRequirement;
			let foodTypeQuery;
			if (
				req.body.foodType.includes("Vegetarian") &&
				!req.body.foodType.includes("Non Vegetarian")
			) {
				foodTypeQuery = {
					$in: ["Vegan"],
				};
			} else if (req.body.foodType.includes("Non Vegetarian")) {
				foodTypeQuery = {
					$nin: ["Vegan", "Vegetarian"],
				};
			} else if (
				req.body.foodType.includes("Vegan") &&
				req.body.foodType.length === 1
			) {
				foodTypeQuery = {
					$in: ["Vegan"],
				};
			} else {
				foodTypeQuery = {
					$nin: [],
				};
			}
			console.log(
				"111111111111111111111111111111222222222222",
				req.body.foodType
			);
			dietaryRequirement = await dietary_requirement.model.find({
				name: {
					$in: req.body.foodType,
				},
			});
			let foodType = dietaryRequirement.map((val) => {
				return `${val._id}`;
			});

			let otherDiets = await dietary_requirement.model.find({
				name: foodTypeQuery,
			});
			let other_diets = otherDiets.map((val) => {
				return `${val._id}`;
			});
			// console.log(other_diets,"111111111111111111111111111111")

			let cuisines = [...req.body.primaryCuisine, ...req.body.secondaryCuisine];
			// console.ll
			let cuisineNames = cuisines;
			let cusineData = await cuisine.model.find({ name: { $in: cuisines } });
			let cusineIds = cusineData.map((val) => {
				return val._id;
			});
			cuisines = cusineIds;
			if (
				!cuisineNames.includes("Continental") &&
				req.body.mealType === "Breakfast"
			) {
				let continentalcuisineData = await cuisine.model
					.findOne({
						name: "Continental",
					})
					.lean();
				cuisines.push(continentalcuisineData._id);
			}
			let otherDishesQuery = {
				allergens: {
					$nin: allergyDetails,
				},
				diet: {
					$in: other_diets,
				},
				spice_level: {
					$nin: spicyDetail,
				},
				availability: {
					$in: availableDetails,
				},
				spice_level: {
					$in: spicyDetail,
				},
			};
			let dishesOtherThenPrefrences = [];
			if (cuisines.length < 5) {
				console.log("---------------------------------------------");
				otherDishesQuery.cuisine = {
					$nin: cuisines,
				};
				dishesOtherThenPrefrences = await dishes.model
					.find(otherDishesQuery)
					.populate("availability")
					.select("-available_days");
			}
			let query = {
				primary_ingredeints: {
					$nin: req.body.primary_ingredeints,
				},
				cuisine: {
					$in: cuisines,
				},
				diet: {
					$in: foodType,
				},
				spice_level: {
					$in: spicyDetail,
				},
				allergens: {
					$nin: allergyDetails,
				},
				availability: {
					$in: availableDetails,
				},
			};

			let preferredIngredientsQuery = {
				primary_ingredeints: {
					$in: req.body.primary_ingredeints,
				},
				cuisine: {
					$in: cuisines,
				},
				diet: {
					$in: foodType,
				},
				spice_level: {
					$in: spicyDetail,
				},
				allergens: {
					$nin: allergyDetails,
				},
				availability: {
					$in: availableDetails,
				},
			};
			let preferredIngredientsDishesFinal = await dishes.model
				.find(preferredIngredientsQuery)
				.populate("available_days")
				.populate("availability")
				.lean();
			preferredIngredientsDishesFinal = preferredIngredientsDishesFinal.sort(
				() => Math.random() - 0.5
			);
			preferredIngredientsDishesFinal = preferredIngredientsDishesFinal.splice(
				0,
				6
			);
			let finalfood = await dishes.model
				.find(query)
				.populate("availability")
				.select("-available_days");
			let extraDishesCount =
				dishesOtherThenPrefrences.length >= 4
					? 4
					: dishesOtherThenPrefrences.length;
			if (finalfood.length < 12) {
				extraDishesCount = 20 - finalfood.length;
				if (dishesOtherThenPrefrences.length < extraDishesCount) {
					extraDishesCount = dishesOtherThenPrefrences.length;
				}
			}
			let extraDishes = await getRandom(
				dishesOtherThenPrefrences,
				extraDishesCount
			);
			let dishesToFetch = 20 - extraDishes.length;
			let resp = await getRandom(
				finalfood,
				finalfood.length >= dishesToFetch ? dishesToFetch : finalfood.length
			);
			let dataOtherThenPrimaryIngredients = resp.splice(
				0,
				preferredIngredientsDishesFinal.length
			);
			let finalResponse = [...resp, ...preferredIngredientsDishesFinal];
			finalResponse = finalResponse.sort(() => Math.random() - 0.5);
			finalResponse = [...finalResponse, ...extraDishes];
			// console.log(finalResponse.length)
			res.json({
				[`${req.body.mealType}`]: finalResponse,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: 1,
				message: error,
			});
		}
	},

	listPrimaryIngredeints: async (req, res) => {
		try {
			let data = await primary_ingredeints.model.find({
				appear_on_favourite: true,
			});
			res.json(data);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},

	userData: async (req, res) => {
		try {
			let data = await users.model
				.findOne({ facebookId: req.params.facebookId })
				.select("_id");
			res.json(data);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	},
};

async function getRandom(arr, n) {
	var result = new Array(n),
		len = arr.length,
		taken = new Array(len);
	console.log(n, len, "=-=---=");
	if (n > len)
		// n=len;
		throw new RangeError("getRandom: more elements taken than available");
	while (n--) {
		// console.log(n,"================")
		var x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

async function sendMailToStaff(userData) {
	let foodPlanOfUser = await foodplans.model.findOne({ user: userData._id });
	console.log("asdasdkskd");
	let userName = userData.name
		? userData.name.first + " " + (userData.name.last ? userData.name.last : "")
		: "A user";
	let email = JSON.parse(process.env.emailsForStaff);
	console.log("asdasdkskd");
	let html = `Congrats, ${userName} created a foodplan.`;
	let subject = "Foodplan";
	console.log(email, foodPlanOfUser, "emails emails");
	if (!foodPlanOfUser) {
		passverify.reminderservice(html, email, subject);
	}
	return "success mail";
}


