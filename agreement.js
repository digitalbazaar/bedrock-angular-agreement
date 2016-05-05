/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './agreement-component',
  './agreement-service'
], function(
  angular) {

'use strict';

var module = angular.module('bedrock.agreement', []);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

});
