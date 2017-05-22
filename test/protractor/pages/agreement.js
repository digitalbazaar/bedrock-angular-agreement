/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var api = {};
module.exports = api;

api.COMPONENT_TAG = 'br-agreement';

api.checkFields = function() {
  var c = api.component();
  var elements = [];
  elements.push(element(by.buttonText('Confirm')));
  elements.push(c.element(by.linkText('Terms of Service')));
  for(var i in elements) {
    elements[i].isPresent().should.eventually.be.true;
  }
};

api.confirmButton = function() {
  return element(by.buttonText('Confirm'));
};

api.component = function() {
  return $(api.COMPONENT_TAG);
};
