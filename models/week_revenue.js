var keystone = require('keystone');
var Types = keystone.Field.Types;

var WeekRevenue = new keystone.List('ZestyWeekRevenue');

WeekRevenue.add({
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    totalBill: { type: Number ,required: true,default:0 },
    ZestyMargin : { type: Number, required: true,default:0  },
    Memberbership : { type: Number, required: true,default:0  },
    totalRevenue : { type: Number, required: true,default:0  },
})
WeekRevenue.defaultColumns = 'startdate, enddate, totalBill, ZestyMargin, Memberbership, totalRevenue';
WeekRevenue.register();