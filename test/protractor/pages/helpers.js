/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const protractor = global.protractor;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

api.testField = function(modelName, testString, expectedErrorId) {
  const testElement = element(by.brModel(modelName));
  const altElement = $('br-demo-warning');
  testElement
    .clear()
    .sendKeys(testString);
    // NOTE: Safari does not work with TAB, clicking on another element is the
    // general solution for bluring an input
  altElement.click();
  element(by.brModel(modelName)).getAttribute('name')
    .then(function(elementName) {
      const validationError = element(by.attribute('br-model', modelName))
        .element(by.attribute(
          'ng-show',
          ['$ctrl.regForm', elementName, '$error', expectedErrorId].join('.')));
      browser.wait(EC.visibilityOf(validationError), 3000);
      validationError.isDisplayed().should.eventually.be.true;
    });
};

api.testFieldsMatch =
  function(modelNameA, modelNameB, testStringA, testStringB, expectedErrorId) {
    const altElement = $('br-demo-warning');
    element(by.brModel(modelNameA)).sendKeys(testStringA);
    const testElementB = element(by.brModel(modelNameB));
    testElementB.sendKeys(testStringB);
    altElement.click();
    element(by.brModel(modelNameB)).getAttribute('name')
      .then(function(elementName) {
        element(by.attribute('br-model', modelNameB))
          .element(by.attribute(
            'ng-show',
            ['$ctrl.regForm', elementName, '$error', expectedErrorId]
              .join('.')))
          .isDisplayed().should.eventually.be.true;
      });
  };
