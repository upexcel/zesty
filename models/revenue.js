var keystone = require('keystone');
var Types = keystone.Field.Types;

var ZestyRevenue = new keystone.List('ZestyRevenue');

ZestyRevenue.add({
    name: { type: String, default: 'Zesty Revenue'},
    totalBill: { type: Number,required: true,default:0 },
    ZestyMargin : { type: Number, required: true,default:0  },
    Memberbership : { type: Number, required: true,default:0  },
    totalRevenue : { type: Number, required: true,default:0  },
})
ZestyRevenue.defaultColumns = 'name, totalBill, ZestyMargin, Memberbership, totalRevenue';
ZestyRevenue.register();