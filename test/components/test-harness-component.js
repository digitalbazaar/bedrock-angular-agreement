/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-agreement-test/test-harness-component.html'
};

/* @ngInject */
function Ctrl($http, $location, brAuthnService) {
  const self = this;
  self.showLogin = false;
  self.testData = {};

  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.onLogin = identity => {
    self.testData = identity;
  };

  self.addIdentity = userName => {
    return $http.post('/createidentity', createIdentity(userName))
      .then(response => {
        self.testData = response.data.identity;
      });
  };

  self.navigate = route => {
    $location.url(route);
  };

  function createIdentity(userName) {
    const newIdentity = {
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
