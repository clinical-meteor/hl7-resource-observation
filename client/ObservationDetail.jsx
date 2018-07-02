import { CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { createObservation, removeObservation, updateObservation } from '../lib/methods';

import { Bert } from 'meteor/clinical:alert';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get, has } from 'lodash';


let defaultObservation = {
  resourceType: 'Observation',
  status: 'preliminary',
  category: {
    text: ''
  },
  effectiveDateTime: '',
  subject: {
    display: '',
    reference: ''
  },
  performer: [],
  device: {
    display: '',
    reference: ''
  },
  valueQuantity: {
    value: '',
    unit: '',
    system: 'http://unitsofmeasure.org'
  },
  valueString: ''
};
Session.setDefault('observationUpsert', false);
Session.setDefault('selectedObservation', false);


export class ObservationDetail extends React.Component {
  getMeteorData() {
    let data = {
      observationId: false,
      observation: defaultObservation,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    
    if (Session.get('observationUpsert')) {
      data.observation = Session.get('observationUpsert');
      //data.observationId = Session.get('selectedObservation');
    } else {

      if (Session.get('selectedObservation')) {
        data.observationId = Session.get('selectedObservation');
  
        let selectedObservation = Observations.findOne({
          _id: Session.get('selectedObservation')
        });
        console.log("selectedObservation", selectedObservation);
  
        if (selectedObservation) {
          data.observation = selectedObservation;  

          // if (typeof selectedObservation.effectiveDateTime === "object") {
          //   data.observation.effectiveDateTime = moment(selectedObservation.effectiveDateTime).add(1, 'day').format("YYYY-MM-DD");
          // }
        }
      } else {
        data.observation = defaultObservation;          
      }
    }

    if(process.env.NODE_ENV === "test") console.log("ObservationDetail[data]", data);
    return data;
  }
  changeState(field, event, value){
    let observationUpsert;

    if(process.env.NODE_ENV === "test") console.log("ObservationDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new observation
    if (Session.get('observationUpsert')) {
      observationUpsert = Session.get('observationUpsert');
    } else {
      observationUpsert = defaultObservation;
    }
    
    // if there's an existing organization, use them
    if (Session.get('selectedObservation')) {
      observationUpsert = this.data.observation;
    } 

    switch (field) {
      case "category.text":
        observationUpsert.category.text = value;
        break;
      case "valueString.value":
        observationUpsert.valueString.value = value;
        break;
      case "valueQuantity.value":
        observationUpsert.valueQuantity.value = value;
        break;
      case "valueQuantity.unit":
        observationUpsert.valueQuantity.unit = value;
        break;
      case "device.display":
        observationUpsert.device.display = value;
        break;
      case "subject.display":
        observationUpsert.subject.display = value;
        break;
      case "subject.reference":
        observationUpsert.subject.reference = value;
        break;
      case "effectiveDateTime":
        observationUpsert.effectiveDateTime = value;
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("observationUpsert", observationUpsert);

    Session.set('observationUpsert', observationUpsert);
  }
  renderDatePicker(displayDatePicker, effectiveDateTime){
    console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    if (displayDatePicker) {
      return (
        <DatePicker 
          name='effectiveDateTime'
          hintText="Date of Administration" 
          container="inline" 
          mode="landscape"
          value={ effectiveDateTime ? effectiveDateTime : null}    
          onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
          />
      );
    }
  }
  render() {
    return (
      <div id={this.props.id} className="observationDetail">
        <CardText>
          <TextField
            id='categoryTextInput'
            ref='category.text'
            name='category.text'
            floatingLabelText='Category'
            value={ get(this, 'data.observation.category.text') }
            onChange={ this.changeState.bind(this, 'category.text')}
            fullWidth
            /><br/>
          <TextField
            id='valueStringInput'
            ref='valueString.value'
            name='valueString.value'
            floatingLabelText='Value'
            hintText='AB+; pos; neg'
            value={ get(this, 'data.observation.valueString') }
            onChange={ this.changeState.bind(this, 'valueString.value')}
            fullWidth
            /><br/>
          <TextField
            id='valueQuantityInput'
            ref='valueQuantity.value'
            name='valueQuantity.value'
            floatingLabelText='Quantity'
            hintText='70.0'
            value={ get(this, 'data.observation.valueQuantity.value') }
            onChange={ this.changeState.bind(this, 'valueQuantity.value')}
            fullWidth
            /><br/>
          <TextField
            id='valueQuantityUnitInput'
            ref='valueQuantity.unit'
            name='valueQuantity.unit'
            floatingLabelText='Unit'
            hintText='kg'
            value={ get(this, 'data.observation.valueQuantity.unit') }
            onChange={ this.changeState.bind(this, 'valueQuantity.unit')}
            fullWidth
            /><br/>
          <TextField
            id='deviceDisplayInput'
            ref='device.display'
            name='device.display'
            floatingLabelText='Device Name'
            value={ get(this, 'data.observation.device.display') }
            onChange={ this.changeState.bind(this, 'device.display')}
            fullWidth
            /><br/>
          <TextField
            id='subjectDisplayInput'
            ref='subject.display'
            name='subject.display'
            floatingLabelText='Subject Name'
            value={ get(this, 'data.observation.subject.display') }
            onChange={ this.changeState.bind(this, 'subject.display')}
            fullWidth
            /><br/>
          <TextField
            id='subjectIdInput'
            ref='subject.reference'
            name='subject.reference'
            floatingLabelText='Subject ID'
            value={ get(this, 'data.observation.subject.reference') }
            onChange={ this.changeState.bind(this, 'subject.reference')}
            fullWidth
            /><br/>

          <br/>
            { this.renderDatePicker(this.data.displayDatePicker, get(this, 'data.observation.effectiveDateTime') ) }
          <br/>

        </CardText>
        <CardActions>
          { this.determineButtons(this.data.observationId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(observationId) {
    if (observationId) {
      return (
        <div>
          <RaisedButton id="saveObservationButton" label="Save" className="saveObservationButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteObservationButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return (
        <RaisedButton id="saveObservationButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  // getObservation(){
  //   let observationUpsert = Session.get('observationUpsert');
  //   if (!observationUpsert) {
  //     observationUpsert = defaultObservation;
  //   }
  // }
  // changeCategory(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.category.text = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeQuantityString(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.valueString = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeQuantityValue(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.valueQuantity.value = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeQuantityUnit(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.valueQuantity.unit = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeDeviceDisplay(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.device.display = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeSubjectDisplay(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.subject.display = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeSubjectReference(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.subject.reference = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }
  // changeDate(field, event, value) {
  //   let observationUpsert = Session.get('observationUpsert');
  //   observationUpsert.datePicker = value;
  //   Session.set('observationUpsert', observationUpsert);
  // }


  openTab(index) {
    // set which tab is selected
    let state = Session.get('observationCardState');
    state["index"] = index;
    Session.set('observationCardState', state);
  }

  // this could be a mixin
  handleSaveButton() {
    if (process.env.NODE_ENV === "test") console.log("this", this);

    let observationFormData = Session.get('observationUpsert');
    observationFormData.valueQuantity.value = Number(observationFormData.valueQuantity.value);

    // console.log("observationFormData", observationFormData);

    if (Session.get('selectedObservation')) {


      Observations.update({_id: Session.get('selectedObservation')}, {$set: observationFormData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: Session.get('selectedObservation')});
          Session.set('observationUpsert', false);
          Session.set('selectedObservation', false);
          Session.set('observationPageTabIndex', 1);
          Bert.alert('Observation added!', 'success');
        }
      });
    } else {
      observationFormData.effectiveDateTime = new Date();
      if (process.env.NODE_ENV === "test") console.log("create a new observation", observationFormData);

      Observations.insert(observationFormData, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
          // Session.set('observationFormData', defaultObservation);
          Session.set('observationUpsert', false);
          Session.set('selectedObservation', false);
          Session.set('observationPageTabIndex', 1);
          Bert.alert('Observation added!', 'success');
        }
      });
    }
  }

  // this could be a mixin
  handleCancelButton() {
    Session.set('observationPageTabIndex', 1);
  }

  handleDeleteButton() {
    console.log('delete observation...', Session.get('selectedObservation'))

    Meteor.call('removeObservationById', Session.get('selectedObservation'), function(error, result){
      if (error) {
        console.log('error', error)
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('observationPageTabIndex', 1);
        Session.set('observationUpsert', false);
        Session.set('selectedObservation', false);
        Bert.alert('Observation deleted!', 'success');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: Session.get('selectedObservation')});
      }
    });
  }
}

ObservationDetail.propTypes = {
  hasUser: PropTypes.object
};
ReactMixin(ObservationDetail.prototype, ReactMeteorData);
export default ObservationDetail;