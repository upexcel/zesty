let keystone = require('keystone');
let Types = keystone.Field.Types;


let systemDates = new keystone.List('SystemDates');

systemDates.add({
    chefstartdate: { type: Types.Datetime, required: true, initial: true },
    chefenddate: { type: Types.Datetime, required: true, initial: true },
    weekstartdate: { type: Types.Datetime, required: true, initial: true },
    weekenddate: { type: Types.Datetime, required: true, initial: true }
});

systemDates.register();