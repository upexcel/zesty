let keystone = require('keystone');
let Types = keystone.Field.Types;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let otherChoices = new keystone.List(('otherChoices'), {
	noedit: true,
	nocreate: true
});

otherChoices.add({
	name: {
		type: String
	},
	dish_1: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_2: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_3: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_4: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_5: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_6: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_7: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_8: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_9: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_10: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_11: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_12: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_13: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_14: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_15: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_16: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_17: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_18: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_19: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	},
	dish_20: {
		type: Types.Relationship,
		ref: 'Dishes',
		collapse: true
	}
});

otherChoices.schema.add({
	foodDetails: {
		type: Schema.Types.Mixed
	}
});

otherChoices.defaultColumns = "name, startdate, enddate"
otherChoices.register();
