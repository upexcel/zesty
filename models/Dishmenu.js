let keystone = require('keystone');
let Types = keystone.Field.Types;

let Dishes = new keystone.List('Dishes');

Dishes.add({
    images: { type: Types.CloudinaryImages },
    name: { type: String },
    price: { type: Number },
    base_price:{type:Number},
    // name: { type: Types.Name, required: true, index: true },
    description: { type: String },
    // cuisine: { type: Types.Select, options: 'North Indian, South Indian, Chinese, Italian', index: true, many:true },
    cuisine: { type: Types.Relationship, ref: 'cuisine', many: true, index: true },
    // diet: { type: Types.Select, options: 'Vegetarian, Vegan, Non Vegetarian', index: true },
    type_of_food:{ type: Types.Relationship, ref: 'type_of_food', many: true, index: true },
    primary_ingredeints:{ type: Types.Relationship, ref: 'primary_ingredeints', many: true, index: true },
    diet:{ type: Types.Relationship, ref: 'dietary_requirement', many: true, index: true },
    spice_level: { type: Types.Relationship, ref: 'Spicelevel', many: true, index: true },
    sweet_level: { type: Types.Relationship, ref: 'Sweetlevel', many: true, index: true },
    allergens: {type: Types.Relationship, ref: 'Allergens', many: true, index: true},
    availability: { type: Types.Relationship, ref: 'Availability', many: true, index: true },
    available_days: { type: Types.Relationship, ref: 'Days', many: true, index: true},
    chef: { type: Types.Relationship, ref: 'Chef', index:true},
    make_duplicate: { type: Types.Boolean },
    deep_fried: {type: Types.Select, options: 'yes, no', index: true },
    side_dish: { type: Types.Relationship, ref: 'side_dish', many: true, index: true },
    standard_meal: { type: Types.Relationship, ref: 'side_dish', many: true, index: true }
});


Dishes.schema.pre('save', async function (next) {
    if(this.make_duplicate){
        this.make_duplicate = false;
        let duplicateItem = await this.constructor.create({
            images: this.images,
            name: this.name,
            description: this.description,
            cuisine: this.cuisine,
            diet: this.diet,
            spice_level: this.spice_level,
            allergens: this.allergens,
            availability: this.availability,
            available_days: this.available_days,
            chef: this.chef
        });
        console.log("Duplicate Item Created");
    }
    next();
});


Dishes.defaultColumns = "name, chef"
Dishes.register();