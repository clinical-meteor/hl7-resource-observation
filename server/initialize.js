// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (process.env.INITIALIZE) {
    console.log('INITIALZING');
    if (DiagnosticReports.find().count() === 0) {
    console.log('No DiagnosticReports found.  Creating some...');



    }
  }
});
