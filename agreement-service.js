/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory($http, config) {
  var service = {};
  service.groups = {};

  service.accept = function(agreements) {
    var agreementUrls = agreements.map(function(a) {
      if(a.indexOf(':') === -1) {
        return config.data.baseUri + a;
      }
      return a;
    });
    // TODO: make url configurable
    var url = config.data.baseUri + '/agreements/accepted';
    return Promise.resolve($http.post(url, {agreement: agreementUrls}))
      .then(function(response) {
        if(response.status !== 201) {
          throw new Error(
            'There was a problem recording the acceptance of ' +
            'the agreement. Please try again later or contact support.');
        }
        return response.data;
      });
  };

  service.register = function(group, agreement, options) {
    if(!(group in service.groups)) {
      throw new Error('Group "' + group + '" is not registered.');
    }
    if(!('title' in options)) {
      throw new Error('Agreement definition must include a "title" property.');
    }
    if(agreement in service.groups[group].agreements) {
      throw new Error('Agreement "' + agreement + '" is already registered.');
    }
    service.groups[group].agreements[agreement] = options;

    // display order explicitly set, return early
    if(service.groups[group].displayOrder !==
      service.groups[group]._displayOrder) {
      return;
    }

    service.groups[group].displayOrder.push(agreement);
    service.groups[group].displayOrder.sort(function(a, b) {
      return service.groups[group].agreements[a].title.localeCompare(
        service.groups[group].agreements[b].title);
    });
  };

  service.registerGroup = function(group) {
    if(group) {
      service.groups[group] = {
        header: 'Service Agreement',
        agreements: {}
      };
      service.groups[group]._displayOrder =
        service.groups[group].displayOrder = [];
    }
  };

  service.getAgreements = function(group) {
    var agreements = service.groups[group].agreements;
    return Object.keys(agreements).reduce(function(a, b) {
      return a.concat(config.data.baseUri + agreements[b].templateUrl);
    }, []);
  };

  return service;
}
