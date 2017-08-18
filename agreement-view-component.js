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
  const self = this;

  self.$onInit = () => {
    self.visible = {
      agreementModal: true
    };
    self.agreementHeader = brAgreementService.groups[self.group].header;
    self.agreed = false;
  };

  self.confirm = () => {
    brAgreementService.accept(brAgreementService.getAgreements(self.group))
      .then(() => self.onAgree())
      .catch(err => {
        brAlertService.add('error', err, {scope: $scope});
      });
  };

  self.modalClosed = err => {
    if(err === 'canceled') {
      self.onCancel();
    }
  };
}
