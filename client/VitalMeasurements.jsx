import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { CardTitle, CardText, TextField, RaisedButton } from 'material-ui';

import { GlassCard } from 'meteor/clinical:glass-ui';
import { Meteor } from 'meteor/meteor';

import { Grid, Row, Col, ListGroupItem, FormControl, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { get } from 'lodash';

var FontAwesome = require('react-fontawesome');

Session.setDefault('vitalsForm', {
  pulse: '',
  temperature: '',
  respiration: '',
  bloodPressure: '',
  notes: ''
});
export class VitalMeasurements extends React.Component {
  getMeteorData() {
    let data = {
      style: {},
      state: {
        pulse: '',
        temperature: '',
        respiration: '',
        bloodPressure: '',
        notes: ''
      }
    };

    if (Session.get('vitalsForm')) {
      data.state = Session.get('vitalsForm');
    }

    return data;
  }
  render(){
      var spoonCounter;

      if(get(Meteor, 'settings.public.vitals.showSpoonCounter')){
          spoonCounter = <TextField
            id='temperatureInput'
            ref='temperature'
            name='temperature'
            floatingLabelText="Spoons"
            floatingLabelFixed={true}
            onChange={this.changePost.bind(this, 'temperature')}
            fullWidth
            >
            <div style={{paddingTop: '25px'}}>
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px', color: 'lightgray'}} />
                <FontAwesome name="spoon" style={{fontSize: '150%', marginRight: '10px', color: 'lightgray'}} />
            </div>
        </TextField>
      }
    return (
      <GlassCard id="addPostCard">
        <CardText>
          <Row>
            <Col xs={6}>
              <TextField
                id='puleInput'
                ref='pulse'
                name='pulse'
                floatingLabelText="Pulse (bmp)"
                value={this.data.state.pulse}
                hintText='60'
                onChange={this.changePost.bind(this, 'pulse')}
                fullWidth
                /><br/>
              <TextField
                id='temperatureInput'
                ref='temperature'
                name='temperature'
                floatingLabelText="Temperature (f/c)"
                hintText='98.6'
                value={this.data.state.temperature}
                onChange={this.changePost.bind(this, 'temperature')}
                fullWidth
                /><br/>
            </Col>
            <Col xs={6}>
              <TextField
                id='respirationRate'
                ref='respiration'
                name='respiration'
                hintText='15'
                floatingLabelText="Respiration (bpm)"
                value={this.data.state.respiration}
                onChange={this.changePost.bind(this, 'respiration')}
                fullWidth
                /><br/>
              <TextField
                id='bloodPressureInput'
                ref='bloodPressure'
                name='bloodPressure'
                floatingLabelText="Blood Pressure (s/d)"
                hintText='120 / 80'
                value={this.data.state.bloodPressure}
                onChange={this.changePost.bind(this, 'bloodPressure')}
                fullWidth
                /><br/>
            </Col>
          </Row>
          { spoonCounter }
          <br />
          <TextField
            id='notesInput'
            ref='notesContent'
            name='notesContent'
            floatingLabelText="New clinical impression..."
            value={this.data.state.notes}
            onChange={this.changePost.bind(this, 'notes')}
            multiLine={true}
            rows={5}
            fullWidth
            /><br/>
          <br />

          <RaisedButton id="addObservationButton" onMouseUp={ this.handleInsertObservations.bind(this) } primary={true} label='New Observation' />
        </CardText>
      </GlassCard>
    );
  }
  handleInsertObservations(){

    console.log('handleInsertObservations', this.data.state)

    let defaultObservation = {
      meta: {
        lastUpdated: new Date()
      },
      status: 'preliminary',
      category: {
        text: ''
      },
      effectiveDateTime: new Date(),
      subject: {
        display: Meteor.user().fullName(),
        reference: Meteor.userId()
      },
      performer: [{
        display: Meteor.user().fullName(),
        reference: Meteor.userId()
      }],
      device: {
        display: 'Web App',
        reference: 'WebApp'
      },
      valueQuantity: {
        value: '',
        unit: '',
        system: 'http://unitsofmeasure.org'
      },
      valueString: ''
    };



    //---------------------------------------------------------------
    // PULSE

    var pulseObservation = defaultObservation;
    pulseObservation.category.text = 'Pulse';
    pulseObservation.valueQuantity.unit = 'bmp';
    pulseObservation.valueQuantity.value = this.data.state.pulse;
    
    if(process.env.NODE_ENV === "test"){
      console.log('pulseObservation', pulseObservation)
    }
    Observations.insert(pulseObservation, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        //HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
        Bert.alert('Observation added!', 'success');
      }
    });

    //---------------------------------------------------------------
    // RESPIRATION

    var respirationObservation = defaultObservation;
    respirationObservation.category.text = 'Respiration';
    respirationObservation.valueQuantity.unit = 'bmp';
    respirationObservation.valueQuantity.value = this.data.state.respiration;
    
      if(process.env.NODE_ENV === "test"){
        console.log('respirationObservation', respirationObservation)
      }
      Observations.insert(respirationObservation, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        //HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
        Bert.alert('Observation added!', 'success');
      }
    });    


    //---------------------------------------------------------------
    // RESPIRATION

    var temperatureObservation = defaultObservation;
    temperatureObservation.category.text = 'Temperature';
    temperatureObservation.valueQuantity.unit = 'F';
    temperatureObservation.valueQuantity.value = this.data.state.temperature;
    
    if(process.env.NODE_ENV === "test"){
        console.log('temperatureObservation', temperatureObservation)
    }

    Observations.insert(temperatureObservation, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        //HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
        Bert.alert('Observation added!', 'success');
      }
    }); 


    //---------------------------------------------------------------
    // BLOOD PRESSURE

    var bloodPressureObservation = defaultObservation;

    bloodPressureObservation.category.text = 'Blood Pressure';
    bloodPressureObservation.valueString = this.data.state.bloodPressure + ' mmHg';    
    temperatureObservation.valueQuantity = null;
    
    if(process.env.NODE_ENV === "test"){
        console.log('bloodPressureObservation', bloodPressureObservation)
    }

    Observations.insert(bloodPressureObservation, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        //HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: result});
        Bert.alert('Observation added!', 'success');
      }
    });

    browserHistory.push('/observations');
  }




  changePost(field, event, value){
    var vitalsForm = Session.get('vitalsForm');
    vitalsForm[field] = value;
    Session.set('vitalsForm', vitalsForm);
  }
}



ReactMixin(VitalMeasurements.prototype, ReactMeteorData);
export default VitalMeasurements;