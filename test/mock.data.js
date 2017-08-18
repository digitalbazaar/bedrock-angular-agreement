/*
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 */

'use strict';
const bedrock = require('bedrock');
const config = bedrock.config;
const helpers = require('./helpers');

const mock = {};
module.exports = mock;

let userName = '';
mock.identities = {};

userName = 'alpha';
mock.identities[userName] = {};
mock.identities[userName].identity = helpers.createIdentity({
  userName: userName
});
mock.identities[userName].identity.sysResourceRole = [{
  sysRole: 'bedrock-test.identity.registered',
  generateResource: 'id'
}];

Object.keys(mock.identities).forEach(function(key) {
  const i = mock.identities[key];
  config['identity-http'].identities.push(i.identity);
  if(i.keys) {
    Array.prototype.push.apply(config.key.keys, [].concat(i.keys));
  }
});
