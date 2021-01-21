let keystone = require('keystone');
let Types = keystone.Field.Types;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let Foodplan = new keystone.List(('Foodplan'), {
    noedit: true,
    nocreate: true
});

Foodplan.add({
    name: { type: Types.Name, required: true, index: true },
    user: {type: Types.Relationship, ref: "User", index: true},
    Primary_Cuisine: { type: Types.TextArray },
    Secondary_Cuisine: { type: Types.TextArray },
    Meal_Types: { type: Types.TextArray },
    Spice_Level: { type: Types.TextArray },
    Allergens: { type: Types.TextArray },
    Meal_Timing: { type: Types.TextArray },
    Days: { type: Types.TextArray },
    Order_For: {type: String},
    Other_Mentions: {type: String},
    Breakfast_Time_Interval: {type: String},
    Lunch_Time_Interval: {type: String},
    Dinner_Time_Interval: {type: String},

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
    Receiver_Name: { type: Types.Name, required: true, index: true },
    Receiver_Email: { type: Types.Email },
    Shipping_Address: {type: String},
    Shipping_State: {type: String},
    other_breakfast_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    other_lunch_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    other_dinner_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    primary_ingredeints:{ type: Types.TextArray },
});

Foodplan.schema.add({
	foodDetails: {
		type: Schema.Types.Mixed
	}
});

Foodplan.defaultColumns = "name, startdate, enddate"
Foodplan.register();