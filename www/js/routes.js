angular.module('app')

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('menu.home', {
        url: '/home',
        views: {
          'side-menu': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm'
          }
        }
      })

      .state('menu.settings', {
        url: '/settings',
        views: {
          'side-menu': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl',
            controllerAs: 'vm'
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
