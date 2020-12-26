let keystone = require('keystone');
let Types = keystone.Field.Types;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let cuisine = new keystone.List(('cuisine'), {
	// noedit: true,
	// nocreate: true
});

cuisine.add({
	name: {
		type: String
	}
});

cuisine.register();
