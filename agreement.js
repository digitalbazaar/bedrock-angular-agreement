/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import AgreementComponent from './agreement-component.js';
import AgreementService from './agreement-service.js';
import AgreementViewComponent from './agreement-view-component.js';

var module = angular.module('bedrock.agreement', ['bedrock.alert']);

module.component('brAgreementComponent', AgreementComponent);
module.service('brAgreementService', AgreementService);
module.component('brAgreementViewComponent', AgreementViewComponent);
