let keystone = require('keystone');
let Types = keystone.Field.Types;

let Subscription = new keystone.List(('Subscription'), {
    hidden: true
});

Subscription.add({
    userId: {type: Types.Relationship, ref: 'User'},
    planId: {type: Types.Relationship, ref: 'Plan'},
    validityPeriodStart:  { type: Types.Datetime, required: true, initial: true },
    validityPeriodEnd:    { type: Types.Datetime, required: true, initial: true },
    subscriptionId: {type: String, index: true}
    // validityPeriod: {type: Number, index: true}   
    }
);
Subscription.register();