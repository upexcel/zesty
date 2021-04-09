var keystone = require('keystone');
var Types = keystone.Field.Types;

var WeekRevenue = new keystone.List('ZestyWeekRevenue');

WeekRevenue.add({
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    totalBill: { type: Number },
    ZestyMargin : { type: Number },
    Memberbership : { type: Number },
    totalRevenue : { type: Number },
})
WeekRevenue.defaultColumns = 'startdate, enddate, totalBill, ZestyMargin, Memberbership, totalRevenue';
WeekRevenue.register();