/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.component('brAgreement', {
    controller: Ctrl,
    bindings: {
      agreed: '=ngModel',
      group: '@brAgreementGroup',
      showHeader: '<?brShowHeader'
    },
    templateUrl:
      requirejs.toUrl('bedrock-angular-agreement/agreement-component.html')
  });
}

/* @ngInject */
function Ctrl(brAgreementService) {
  var self = this;
  self.agreementHeader = brAgreementService.groups[self.group].header;
  self.agreements = angular.copy(
    brAgreementService.groups[self.group].agreements);
  self.displayOrder = brAgreementService.groups[self.group].displayOrder;
  self.selectedAgreement = null;
  self.showHeader = self.showHeader === false ? false : true;

  self.$onInit = function() {
    self.agreed = allAgreed();
  };

  self.onAgree = function() {
    self.agreed = allAgreed();
  };

  function allAgreed() {
    var agreed = true;
    for(var i = 0; i < self.displayOrder.length; i++) {
      if(!self.agreements[self.displayOrder[i]].agreed) {
        agreed = false;
        break;
      }
    }
    return agreed;
  }
}

return register;

});
