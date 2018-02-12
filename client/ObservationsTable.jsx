import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Table } from 'react-bootstrap';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

export default class ObservationsTable extends React.Component {

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
      data.observations = this.props.data;
    } else {
      data.observations = Observations.find().map(function(observation){
        let result = {
          _id: '',
          category: '',
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

        result._id =  observation._id;
        if (observation.category && observation.category.text) {
          result.category =  observation.category.text;
        }
        if (observation.valueString) {
          result.valueString =  observation.valueString;
        }
        if (observation.valueQuantity && observation.valueQuantity.value) {
          result.observationValue =  observation.valueQuantity.value;
        }
        if (observation.valueQuantity && observation.valueQuantity.unit) {
          result.unit =  observation.valueQuantity.unit;
        }
        if (observation.subject && observation.subject.display) {
          result.subject =  observation.subject.display;
        }
        if (observation.subject && observation.subject.reference) {
          result.subjectId =  observation.subject.reference;
        }
        if (observation.device && observation.device.reference) {
          result.device =  observation.device.reference;
        }
        result.status =  observation.status;

        if (observation.effectiveDateTime) {
          result.effectiveDateTime =  moment(observation.effectiveDateTime).format("YYYY-MM-DD hh:ss a");
        }

        return result;
      });
    }


    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.webkitFilter = "blur(3px)";
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
    Session.set("selectedObservation", id);
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
  
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.observations.length; i++) {
      tableRows.push(
        <tr className="observationRow" style={this.data.style.text} onClick={ this.rowClick.bind(this, this.data.observations[i]._id)} >

          <td className='category'>{this.data.observations[i].category }</td>
          <td className='valueString'>{this.data.observations[i].valueString }</td>
          <td className='value'>{this.data.observations[i].observationValue }</td>
          <td className='unit'>{this.data.observations[i].unit }</td>
          <td className='name'>{this.data.observations[i].subject }</td>
          <td className='subject.reference'>{this.data.observations[i].subjectId }</td>
          <td className='status'>{this.data.observations[i].status }</td>
          <td className='device.display'>{this.data.observations[i].device }</td>
          <td className='date'>{this.data.observations[i].effectiveDateTime }</td>
          {this.renderBarcode(this.data.observations[i]._id)}
        </tr>
      );
    }

    return(
      <CardText>
        <Table id="observationsTable" responses hover >
          <thead>
            <tr>
              <th className='category'>type</th>
              <th className='value'>value</th>
              <th className='quantity'>quantity</th>
              <th className='unit'>unit</th>
              <th className='name'>subject</th>
              <th className='subject.reference'>subject id</th>
              <th className='status'>status</th>
              <th className='device.display'>source</th>
              <th className='date'>date</th>
              {this.renderBarcodeHeader}
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


ReactMixin(ObservationsTable.prototype, ReactMeteorData);
