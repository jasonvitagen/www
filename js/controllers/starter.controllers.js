angular.module('starter.controllers', ['reddit', 'helpers', 'scrollings'])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'reddit.listings', 'reddit.states', '$filter', '$ionicLoading', function($scope, $ionicModal, $timeout, redditListings, redditStates, $filter, $ionicLoading) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.listings = [];
  redditStates.subredditsList = [];

  $scope.users = {};
  $scope.getSubredditsList = function () {

    $scope.$broadcast('scrollings.showSubredditsListLoader');
    redditListings.getSubredditList({
      after : redditStates.subredditsListAfter
    }, function (err, response) {
      $scope.$broadcast('scrollings.removeSubredditsListLoader');
      $scope.$broadcast('scrollings.subredditsListClearThreshold');
      console.log(response.data.data.after);
      redditStates.subredditsListAfter = response.data.data.after;
      redditStates.subredditsList = redditStates.subredditsList.concat(response.data.data.children);
      $scope.listings = $scope.listings.concat(response.data.data.children);
    });

  }

  $scope.getSubredditsList();

  $scope.$on('scrollings.subredditsListBottomReached', function () {
    $scope.getSubredditsList();
  });

  $scope.filterSubredditsList = function (keyword) {
    console.log(1, $scope.listings.length);
    var items = redditStates.subredditsList;
    if (angular.isDefined(keyword) && keyword != '') {
      var results = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].data.title.toLowerCase().indexOf(keyword) > -1) {
          results.push(items[i]);
        }
      }
      $scope.listings = results;
    } else {
      console.log(2, $scope.listings.length);
      $scope.listings = items;
    }
  }


  // $scope.$broadcast('scrollings.showSubredditsListLoader');
  // $scope.$on('scrollings.subredditsListBottomReached', function () {
  //   console.log('ada');
  //   $scope.$broadcast('scrollings.showSubredditsListLoader');
  //   setTimeout(function () {
  //     $scope.$broadcast('scrollings.subredditsListClearThreshold');
  //     $scope.$broadcast('scrollings.removeSubredditsListLoader');
  //   }, 3000);
  // });

  // $ionicLoading.show({
  //     template: '<ion-spinner icon="spiral" class="spinner spinner-spiral"></ion-spinner>'
  //   });

}])

.controller('redditPostsCtrl', ['$scope', '$window', 'reddit.listings', function($scope, $window, redditListings) {

  $scope.redditPosts = {};

  // redditListings.getFrontPagePosts({

  //   type : 'hot'

  // }, function (err, response) {
  //   console.log(response.data.children);
  //   $scope.redditPosts.hot = response.data.data.children;

  // });

}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});




// $scope.$broadcast('scroll.infiniteScrollComplete');
