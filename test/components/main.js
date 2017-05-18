/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  'lodash',
  './test-harness-component'
], function(angular, _) {

'use strict';

var module = angular.module('bedrock.agreement-test', [
  'bedrock.agreement', 'bedrock.authn', 'bedrock.authn-password',
  'bedrock.resolver', 'bedrock.session'
]);

// skipping first 2 arguments
Array.prototype.slice.call(arguments, 2).forEach(function(register) {
  register(module);
});

/* @ngInject */
module.config(function($routeProvider, routeResolverProvider) {

  routeResolverProvider.add('bedrock.test', 'session', resolve);
  var agreementRedirect = null;
  var agreementUrls = {
    'bedrock.routea': '/agreementa',
    'bedrock.routeb': '/agreementb'
  };
  /* @ngInject */
  function resolve($location, $route, brAgreementService) {
    var session = $route.current.locals.session;

    var requiredAgreements = [];
    if($route.current.agreement) {
      var agreementUrl = agreementUrls[$route.current.agreement];
      var requiredAgreements =
        brAgreementService.getAgreements($route.current.agreement);
    }
    if(session && session.identity) {
      // see if identity has signed required agreements
      var hasRequiredAgreements = _.difference(
          requiredAgreements, session.identity.agreements).length === 0;
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
    .when('/agreementa', {
      title: 'Agreements A',
      template:
       '<br-agreement-view br-agreement-group="bedrock.routea" ' +
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
              var redirect = agreementRedirect;
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
      template:
       '<br-agreement-view br-agreement-group="bedrock.routeb" ' +
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
              var redirect = agreementRedirect;
              agreementRedirect = null;
              return $location.url(redirect);
            }
            $location.url('/someroute');
          };
        }
      }
    });
});

/* @ngInject */
module.run(function(brAgreementService) {
  brAgreementService.registerGroup('bedrock.routea');
  brAgreementService.groups['bedrock.routea'].displayOrder = ['testTos'];
  brAgreementService.register(
    'bedrock.routea', 'testTos', {
      title: 'Terms of Service',
      templateUrl: requirejs.toUrl(
        'bedrock-angular-agreement-test/agreements/tos-a.html')
    });
  brAgreementService.registerGroup('bedrock.routeb');
  brAgreementService.groups['bedrock.routeb'].displayOrder = [
    'testTos-b-1', 'testTos-b-2'
  ];
  brAgreementService.register(
    'bedrock.routeb', 'testTos-b-1', {
      title: 'Terms of Service B-1',
      templateUrl: requirejs.toUrl(
        'bedrock-angular-agreement-test/agreements/tos-b-1.html')
    });
  brAgreementService.register(
    'bedrock.routeb', 'testTos-b-2', {
      title: 'Terms of Service B-2',
      templateUrl: requirejs.toUrl(
        'bedrock-angular-agreement-test/agreements/tos-b-2.html')
    });
});

});
