/*
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const _ = require('lodash');
const bedrock = require('bedrock');
const brIdentity = require('bedrock-identity');
const util = require('util');
require('bedrock-agreement-http');
require('bedrock-authn-password');
require('bedrock-identity-http');
require('bedrock-protractor');
require('bedrock-session-http');
require('bedrock-views');
require('bedrock-webpack');
require('./mock.data');
require('./app.config');

bedrock.events.on('bedrock-express.configure.routes', app => {
  app.post('/createidentity', (req, res) => {
    const identity = {};
    identity['@context'] = bedrock.config.constants.IDENTITY_CONTEXT_V1_URL;
    identity.id = createIdentityId(req.body.sysSlug);
    identity.type = 'Identity';
    identity.sysSlug = req.body.sysSlug;
    identity.sysResourceRole = req.body.sysResourceRole;
    identity.sysPassword = req.body.sysPassword;
    identity.sysStatus = 'active';
    brIdentity.insert(null, identity, (err, result) => {
      res.status(201).json(result);
    });
  });
});

bedrock.events.on('bedrock-session-http.session.get', function(req, session) {
  if(req.isAuthenticated()) {
    _.assign(session.identity, req.user.identity, session.identity);
  }
});

function createIdentityId(name) {
  return util.format('%s%s/%s',
    bedrock.config.server.baseUri,
    bedrock.config['identity-http'].basePath,
    encodeURIComponent(name));
}

require('bedrock-test');
bedrock.start();
