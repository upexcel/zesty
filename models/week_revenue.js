var keystone = require('keystone');
var Types = keystone.Field.Types;

var WeekRevenue = new keystone.List('ZestyWeekRevenue');

WeekRevenue.add({
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    totalBill: { type: Number ,required: true},
    ZestyMargin : { type: Number, required: true },
    Memberbership : { type: Number, required: true },
    totalRevenue : { type: Number, required: true },
})
WeekRevenue.defaultColumns = 'startdate, enddate, totalBill, ZestyMargin, Memberbership, totalRevenue';
WeekRevenue.register();