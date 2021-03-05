let keystone = require('keystone');
let Types = keystone.Field.Types;

let side_dish = new keystone.List('side_dish');

side_dish.add({
	name: {
		type: String
	},
	price: {
		type: Number
	},
	default_count: {
		type: Number
	}
});

side_dish.register();
