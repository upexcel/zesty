let keystone = require('keystone');
let Types = keystone.Field.Types;


let Foodplan = new keystone.List(('Foodplan'), {
    noedit: true,
    nocreate: true,
    nodelete: true
});

Foodplan.add({
    user: {type: Types.Relationship, ref: "User", index: true},
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

Foodplan.register();