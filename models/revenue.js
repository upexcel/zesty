var keystone = require('keystone');
var Types = keystone.Field.Types;

var ZestyRevenue = new keystone.List('ZestyRevenue');

ZestyRevenue.add({
    name: { type: String, default: 'Zesty Revenue'},
    totalBill: { type: Number,required: true },
    ZestyMargin : { type: Number, required: true },
    Memberbership : { type: Number, required: true },
    totalRevenue : { type: Number, required: true },
})
ZestyRevenue.defaultColumns = 'name, totalBill, ZestyMargin, Memberbership, totalRevenue';
ZestyRevenue.register();