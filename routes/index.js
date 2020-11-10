/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

let keystone = require('keystone');
let middleware = require('./middleware');
let importRoutes = keystone.importer(__dirname);
let userauth = require('./middleware')
let cors = require('cors');
// const multer  = require('multer')
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.use(cors())
	app.all('/*', keystone.middleware.cors);

	app.get('/', routes.views.index);
	app.get('/api/getuser', routes.views.user.getuser);
	app.post('/api/createuser', routes.views.user.createuser);
	app.post('/api/sociallogin', routes.views.user.sociallogin);
	app.post('/api/loginuser', routes.views.user.loginuser);
	app.post('/api/getfood', routes.views.user.listFood);
	app.get('/api/listplans', routes.views.user.listplans);
	// app.post('/api/savecart', routes.views.user.createcart);
	app.post('/api/createuserfood', routes.views.user.dishDetails);
	app.get('/api/getuserfood', routes.views.user.getDishDetails);
	app.get('/api/listallergens', routes.views.user.listAllergens);
	app.get('/api/verifynewpassword', routes.views.user.verifypassword);
	app.get('/api/verifyemail', routes.views.user.verifyemail);
	app.post('/api/updatepassword', routes.views.user.updatepassword);
	app.post('/api/updatesubscription', routes.views.user.updateSubscription);
	app.post('/api/updateprofile', routes.views.user.updateUserProfile);
	app.post('/api/forgotpassword', routes.views.user.emailsender);
	app.post('/api/createsubscription', routes.views.user.createsubscription);
	app.get('/api/getsubscription', routes.views.user.getsubscription);
	app.post('/api/savefoodplan', routes.views.user.savefoodplan);
	app.post('/api/showfoodplan', routes.views.user.showfoodplan);
	app.post('/api/userdetails', routes.views.user.userdetails);
	app.post('/api/test', routes.views.user.test);
	app.post('/api/payment', routes.views.user.paymentStart);
	app.post('/api/resumejob', routes.views.user.resumeJobs);
	// app.post('/api/paymentsender', routes.views.user.paymentSender);
	// app.post('/api/sendreminder', routes.views.user.sendreminder);


};
