let keystone = require('keystone');
let Types = keystone.Field.Types;

let side_dish = new keystone.List('side_dish');

side_dish.add({
	name: {
		type: String
	}
});

side_dish.register();
