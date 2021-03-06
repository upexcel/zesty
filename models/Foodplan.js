let keystone = require('keystone');
const { Date } = require('keystone/lib/fieldTypes');
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
    adult_count: {type: Number},
    children_count: {type: Number},
    Other_Mentions: {type: String},
    Breakfast_Time_Interval: {type: String},
    Lunch_Time_Interval: {type: String},
    Dinner_Time_Interval: {type: String},
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true },
    Sunday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Sunday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Sunday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Sunday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Sunday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Sunday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Monday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Monday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Monday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Monday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Tuesday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Tuesday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Tuesday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Tuesday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Wednesday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Wednesday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Wednesday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Wednesday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Thursday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Thursday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Thursday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Thursday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Friday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Friday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Friday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Friday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Saturday_Breakfast: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Breakfast_Chef: { type:Types.Relationship, ref: 'Chef'},
    Saturday_Lunch: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Lunch_Chef: { type:Types.Relationship, ref: 'Chef'},
    Saturday_Dinner: { type:Types.Relationship, ref: 'Dishes'},
    Saturday_Dinner_Chef: { type:Types.Relationship, ref: 'Chef'},
    Receiver_Name: { type: Types.Name, required: true, index: true },
    mobile: {type: String},
    Receiver_Email: { type: Types.Email },
    Shipping_Address: {type: String},
    Shipping_State: {type: String},
    other_breakfast_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    other_lunch_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    other_dinner_choices: {type: Types.Relationship, ref: "otherChoices", index: true},
    primary_ingredeints: { type: Types.Relationship, ref: 'primary_ingredeints', many: true, index: true },
    Sunday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Sunday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Sunday_Dinner_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Monday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Monday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Monday_Dinner_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Tuesday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Tuesday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Tuesday_Dinner_Meal:{ type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Wednesday_Breakfast_Meal:{ type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Wednesday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Wednesday_Dinner_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Thursday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Thursday_Lunch_Meal:{ type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Thursday_Dinner_Meal:{ type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Friday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Friday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Friday_Dinner_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Saturday_Breakfast_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Saturday_Lunch_Meal: { type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    Saturday_Dinner_Meal:{ type: Types.Relationship, ref: 'UserDish', many: true, index: true },
    totalBill:{type : Number,default: 0},
    zesty_margin:{type:Number,default: 0},
    membership:{type:Number,default: 0},
    total_revenue:{type:Number,default: 0},
    createdAt:  {type: Types.Datetime, default: Date.now }

});
Foodplan.schema.add({
    foodDetails: {
        type: Schema.Types.Mixed
    }
});
Foodplan.defaultColumns = "name, startdate, enddate, totalbill"
Foodplan.register();