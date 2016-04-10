describe('clinical:hl7-resources-observations', function () {
  var server = meteor();
  var client = browser(server);

  it('Observations should exist on the client', function () {
    return client.execute(function () {
      expect(Observations).to.exist;
    });
  });

  it('Observations should exist on the server', function () {
    return server.execute(function () {
      expect(Observations).to.exist;
    });
  });

});
