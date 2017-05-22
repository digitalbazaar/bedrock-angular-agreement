/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';

export default {
  controller: Ctrl,
  bindings: {
    agreed: '=ngModel',
    group: '@brAgreementGroup',
    showHeader: '<?brShowHeader'
  },
  templateUrl: 'bedrock-angular-agreement/agreement-component.html'
};

/* @ngInject */
function Ctrl(brAgreementService) {
  var self = this;

  self.$onInit = function() {
    self.agreementHeader = brAgreementService.groups[self.group].header;
    self.agreements = angular.copy(
      brAgreementService.groups[self.group].agreements);
    self.displayOrder = brAgreementService.groups[self.group].displayOrder;
    self.selectedAgreement = null;
    self.showHeader = self.showHeader === false ? false : true;
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
