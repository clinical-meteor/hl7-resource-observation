

import ObservationsPage from './client/ObservationsPage';
import ObservationsTable from './client/ObservationsTable';
import { Observation, Observations, ObservationSchema } from './lib/Observations';

var DynamicRoutes = [{
  'name': 'ObservationsPageRoute',
  'path': '/observations',
  'component': ObservationsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Observations',
  'to': '/observations',
  'href': '/observations'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  ObservationsPage,
  ObservationsTable,

  Observation,
  Observations,
  ObservationSchema
};


