/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import TestHarnessComponent from './test-harness-component.js';

const module = angular.module('bedrock.agreement-test', [
  'bedrock.agreement', 'bedrock.authn', 'bedrock.authn-password',
  'bedrock.resolver', 'bedrock.session', 'ngMaterial', 'ngMessages',
  'bedrock.form'
]);

bedrock.setRootModule(module);

// skipping first 2 arguments
module.component('brTestHarness', TestHarnessComponent);

/* @ngInject */
module.config(function($routeProvider, routeResolverProvider) {

  routeResolverProvider.add('bedrock.test', 'session', resolve);
  let agreementRedirect = null;
  const agreementUrls = {
    'bedrock.routea': '/agreementa',
    'bedrock.routeb': '/agreementb',
    'bedrock.routec': '/agreementc'
  };
  /* @ngInject */
  function resolve($location, $route, brAgreementService) {
    const session = $route.current.locals.session;
    let requiredAgreements = [];
    let agreementUrl;
    if($route.current.agreement) {
      agreementUrl = agreementUrls[$route.current.agreement];
      requiredAgreements =
        brAgreementService.getAgreements($route.current.agreement);
    }
    if(session && session.identity) {
      // see if identity has signed required agreements
      const hasRequiredAgreements = requiredAgreements.filter(
        a => !session.identity.agreements.includes(a)).length === 0;

      if(!hasRequiredAgreements) {
        if($location.url() === agreementUrl) {
          // already on agreement page, nothing to do
          return;
        }
        // go to agreements page
        agreementRedirect = $location.url();
        $location.url(agreementUrl);
        throw new Error('Service Agreement required.');
      }
    }
  }

  $routeProvider
    .when('/', {
      title: 'Test Harness',
      template: '<br-test-harness></br-test-harness>'
    })
    .when('/didnotagree', {
      title: 'Did Not Agree',
      template: '<h3>Did Not Agree</h3>'
    })
    .when('/routea', {
      title: 'Route A',
      session: 'required',
      agreement: 'bedrock.routea',
      template: '<h3>Route A</h3>'
    })
    .when('/routeb', {
      title: 'Route B',
      session: 'required',
      agreement: 'bedrock.routeb',
      template: '<h3>Route B</h3>'
    })
    .when('/routec', {
      title: 'Route C',
      session: 'required',
      agreement: 'bedrock.routec',
      template: '<h3>Route C</h3>'
    })
    .when('/agreementa', {
      title: 'Agreements A',
      template: '<br-agreement-view br-agreement-group="bedrock.routea" ' +
        'br-on-agree="$resolve.relocate()" br-on-cancel="$resolve.cancel()">' +
        '</br-agreement-view>',
      resolve: {
        cancel: function($location, $route, brSessionService) {
          return function() {
            return brSessionService.logout().then(function() {
              $location.url('/didnotagree');
              $route.reload();
            });
          };
        },
        relocate: function($location) {
          return function() {
            if(agreementRedirect) {
              const redirect = agreementRedirect;
              agreementRedirect = null;
              return $location.url(redirect);
            }
            $location.url('/someroute');
          };
        }
      }
    })
    .when('/agreementb', {
      title: 'Agreements B',
      template: '<br-agreement-view br-agreement-group="bedrock.routeb" ' +
        'br-on-agree="$resolve.relocate()" br-on-cancel="$resolve.cancel()">' +
        '</br-agreement-view>',
      resolve: {
        cancel: function($location, $route, brSessionService) {
          return function() {
            return brSessionService.logout().then(function() {
              $location.url('/didnotagree');
              $route.reload();
            });
          };
        },
        relocate: function($location) {
          return function() {
            if(agreementRedirect) {
              const redirect = agreementRedirect;
              agreementRedirect = null;
              return $location.url(redirect);
            }
            $location.url('/someroute');
          };
        }
      }
    })
    .when('/agreementc', {
      template: `<br-agreement
        ng-model="$ctrl.agreed"
        br-agreement-group="bedrock.routec">
      </br-agreement>`
    });
});

/* @ngInject */
module.run(function(brAgreementService) {
  brAgreementService.registerGroup('bedrock.routea');
  brAgreementService.groups['bedrock.routea'].displayOrder = ['testTos'];
  brAgreementService.register(
    'bedrock.routea', 'testTos', {
      title: 'Terms of Service',
      templateUrl: 'bedrock-angular-agreement-test/agreements/tos-a.html'
    });
  brAgreementService.registerGroup('bedrock.routeb');
  brAgreementService.groups['bedrock.routeb'].displayOrder = [
    'testTos-b-1', 'testTos-b-2'
  ];
  brAgreementService.register(
    'bedrock.routeb', 'testTos-b-1', {
      title: 'Terms of Service B-1',
      templateUrl: 'bedrock-angular-agreement-test/agreements/tos-b-1.html'
    });
  brAgreementService.register(
    'bedrock.routeb', 'testTos-b-2', {
      title: 'Terms of Service B-2',
      templateUrl: 'bedrock-angular-agreement-test/agreements/tos-b-2.html'
    });

  brAgreementService.registerGroup('bedrock.routec');
  brAgreementService.groups['bedrock.routec'].displayOrder = [
    'testTos-c-1', 'testTos-c-2'
  ];
  brAgreementService.register(
    'bedrock.routec', 'testTos-c-1', {
      title: 'Terms of Service C-1',
      templateUrl: 'bedrock-angular-agreement-test/agreements/tos-c-1.html'
    });
  brAgreementService.register(
    'bedrock.routec', 'testTos-c-2', {
      title: 'Terms of Service C-2',
      templateUrl: 'bedrock-angular-agreement-test/agreements/tos-c-2.html'
    });
});
