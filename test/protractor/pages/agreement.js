/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const api = {};
module.exports = api;

api.COMPONENT_TAG = 'br-agreement';

api.checkFields = function() {
  const c = api.component();
  const elements = [];
  elements.push(element(by.buttonText('Confirm')));
  elements.push(c.element(by.linkText('Terms of Service')));
  for(const i in elements) {
    elements[i].isPresent().should.eventually.be.true;
  }
};

api.confirmButton = function() {
  return element(by.buttonText('Confirm'));
};

api.component = function() {
  return $(api.COMPONENT_TAG);
};
