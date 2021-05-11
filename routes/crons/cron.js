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

        // const previousFoodPlanUpdate = new CronJob('20 1 * * 6', async () => {
        //     try {

        //     } catch (error) {
        //         console.log(error, "Error from previous foodplan update cron")
        //     }
        // }, null, true, 'Asia/Kolkata');
        // previousFoodPlanUpdate.start();

    } catch (error) {
		console.log(error);
	}
};

module.exports = cronService;
