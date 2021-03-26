// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
// require('dotenv').config();


if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}


// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'zestyDev',
	'brand': 'zestyDev',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));
keystone.set('cors allow origin', true);
keystone.set('cors allow methods', true);
keystone.set('cors allow headers', true);

var cronSend = require('./routes/views/user')
var service = require('./routes/views/service')
const systemDates = keystone.list('SystemDates')
const moment =  require('moment');

var CronJob = require('cron').CronJob;
var job = new CronJob('30 13 * * 5', function () {
	cronSend.cronsender();
}, null, true, 'Asia/Kolkata');
job.start();

var chefMailForNextWeek = new CronJob('35 1 * * 6', function () {
	service.chefMailForNextWeek().then((data) => {
	}).catch(err => {
		console.log(err)
	});
}, null, true, 'Asia/Kolkata');
chefMailForNextWeek.start();

var previousFoodPlanUpdate = new CronJob('20 1 * * 6', function () {
	service.previousFoodPlanUpdate().then((data) => {
	}).catch(err => {
		console.log(err)
	});
}, null, true, 'Asia/Kolkata');
previousFoodPlanUpdate.start();

const setSystemDates = new CronJob('40 1 * * */6', async () => {
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
		chefstartdate : newChefStartDate})
​
	console.log(updated,"update query results for system dates")
})
setSystemDates.start();

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	// posts: ['posts', 'post-categories'],
	// galleries: 'galleries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server



keystone.start();
