  /*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const uuid = require('uuid').v4;
const protractor = global.protractor;
const EC = protractor.ExpectedConditions;

const app = bedrock.pages['bedrock-angular-agreement'].app;
const agreement = bedrock.pages['bedrock-angular-agreement'].agreement;

describe('bedrock-angular-agreement', () => {
  describe('agreements', () => {
    beforeEach(function() {
      const testIdentity = {
        sysIdentifier: uuid().substr(0, 23),
        password: 'password'
      };
      bedrock.get('/');
      app.createIdentity(testIdentity);
      app.login(testIdentity);
    });
    it('displays agreements that need to be accepted', () => {
      element(by.buttonText('Route A')).click();
      bedrock.waitForUrl('/agreementa');
      browser.wait(EC.visibilityOf(agreement.component()), 3000);
      agreement.component().isDisplayed().should.eventually.be.true;
      agreement.checkFields();
      element(by.buttonText('Confirm')).isEnabled().should.eventually.be.false;
      element.all(by.repeater('agreement in $ctrl.displayOrder'))
        .then(agreements => agreements.forEach(a => {
          a.$('.md-container').click();
        }));
      agreement.confirmButton().isEnabled().should.eventually.be.true;
      agreement.confirmButton().click();
      $('h3').getText().should.eventually.equal('Route A');
    });
    it('presents one agreement', () => {
      element(by.buttonText('Route A')).click();
      bedrock.waitForUrl('/agreementa');
      browser.wait(EC.visibilityOf(agreement.component()), 3000);
      element(by.linkText('Terms of Service')).click();
      const modalTitle = $('h3.modal-title');
      browser.wait(EC.visibilityOf(modalTitle), 3000);
      modalTitle.getText().should.eventually.equal('Service Agreement');
      const a = element.all(by.tagName('br-modal-body')).last();
      a.$('h3').getText().should.eventually.equal('Agreement A goes here.');
      element(by.buttonText('Close')).click();
    }); // end presets one agreement
    it('presents two agreements', () => {
      element(by.buttonText('Route B')).click();
      bedrock.waitForUrl('/agreementb');
      browser.wait(EC.visibilityOf(agreement.component()), 3000);
      agreement.confirmButton().isEnabled().should.eventually.be.false;
      element(by.linkText('Terms of Service B-1')).click();
      let modalTitle = $('h3.modal-title');
      browser.wait(EC.visibilityOf(modalTitle), 3000);
      modalTitle.getText().should.eventually.equal('Service Agreement');
      let a = element.all(by.tagName('br-modal-body')).last();
      a.$('h3').getText().should.eventually.equal('Agreement B-1 goes here.');
      element(by.buttonText('Close')).click();
      element(by.linkText('Terms of Service B-2')).click();
      modalTitle = $('h3.modal-title');
      browser.wait(EC.visibilityOf(modalTitle), 3000);
      modalTitle.getText().should.eventually.equal('Service Agreement');
      a = element.all(by.tagName('br-modal-body')).last();
      a.$('h3').getText().should.eventually.equal('Agreement B-2 goes here.');
      element(by.buttonText('Close')).click();
      element.all(by.repeater('agreement in $ctrl.displayOrder'))
        .then(agreements => agreements.forEach((a, i, array) => {
          a.$('.md-container').click();
          // confirmButton should not be enabled until all are checked
          if(i < array.length - 1) {
            agreement.confirmButton().isEnabled().should.eventually.be.false;
          }
        }));
      agreement.confirmButton().isEnabled().should.eventually.be.true;
      agreement.confirmButton().click();
      $('h3').getText().should.eventually.equal('Route B');
    }); // end presents two agreements
    it('execute cancel hander if modal is canceled', () => {
      element(by.buttonText('Route A')).click();
      bedrock.waitForUrl('/agreementa');
      browser.wait(EC.visibilityOf(agreement.component()), 3000);
      $('a.stackable-cancel').click();
      bedrock.waitForUrl('/didnotagree');
      $('h3').getText().should.eventually.equal('Did Not Agree');
    });
  });
});
