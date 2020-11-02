let keystone = require('keystone');
let Types = keystone.Field.Types;

let Dishes = new keystone.List('Dishes');

Dishes.add({
    images: { type: Types.CloudinaryImages },
    name: { type: String },
    // name: { type: Types.Name, required: true, index: true },
    description: { type: String },
    cuisine: { type: Types.Select, options: 'North Indian, South Indian, Chinese, Italian', index: true },
    diet: { type: Types.Select, options: 'Vegetarian, Vegan, Non Vegetarian', index: true },
    spice_level: { type: Types.Select, options: '1,2,3', index: true },
    allergens: {type: Types.Relationship, ref: 'Allergens', many: true, index: true},
    availability: { type: Types.Relationship, ref: 'Availability', many: true, index: true },
    available_days: { type: Types.Relationship, ref: 'Days', many: true, index: true},
    chef: { type: Types.Relationship, ref: 'Chef', index:true}
});

Dishes.defaultColumns = "name, chef"
Dishes.register();