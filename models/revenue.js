var keystone = require('keystone');
var Types = keystone.Field.Types;

var Revenue = new keystone.List('Revenue');

Revenue.add({
    user: {type: Types.Relationship, ref: "User", index: true},
    bill: {type: Number}
})
Revenue.defaultColumns = 'user, bill';
Revenue.register();