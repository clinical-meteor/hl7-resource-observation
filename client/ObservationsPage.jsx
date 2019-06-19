
import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';

import { GlassCard, VerticalCanvas, FullPageCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import ObservationDetail from './ObservationDetail';
import ObservationsTable from './ObservationsTable';

Session.setDefault('observationPageTabIndex', 1);
Session.setDefault('observationSearchFilter', '');
Session.setDefault('selectedObservationId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class ObservationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('observationPageTabIndex'),
      observationSearchFilter: Session.get('observationSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedObservationId: Session.get("selectedObservationId"),
      paginationLimit: 100,
      selectedObservation: false,
      selected: [],
      observations: []
    };

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      data.paginationLimit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    if (Session.get('selectedObservationId')){
      data.selectedObservation = Observations.findOne({_id: Session.get('selectedObservationId')});
      this.state.observation = Observations.findOne({_id: Session.get('selectedObservationId')});
      this.state.observationId = Session.get('selectedObservationId');
    } else {
      data.selectedObservation = false;
      this.state.observationId = false;
      this.state.observation = {}
    }

    data.patients = Observations.find().fetch();

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(get(Meteor, 'settings.public.logging') === "debug") console.log("ObservationsPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('observationPageTabIndex', index);
  }
  handleActive(index){
  }
  // this could be a mixin
  onNewTab(){
    console.log("onNewTab; we should clear things...");

    Session.set('selectedObservationId', false);
    // Session.set('observationDetailState', {
    //   resourceType: 'Observation',
    //   status: 'preliminary',
    //   category: {
    //     text: ''
    //   },
    //   effectiveDateTime: '',
    //   subject: {
    //     display: '',
    //     reference: ''
    //   },
    //   performer: {
    //     display: '',
    //     reference: ''
    //   },
    //   device: {
    //     display: '',
    //     reference: ''
    //   },
    //   valueQuantity: {
    //     value: '',
    //     unit: '',
    //     system: 'http://unitsofmeasure.org'
    //   }
    // });
  }
  onTableRowClick(observationId){
    Session.set('selectedObservationId', observationId);
    Session.set('selectedPatient', Observations.findOne(observationId));
  }
  onTableCellClick(id){
    Session.set('patientsUpsert', false);
    Session.set('selectedObservationId', id);
    Session.set('patientPageTabIndex', 2);
  }
  tableActionButtonClick(_id){
    let patient = Observations.findOne({_id: _id});

    // console.log("ObservationTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Observation', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(observationId){
    Session.set('selectedObservationId', false);
    Session.set('observationPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onUpdate(observationId){
    Session.set('selectedObservationId', false);
    Session.set('observationPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onRemove(observationId){
    Session.set('observationPageTabIndex', 1);
    Session.set('selectedObservationId', false);
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: observationId});
  }
  onCancel(){
    Session.set('observationPageTabIndex', 1);
  }
  render() {
    return (
      <div id="observationsPage">
        <VerticalCanvas>
          <GlassCard height='auto'>
            <CardTitle
              title="Observations"
            />
            <Tabs id="observationsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
              <Tab className="newObservationTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0} >
                <ObservationDetail 
                  id='newObservation' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  showHints={true}
                  onInsert={ this.onInsert }
                  observation={ this.data.selectedObservation }
                  observationId={ this.data.selectedObservationId } 
                  />
              </Tab>
              <Tab className="observationListTab" label='Observations' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <ObservationsTable 
                  displayBarcodes={false} 
                  multiline={false}
                  showSubjects={false}
                  showDevices={false}

                  noDataMessagePadding={100}
                  patients={ this.data.observations }
                  paginationLimit={ this.data.pagnationLimit }
                  appWidth={ Session.get('appWidth') }
                  actionButtonLabel="Send"
                  onRowClick={ this.onTableRowClick }
                  onCellClick={ this.onTableCellClick }
                  onActionButtonClick={this.tableActionButtonClick}


                  />
              </Tab>
              <Tab className="observationDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                <ObservationDetail 
                  id='observationDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  observation={ this.data.selectedObservation }
                  observationId={ this.data.selectedObservationId } 
                  showPatientInputs={true}
                  showHints={false}
                  onInsert={ this.onInsert }
                  onUpdate={ this.onUpdate }
                  onRemove={ this.onRemove }
                  onCancel={ this.onCancel }
                  />
              </Tab>
            </Tabs>

          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}



ReactMixin(ObservationsPage.prototype, ReactMeteorData);

export default ObservationsPage;