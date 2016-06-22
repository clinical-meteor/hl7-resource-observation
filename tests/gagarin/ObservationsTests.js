describe('clinical:hl7-resources-observations', function () {
  var server = meteor();
  var client = browser(server);

  it('Observation should exist on the client', function () {
    return client.execute(function () {
      expect(Observation).to.exist;
    });
  });

  it('Observation should exist on the server', function () {
    return server.execute(function () {
      expect(Observation).to.exist;
    });
  });

});
