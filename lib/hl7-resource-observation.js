
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


if (Meteor.isClient){
  Meteor.subscribe("Observations");
}

if (Meteor.isServer){
  Meteor.publish("Observations", function (argument){
    if (this.userId) {
      return Observations.find();
    } else {
      return [];
    }
  });
}


ObservationSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Observation"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
  }, // Unique Id for this particular observation
  "status" : {
    optional: true,
    type: Code
  }, // R!  registered | preliminary | final | amended +
  "category" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Classification of  type of observation
  "code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // R!  Type of observation (code / type)
  "subject" : {
    optional: true,
    type: ReferenceSchema
  }, // (Patient|Group|Device|Location) Who and/or what this is about
  "encounter" : {
    optional: true,
    type: ReferenceSchema
  }, // (Encounter)Healthcare event during which this observation is made
  // effective[x]: Clinically relevant time/time-period for observation. One of these 2:
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
  }, // Date/Time this was made available
  "performer" : {
    optional: true,
    type: [ ReferenceSchema ]
  }, // (Practitioner|Organization|Patient|RelatedPerson) Who is responsible for the observation
  // value[x]: Actual result. One of these 10:
  "valueQuantity" : {
    optional: true,
    type: QuantitySchema
  },
  "valueCodeableConcept" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "valueString" : {
    optional: true,
    type: String
  },
  "valueRange" : {
    optional: true,
    type: RangeSchema
  },
  "valueRatio" : {
    optional: true,
    type: RatioSchema
  },
  "valueSampledData" : {
    optional: true,
    type: SampledDataSchema
  },
  "valueAttachment" : {
    optional: true,
    type: AttachmentSchema
  },
  "valueTime" : {
    optional: true,
    type: Date
  },
  "valueDateTime" : {
    optional: true,
    type: Date
  },
  "valuePeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "dataAbsentReason" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Why the result is missing
  "interpretation" : {
    optional: true,
    type: CodeableConceptSchema
  }, // High, low, normal, etc.
  "comments" : {
    optional: true,
    type: String
  }, // Comments about result
  "bodySite" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Observed body part
  "method" : {
    optional: true,
    type: CodeableConceptSchema
  }, // How it was done
  "specimen" : {
    optional: true,
    type: ReferenceSchema
  }, // (Specimen) Specimen used for this observation
  "device" : {
    optional: true,
    type: ReferenceSchema
  }, // (Device|DeviceMetric) (Measurement) Device
  "referenceRange.$.low" : {
    optional: true,
    type: QuantitySchema
  }, // C? Low Range, if relevant
  "referenceRange.$.high" : {
    optional: true,
    type: QuantitySchema
  }, // C? High Range, if relevant
  "referenceRange.$.meaning" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Indicates the meaning/use of this range of this range
  "referenceRange.$.age" : {
    optional: true,
    type: RangeSchema
  }, // Applicable age range, if relevant
  "referenceRange.$.text" : {
    optional: true,
    type: String
  },// Text based reference range in an observation
  "related.$.type" : {
    optional: true,
    type: Code
  }, // has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by
  "related.$.target" : {
    optional: true,
    type: ReferenceSchema
  }, // (Observation|QuestionnaireResponse)  R!  Resource that is related to this one
  "component.$.code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? R!  Type of component observation (code / type)
  // value[x]: Actual component result. One of these 10:
  "component.$.valueQuantity" : {
    optional: true,
    type: QuantitySchema
  },
  "component.$.valueCodeableConceptSchema" : {
    optional: true,
    type: CodeableConceptSchema
  },
  "component.$.valueString" : {
    optional: true,
    type: String
  },
  "component.$.valueRange" : {
    optional: true,
    type: RangeSchema
  },
  "component.$.valueRatio" : {
    optional: true,
    type: RatioSchema
  },
  "component.$.valueSampledData" : {
    optional: true,
    type: SampledDataSchema
  },
  "component.$.valueAttachment" : {
    optional: true,
    type: AttachmentSchema
  },
  "component.$.valueTime" : {
    optional: true,
    type: Date
  },
  "component.$.valueDateTime" : {
    optional: true,
    type: Date
  },
  "component.$.valuePeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "component.$.dataAbsentReason" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Why the component result is missing
  "component.$.referenceRange" : {
    optional: true,
    type: [ Object ]
  }// Provides guide for interpretation of component result
});
Observations.attachSchema(ObservationSchema);
