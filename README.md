##clinical:hl7-resource-diagnostic-report

HL7 FHIR Resource - Diagnostic Report

===============================
#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-diagnostic-report

# to initialize default data
INITIALIZE=true meteor
````

===============================
#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).

===============================
#### Conformance Statement  

The resource in this package implements the FHIR Patient Resource schema provided at  [https://www.hl7.org/fhir/diagnosticreport.html](https://www.hl7.org/fhir/diagnosticreport.html).  



===============================
#### Example   

```js
var newObservation = {
  category: { 
    "coding": {
      "system" : "",
      "code": "123.1",
      "version": "1",
      "display": "foo",
      "userSelected": false
    }, 
    "text": "Foo"
  },
  code: { 
   "coding": {
     "system" : "",
     "code": "333.a",
     "version": "1",
     "display": "Bar",
     "userSelected": false
   }, 
   "text": "Bar"
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

```
ExtendedObservationSchema = new SimpleSchema([
  ObservationSchema,
  {
    "createdAt": {
      type: Date,
      optional: true
    }
  }
]);
Observations.attachSchema( ExtendedObservationSchema );
```


===============================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
