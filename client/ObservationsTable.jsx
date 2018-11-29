import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Table } from 'react-bootstrap';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { get } from 'lodash';


flattenObservation = function(observation){
  let result = {
    _id: '',
    category: '',
    code: '',
    valueString: '',
    observationValue: '',
    subject: '',
    subjectId: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    unit: ''
  };

  result._id =  get(observation, 'id') ? get(observation, 'id') : get(observation, '_id');
  result.category = get(observation, 'category.text', '');
  result.code = get(observation, 'code.text', '');
  result.valueString = get(observation, 'valueString', '');
  result.comparator = get(observation, 'valueQuantity.comparator', '');
  result.observationValue = get(observation, 'valueQuantity.value', '');
  result.unit = get(observation, 'valueQuantity.unit', '');
  result.subject = get(observation, 'subject.display', '');
  result.subjectId = get(observation, 'subject.reference', '');
  result.device = get(observation, 'device.display', '');
  result.status = get(observation, 'status', '');
  result.effectiveDateTime =  moment(get(observation, 'effectiveDateTime')).format("YYYY-MM-DD hh:ss a");

  return result;
}


export class ObservationsTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        text: Glass.darkroom()
      },
      selected: [],
      observations: []
    };


    if(this.props.data){
      console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(observation){
          data.observations.push(flattenObservation(observation));
        });  
      }
    } else {
      let query = {};
      if(this.props.query){
        query = this.props.query
      }
      data.observations = Observations.find(query).map(function(observation){
        return flattenObservation(observation);
      });
    }


    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.WebkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    if(process.env.NODE_ENV === "test") console.log("ObservationsTable[data]", data);
    return data;
  }
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }

  handleSelect(selected) {
    this.setState({selected});
  }
  getDate(){
    return "YYYY/MM/DD";
  }
  noChange(){
    return "";
  }
  rowClick(id){
    Session.set("selectedObservationId", id);
    Session.set('observationPageTabIndex', 2);
    Session.set('observationDetailState', false);
  }
  renderBarcode(id){
    if (this.props.displayBarcodes) {
      return (
        <td><span className="barcode">{id}</span></td>
      );
    }
  }
  renderBarcodeHeader(){
    if (this.props.displayBarcodes) {
      return (
        <th>_id</th>
      );
    }
  }
  renderSubject(id){
    if (this.props.showSubjects) {
      return (
        <td className='name'>{ id }</td>
      );
    }
  }
  renderSubjectHeader(){
    if (this.props.showSubjects) {
      return (
        <th className='name'>subject</th>
      );
    }
  }
  renderDevice(id){
    if (this.props.showDevices) {
      return (
        <td className='device.display'>{device }</td>
      );
    }
  }
  renderDeviceHeader(){
    if (this.props.showDevices) {
      return (
        <th className='device.display'>device</th>
      );
    }
  }
  
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.observations.length; i++) {
      tableRows.push(
        <tr className="observationRow" key={i} style={this.data.style.text} onClick={ this.rowClick.bind(this, this.data.observations[i]._id)} >

          <td className='category'>{this.data.observations[i].category }</td>
          <td className='code'>{this.data.observations[i].code }</td>
          <td className='valueString'>{this.data.observations[i].valueString }</td>
          <td className='comparator'>{this.data.observations[i].comparator }</td>
          <td className='value'>{this.data.observations[i].observationValue }</td>
          <td className='unit'>{this.data.observations[i].unit }</td>
          {this.renderSubject(this.data.observations[i].subject)}
          <td className='status'>{this.data.observations[i].status }</td>
          {this.renderDevice(this.data.observations[i].device)}
          <td className='date'>{this.data.observations[i].effectiveDateTime }</td>
          {this.renderBarcode(this.data.observations[i]._id)}
        </tr>
      );
    }

    return(
      <CardText>
        <Table id="observationsTable" hover >
          <thead>
            <tr>
              <th className='category'>category</th>
              <th className='code'>code</th>
              <th className='valueString'>valueString</th>
              <th className='comparator'>comparator</th>
              <th className='value'>value</th>
              <th className='unit'>unit</th>
              {this.renderSubjectHeader() }
              <th className='status'>status</th>
              {this.renderDeviceHeader() }
              <th className='date'>date</th>
              {this.renderBarcodeHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
      </CardText>
    );
  }
}

ObservationsTable.propTypes = {
  barcodes: PropTypes.bool,
  data: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showSubjects: PropTypes.bool,
  showDevices: PropTypes.bool
};

ReactMixin(ObservationsTable.prototype, ReactMeteorData);
export default ObservationsTable; 