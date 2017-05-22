/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-agreement-test/test-harness-component.html'
};

/* @ngInject */
function Ctrl($http, $location, brAuthnService) {
  var self = this;
  self.showLogin = false;
  self.testData = {};

  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.onLogin = function(identity) {
    self.testData = identity;
  };

  self.addIdentity = function(userName) {
    return $http.post('/createidentity', createIdentity(userName))
      .then(function(response) {
        self.testData = response.data.identity;
      });
  };

  self.navigate = function(route) {
    $location.url(route);
  };

  function createIdentity(userName) {
    var newIdentity = {
      sysSlug: userName,
      email: userName + '@bedrock.dev',
      sysPassword: 'password',
      sysResourceRole: [{
        sysRole: 'bedrock-test.identity.registered',
        generateResource: 'id'
      }]
    };
    return newIdentity;
  }
}
