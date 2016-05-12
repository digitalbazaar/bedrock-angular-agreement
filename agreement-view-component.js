/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brAgreementView', {
    controller: Ctrl,
    bindings: {
      group: '@brAgreementGroup',
      onAgree: '&brOnAgree'
    },
    templateUrl:
      requirejs.toUrl('bedrock-angular-agreement/agreement-view-component.html')
  });
}

/* @ngInject */
function Ctrl($location, $scope, brAgreementService, brAlertService) {
  var self = this;
  self.visible = {
    agreementModal: true
  };
  self.agreementHeader = brAgreementService.groups[self.group].header;
  self.agreements = brAgreementService.groups[self.group].agreements;
  self.agreed = false;

  self.confirm = function() {
    brAgreementService.accept(brAgreementService.getAgreements(self.group))
      .then(function() {
        self.onAgree();
      })
      .catch(function(err) {
        brAlertService.add('error', err, {scope: $scope});
      })
      .then(function() {
        $scope.$apply();
      });
  };
}

return register;

});
