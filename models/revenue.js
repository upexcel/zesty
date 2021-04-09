var keystone = require('keystone');
var Types = keystone.Field.Types;

var Revenue = new keystone.List('Revenue');

Revenue.add({
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    totalBill: { type: Number },
    ZestyMargin : { type: Number },
    Memberbership : { type: Number },
    totalRevenue : { type: Number },
})
Revenue.defaultColumns = 'startdate, enddate, totalBill, ZestyMargin, Memberbership, totalRevenue';
Revenue.register();