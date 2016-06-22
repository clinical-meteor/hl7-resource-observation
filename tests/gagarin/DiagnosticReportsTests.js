describe('clinical:hl7-resources-diagnostic-report', function () {
  var server = meteor();
  var client = browser(server);

  it('DiagnosticReport should exist on the client', function () {
    return client.execute(function () {
      expect(DiagnosticReport).to.exist;
    });
  });

  it('DiagnosticReport should exist on the server', function () {
    return server.execute(function () {
      expect(DiagnosticReport).to.exist;
    });
  });

});
