

import ObservationsPage from './client/ObservationsPage';
import ObservationsTable from './client/ObservationsTable';

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
  ObservationsTable
};



