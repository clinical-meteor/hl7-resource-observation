
Observations = new Meteor.Collection('observations');

if (Meteor.isClient){
  Meteor.subscribe('observations');
}



ObservationSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Observation"
    }
});
Observations.attachSchema(ObservationSchema);
