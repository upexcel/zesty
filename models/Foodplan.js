let keystone = require('keystone');
let Types = keystone.Field.Types;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let Foodplan = new keystone.List(('Foodplan'), {
    noedit: true,
    nocreate: true
});

Foodplan.add({
    user: {type: Types.Relationship, ref: "User", index: true},
    Primary_Cuisine: { type: Types.TextArray },
    Secondary_Cuisine: { type: Types.TextArray },
    Meal_Types: { type: Types.TextArray },
    Spice_Level: { type: Types.TextArray },
    Allergens: { type: Types.TextArray },
    Meal_Timing: { type: Types.TextArray },
    Days: { type: Types.TextArray },

    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    Sunday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Sunday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Sunday_dinner: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Dinner: { type:Types.Relationship, ref: 'Dishes'},

});

Foodplan.schema.add({
	foodDetails: {
		type: Schema.Types.Mixed
	}
});

Foodplan.defaultColumns = "user, startdate, enddate"
Foodplan.register();