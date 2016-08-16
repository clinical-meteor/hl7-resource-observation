##clinical:hl7-resource-diagnostic-report

HL7 FHIR Resource - Diagnostic Report

===============================
#### Conformance Statement  

The resource in this package implements the FHIR Patient Resource DTSU2 schema provided at  [https://www.hl7.org/fhir/observation.html](https://www.hl7.org/fhir/observation.html).  

===============================
#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-diagnostic-report

# to initialize default data
INITIALIZE=true meteor
````


===============================
#### Example   

```js
var newObservation = {
  category: { 
    coding: {
      system : "",
      code: "123.1",
      version: "1",
      display: "foo",
      userSelected: false
    }, 
    text: "Foo"
  },
  valueQuantity: { 
    value: 123,
    unit: "kg",
    system: "http://unitsofmeasure.org"
  },
  subject: {
    display: "...",
    reference:  "Patient/...."
  }
}
Observations.insert(newObservation);
```

===============================
#### Extending the Schema

```js
ExtendedObservationSchema = new SimpleSchema([
  ObservationSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Observations.attachSchema( ExtendedObservationSchema );
```

===============================
#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).

===============================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
