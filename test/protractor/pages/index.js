/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */

var pages = global.bedrock.pages || {};

pages['bedrock-angular-agreement'] = {};
pages['bedrock-angular-agreement'].agreement = require('./agreement');
pages['bedrock-angular-agreement'].app = require('./app');
pages['bedrock-angular-agreement'].helpers = require('./helpers');

module.exports = global.bedrock.pages = pages;
