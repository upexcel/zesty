//UserDish.js
let keystone = require('keystone');
let Types = keystone.Field.Types;
let user_dish = new keystone.List('UserDish');
user_dish.add({
	name: {
		type: String
	},
	count: {
		type: Number
	},
    dish : { 
        type: Types.Relationship, 
        ref: 'side_dish'
    }
});
user_dish.register();