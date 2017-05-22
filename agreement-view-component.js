/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  controller: Ctrl,
  bindings: {
    group: '@brAgreementGroup',
    onAgree: '&brOnAgree',
    onCancel: '&brOnCancel'
  },
  templateUrl: 'bedrock-angular-agreement/agreement-view-component.html'
};

/* @ngInject */
function Ctrl($scope, brAgreementService, brAlertService) {
  var self = this;

  self.$onInit = function() {
    self.visible = {
      agreementModal: true
    };
    self.agreementHeader = brAgreementService.groups[self.group].header;
    self.agreed = false;
  };

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

  self.modalClosed = function(err) {
    if(err === 'canceled') {
      self.onCancel();
    }
  };
}
