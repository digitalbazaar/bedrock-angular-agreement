/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.service('brAgreementService', factory);
}

/* @ngInject */
function factory() {
  var service = {};
  service.groups = {};

  service.register = function(group, agreement, options) {
    if(!(group in service.groups)) {
      throw new Error('Group "' + group + '" is not registered.');
    }
    if(!('title' in options)) {
      throw new Error('Agreement definition must include a "title" property.');
    }
    if(agreement in service.groups[group]) {
      throw new Error('Agreement "' + agreement + '" is already registered.');
    }
    service.groups[group][agreement] = options;

    // display order explicitly set, return early
    if(service.groups[group].displayOrder !==
      service.groups[group]._displayOrder) {
      return;
    }

    service.groups[group].displayOrder.push(agreement);
    service.groups[group].displayOrder.sort(function(a, b) {
      return service.groups[group][a].title.localeCompare(
        service.groups[group][b].title);
    });
  };

  service.registerGroup = function(group) {
    if(group) {
      service.groups[group] = {
        header: 'Service Agreement'
      };
      service.groups[group]._displayOrder =
        service.groups[group].displayOrder = [];
    }
  };

  return service;
}

return register;

});
