var keystone = require('keystone');
var Types = keystone.Field.Types;

var ZestyRevenue = new keystone.List('ZestyRevenue');

ZestyRevenue.add({
    name: { type: String, default: 'Zesty Revenue'},
    totalBill: { type: Number },
    ZestyMargin : { type: Number },
    Memberbership : { type: Number },
    totalRevenue : { type: Number },
})
ZestyRevenue.defaultColumns = 'name, totalBill, ZestyMargin, Memberbership, totalRevenue';
ZestyRevenue.register();