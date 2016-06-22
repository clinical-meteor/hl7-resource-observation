
// create the object using our BaseModel
DiagnosticReport = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
DiagnosticReport.prototype._collection = DiagnosticReports;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
DiagnosticReports = new Mongo.Collection('DiagnosticReports');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
DiagnosticReports._transform = function (document) {
  return new DiagnosticReport(document);
};


if (Meteor.isClient){
  Meteor.subscribe("DiagnosticReports");
}

if (Meteor.isServer){
  Meteor.publish("DiagnosticReports", function (argument){
    if (this.userId) {
      return DiagnosticReports.find();
    } else {
      return [];
    }
  });
}


DiagnosticReportSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "DiagnosticReport"
  },

  "identifier" : {
    optional: true,
    type: [IdentifierSchema]
  }, // Id for external references to this report
  "status" : {
    optional: true,
    type: Code
  }, // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error
  "category" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Service category
  "code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // R!  Name/Code for this diagnostic report
  "subject" : {
    optional: true,
    type: ReferenceSchema
  }, // R!  The subject of the report, usually, but not always, the patient
  "encounter" : {
    optional: true,
    type: ReferenceSchema
  }, // Health care event when test ordered
  "effectiveDateTime" : {
    optional: true,
    type: Date
  },
  "effectivePeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "issued" : {
    optional: true,
    type: Date
  }, // R!  DateTime this version was released
  "performer" : {
    optional: true,
    type: ReferenceSchema
  }, // R!  Responsible Diagnostic Service
  "request" : {
    optional: true,
    type: [ReferenceSchema]
  }, // What was requested
  "specimen" : {
    optional: true,
    type: [ReferenceSchema]
  }, // Specimens this report is based on
  "result" : {
    optional: true,
    type: [ReferenceSchema]
  }, // Observations - simple, or complex nested groups
  "imagingStudy" : {
    optional: true,
    type: [ReferenceSchema]
  }, // Reference to full details of imaging associated with the diagnostic report
  "image.$.comment" : {
    optional: true,
    type: String
  }, // Comment about the image (e.g. explanation)
  "image.$.link" : {
    optional: true,
    type: ReferenceSchema
  } // R!  Reference to the image source
  "conclusion" :{
    optional: true,
    type: String
  }, // Clinical Interpretation of test results
  "codedDiagnosis" : {
    optional: true,
    type: [CodeableConceptSchema]
  }, // Codes for the conclusion
  "presentedForm" : {
    optional: true,
    type: [AttachmentSchema] 
  } // Entire report as issued
});
DiagnosticReports.attachSchema(DiagnosticReportSchema);
