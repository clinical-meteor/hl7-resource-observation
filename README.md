## clinical:hl7-resource-observation

> **NOTICE:  After a very successful run of nearly 50+ pilots and prototypes, this package is being retired and archived.  Future work on FHIR Observation resource is being done in the [clinical:hl7-fhir-data-infrastructure](https://github.com/clinical-meteor/hl7-fhir-data-infrastructure) atmosphere package and the [material-fhir-ui](https://github.com/clinical-meteor/material-fhir-ui) NPM package.**    

> One of our learnings over the 50+ pilots was how to best organize our packages, and we've determined that we want to a) consolidate React pure function components (Tables, Cards, etc) into an NPM package that is accessible to Webpack and other build environments.  And b) we wanted to consolidate the React class components which rely on Meteor's reactive data infrastructure into it's own separate package.  We're also c) moving the Rest server endpoints into a third package.   

> Separating each FHIR resource into it's own package was a time consuming task; but was definately worth.  Over the 50+ pilots, we were able to track usage patterns and what functionality was specific to each resource and what was shared, common, infrastructure.  Our refactor back into a consolidated package architecture will be based on all those learnings, and we look forward to publishing some of the best FHIR UI libraries on the web.  

#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

#### API Reference  
The resource in this package implements the FHIR Observation Resource DTSU2 schema provided at  [https://www.hl7.org/fhir/DSTU2/observation.html](https://www.hl7.org/fhir/DSTU2/observation.html).  


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
