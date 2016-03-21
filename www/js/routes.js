angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('menu.home', {
        url: '/home',
        views: {
          'side-menu': {
            templateUrl: 'templates/home.html',
            controller: 'HenryVisionCtrl',
            controllerAs: 'vm'
          }
        }
      })

      .state('menu.settings', {
        url: '/settings',
        views: {
          'side-menu': {
            templateUrl: 'templates/settings.html',
            controller: 'settingsCtrl'
          }
        }
      })

      .state('menu', {
        url: '/side-menu',
        templateUrl: 'templates/menu.html',
        abstract: true
      });

    $urlRouterProvider.otherwise('/side-menu/home');


  });
