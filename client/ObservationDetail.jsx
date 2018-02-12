import { CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { createObservation, removeObservation, updateObservation } from '../lib/methods';

import { Bert } from 'meteor/themeteorchef:bert';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get, has } from 'lodash';


let defaultObservation = {
  status: 'preliminary',
  category: {
    text: ''
  },
  effectiveDateTime: '',
  subject: {
    display: '',
    reference: ''
  },
  performer: {
    display: '',
    reference: ''
  },
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
Session.setDefault('observationDetailState', defaultObservation);


export default class ObservationDetail extends React.Component {
  getMeteorData() {
    let data = {
      observationId: false,
      observation: defaultObservation,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    

    if (Session.get('selectedObservation')) {
      data.observationId = Session.get('selectedObservation');

      let selectedObservation = Observations.findOne({
        _id: Session.get('selectedObservation')
      });
      console.log("selectedObservation", selectedObservation);


      if (selectedObservation) {
        data.observation = selectedObservation;

        if (!Session.get('observationDetailState')) {
          Session.set('observationDetailState', selectedObservation);
        }
      }
    }

    if (Session.get('observationDetailState')) {
      data.observation = Session.get('observationDetailState');
    }

    if(process.env.NODE_ENV === "test") console.log("ObservationDetail[data]", data);
    return data;
  }

  renderDatePicker(displayDatePicker, datePickerValue){
    if (displayDatePicker) {
      return (
        <DatePicker 
          name='datePicker'
          hintText="Date of Administration" 
          container="inline" 
          mode="landscape"
          value={ datePickerValue ? datePickerValue : ''}    
          onChange={ this.changeDate.bind(this, 'datePicker')}      
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
            value={this.data.observation.category.text}
            onChange={ this.changeCategory.bind(this, 'category.text')}
            fullWidth
            /><br/>
          <TextField
            id='valueStringInput'
            ref='valueString.value'
            name='valueString.value'
            floatingLabelText='Value'
            hintText='AB+; pos; neg'
            value={this.data.observation.valueString}
            onChange={ this.changeQuantityString.bind(this, 'valueString.value')}
            fullWidth
            /><br/>
          <TextField
            id='valueQuantityInput'
            ref='valueQuantity.value'
            name='valueQuantity.value'
            floatingLabelText='Quantity'
            hintText='70.0'
            value={this.data.observation.valueQuantity.value}
            onChange={ this.changeQuantityValue.bind(this, 'valueQuantity.value')}
            fullWidth
            /><br/>
          <TextField
            id='valueQuantityUnitInput'
            ref='valueQuantity.unit'
            name='valueQuantity.unit'
            floatingLabelText='Unit'
            hintText='kg'
            value={this.data.observation.valueQuantity.unit}
            onChange={ this.changeQuantityUnit.bind(this, 'valueQuantity.unit')}
            fullWidth
            /><br/>
          <TextField
            id='deviceDisplayInput'
            ref='device.display'
            name='device.display'
            floatingLabelText='Device Name'
            value={this.data.observation.device.display}
            onChange={ this.changeDeviceDisplay.bind(this, 'device.display')}
            fullWidth
            /><br/>
          <TextField
            id='subjectDisplayInput'
            ref='subject.display'
            name='subject.display'
            floatingLabelText='Subject Name'
            value={this.data.observation.subject.display}
            onChange={ this.changeSubjectDisplay.bind(this, 'subject.display')}
            fullWidth
            /><br/>
          <TextField
            id='subjectIdInput'
            ref='subject.reference'
            name='subject.reference'
            floatingLabelText='Subject ID'
            value={this.data.observation.subject.reference}
            onChange={ this.changeSubjectReference.bind(this, 'subject.reference')}
            fullWidth
            /><br/>


          <br/>
            { this.renderDatePicker(this.data.displayDatePicker, get(this, 'data.observation.datePicker') ) }
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

  getObservation(){
    let observationUpdate = Session.get('observationDetailState');
    if (!observationUpdate) {
      observationUpdate = defaultObservation;
    }
  }

  changeCategory(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.category.text = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeQuantityString(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.valueString = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeQuantityValue(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.valueQuantity.value = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeQuantityUnit(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.valueQuantity.unit = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeDeviceDisplay(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.device.display = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeSubjectDisplay(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.subject.display = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeSubjectReference(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.subject.reference = value;
    Session.set('observationDetailState', observationUpdate);
  }
  changeDate(field, event, value) {
    let observationUpdate = Session.get('observationDetailState');
    observationUpdate.datePicker = value;
    Session.set('observationDetailState', observationUpdate);
  }


  openTab(index) {
    // set which tab is selected
    let state = Session.get('observationCardState');
    state["index"] = index;
    Session.set('observationCardState', state);
  }

  // this could be a mixin
  handleSaveButton() {
    if (process.env.NODE_ENV === "test") console.log("this", this);

    let observationFormData = Session.get('observationDetailState');
    observationFormData.valueQuantity.value = Number(observationFormData.valueQuantity.value);

    console.log("observationFormData", observationFormData);

    if (Session.get('selectedObservation')) {


      Observations.update({_id: Session.get('selectedObservation')}, {$set: observationFormData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: Session.get('selectedObservation')});
          Session.set('observationFormData', defaultObservation);
          Session.set('observationDetailState', defaultObservation);
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
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
          Session.set('observationFormData', defaultObservation);
          Session.set('observationDetailState', defaultObservation);
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
    Meteor.call('removeObservationById', ({
      _id: Session.get('selectedObservation')
    }, function(error, result){
      if (erro) {
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: Session.get('selectedObservation')});
        Session.set('observationFormData', defaultObservation);
        Session.set('observationDetailState', defaultObservation);
        Session.set('observationPageTabIndex', 1);
        Bert.alert('Observation deleted!', 'success');
      }
    }));
  }
}


ObservationDetail.propTypes = {
  hasUser: PropTypes.object
};
ReactMixin(ObservationDetail.prototype, ReactMeteorData);