if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}






// create the object using our BaseModel
Observation = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
Observation.prototype._collection = Observations;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
Observations = new Mongo.Collection('Observations');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Observations._transform = function (document) {
  return new Observation(document);
};



ObservationSchema = new SimpleSchema({
  'resourceType' : {
    type: String,
    defaultValue: 'Observation'
  },
  'identifier' : {
    optional: true,
    type: [IdentifierSchema]
  }, // Id for external references to this report
  'status' : {
    optional: true,
    type: Code
  }, // R!  registered | partial | final | corrected | appended | cancelled | entered-in-error
  'category' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Service category
  'code' : {
    optional: true,
    type: CodeableConceptSchema
  }, // R!  Name/Code for this diagnostic report
  'subject' : {
    optional: true,
    type: ReferenceSchema
  }, // R!  The subject of the report, usually, but not always, the patient
  'encounter' : {
    optional: true,
    type: ReferenceSchema
  }, // Health care event when test ordered
  'effectiveDateTime' : {
    optional: true,
    type: Date
  },
  'effectivePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'issued' : {
    optional: true,
    type: Date
  }, // R!  DateTime this version was released
  'performer' : {
    optional: true,
    type: ReferenceSchema
  }, // R!  Responsible Diagnostic Service

  'valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'valueString' : {
    optional: true,
    type: String
  },
  'valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'valueTime' : {
    optional: true,
    type: Date
  },
  'valueDateTime' : {
    optional: true,
    type: Date
  },
  'valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Why the result is missing
  'interpretation' : {
    optional: true,
    type: CodeableConceptSchema
  }, // High, low, normal, etc.
  'comments' : {
    optional: true,
    type: String
  }, // Comments about result
  'bodySite' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Observed body part
  'method' : {
    optional: true,
    type: CodeableConceptSchema
  }, // How it was done
  'specimen' : {
    optional: true,
    type: ReferenceSchema
  }, // Specimen used for this observation
  'device' : {
    optional: true,
    type: ReferenceSchema
  }, // (Measurement) Device

  'referenceRange.$.low' : {
    optional: true,
    type: QuantitySchema
  }, // C? Low Range, if relevant
  'referenceRange.$.high' : {
    optional: true,
    type: QuantitySchema
  }, // C? High Range, if relevant
  'referenceRange.$.meaning' : {
    optional: true,
    type: CodeableConceptSchema
  }, // Indicates the meaning/use of this range of this range
  'referenceRange.$.age' : {
    optional: true,
    type: RangeSchema
  }, // Applicable age range, if relevant
  'referenceRange.$.text' : {
    optional: true,
    type: String
  }, // Text based reference range in an observation

  'related.$.type' : {
    optional: true,
    type: Code
  }, // has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
  'related.$.target' : {
    optional: true,
    type: ReferenceSchema
  }, // R!  Resource that is related to this one

  'component.$.code' : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? R!  Type of component observation (code / type)
  'component.$.valueQuantity' : {
    optional: true,
    type: QuantitySchema
  },
  'component.$.valueCodeableConcept' : {
    optional: true,
    type: CodeableConceptSchema
  },
  'component.$.valueString' : {
    optional: true,
    type: String
  },
  'component.$.valueRange' : {
    optional: true,
    type: RangeSchema
  },
  'component.$.valueRatio' : {
    optional: true,
    type: RatioSchema
  },
  'component.$.valueSampledData' : {
    optional: true,
    type: SampledDataSchema
  },
  'component.$.valueAttachment' : {
    optional: true,
    type: AttachmentSchema
  },
  'component.$.valueTime' : {
    optional: true,
    type: Date
  },
  'component.$.valueDateTime' : {
    optional: true,
    type: Date
  },
  'component.$.valuePeriod' : {
    optional: true,
    type: PeriodSchema
  },
  'component.$.dataAbsentReason' : {
    optional: true,
    type: CodeableConceptSchema
  }

});
Observations.attachSchema(ObservationSchema);
