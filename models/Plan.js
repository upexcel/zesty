var keystone = require('keystone');
var Types = keystone.Field.Types;

var Plan = new keystone.List('Plan');

Plan.add({
    planid: {type: String, index:true},
    title: {type: String, index:true},
    price: {type: Number,index:true}    
    }
);
Plan.register();