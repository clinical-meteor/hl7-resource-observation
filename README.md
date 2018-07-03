## clinical:hl7-resource-observation


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  
[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-observation/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-observation/tree/master)


#### API Reference  
The resource in this package implements the FHIR Observation Resource DTSU2 schema provided at  [https://www.hl7.org/fhir/observation.html](https://www.hl7.org/fhir/observation.html).  


#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-diagnostic-report

# to initialize default data
INITIALIZE=true meteor
````


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


#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).



#### Acknowledgements     

Many thanks to iHealth Labs, DxRx Medical, VisExcell, Parkland Center for Care Innovation, and many others for their support in creating this library.    