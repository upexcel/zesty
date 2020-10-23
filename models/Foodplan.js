let keystone = require('keystone');
let Types = keystone.Field.Types;
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let Foodplan = new keystone.List('Foodplan');

Foodplan.add({
    userId: {type: Types.Relationship, ref: "User", index: true},
    startdate:  { type: Types.Datetime, required: true, initial: true },
    enddate:    { type: Types.Datetime, required: true, initial: true }
});

Foodplan.schema.add({
	foodDetails: {
		type: Schema.Types.Mixed
	}
});

Foodplan.register();