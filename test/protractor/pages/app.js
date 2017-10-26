/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const api = {};
module.exports = api;

api.login = function(identity) {
  element(by.buttonText('Sign In')).click();
  const c = $('br-authn-password');
  c.element(by.brModel('$ctrl.sysIdentifier'))
    .sendKeys(`${identity.sysIdentifier}`);
  c.element(by.brModel('$ctrl.password')).sendKeys(identity.password);
  c.element(by.buttonText('Sign In')).click();
};

api.createIdentity = function(identity) {
  element(by.brModel('$ctrl.sysSlug'))
    .clear()
    .sendKeys(identity.sysIdentifier);
  element(by.brModel('$ctrl.sysPassword'))
    .clear()
    .sendKeys(identity.password);
  element(by.buttonText('Create Identity')).click();
};
