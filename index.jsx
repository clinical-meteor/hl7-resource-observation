

import ObservationsPage from './client/ObservationsPage';
import ObservationsTable from './client/ObservationsTable';
import HealthLog from './client/HealthLog';

var DynamicRoutes = [{
  'name': 'ObservationsPageRoute',
  'path': '/observations',
  'component': ObservationsPage,
  'requireAuth': true
}, {
  'name': 'HealthLog',
  'path': '/vitals-tracking',
  'component': HealthLog,
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

  HealthLog
};



