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
      $scope.listings = items;
    }
  }

  $scope.selectSubreddit = function (args) {
    $scope.$broadcast('subredditSelected', { subreddit : args.subreddit });
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

.controller('redditPostsCtrl', ['$scope', '$window', 'reddit.listings', 'reddit.states', function($scope, $window, redditListings, redditStates) {

  $scope.redditPosts = {};
  redditStates.redditsPostsAfter = {};
  redditStates.currentSubreddit = 'frontpage';
  redditStates.currentType = 'hot';

  $scope.getFrontPagePosts = function (type, from) {

    redditStates.currentType = type;
    $scope.$broadcast('scrollings.showRedditPostsLoader');

    redditListings.getFrontPagePosts({

      type : type, 
      after : from == 'bottomReached' ? redditStates.redditsPostsAfter[type] : ''

    }, function (err, response) {

      $scope.$broadcast('scrollings.removeRedditPostsLoader');
      $scope.$broadcast('scrollings.redditPostsClearThreshold');
      redditStates.redditsPostsAfter[type] = response.data.data.after;
      $scope.redditPosts[type] = angular.isDefined($scope.redditPosts[type]) && $scope.redditPosts[type].concat(response.data.data.children) || response.data.data.children;

    });
    
  }

  $scope.getSubredditPosts = function (subreddit, type, from) {

    if (from == 'userSelect') {
      for (key in $scope.redditPosts) {
        $scope.redditPosts[key] = [];
      }
    }
    console.log(subreddit, type, from);
    redditStates.currentSubreddit = subreddit;
    redditStates.currentType = type;
    $scope.$broadcast('scrollings.showRedditPostsLoader');

    redditListings.getSubredditPosts({

      subreddit : subreddit,
      type : type, 
      after : from == 'bottomReached' ? redditStates.redditsPostsAfter[type] : ''

    }, function (err, response) {

      $scope.$broadcast('scrollings.removeRedditPostsLoader');
      $scope.$broadcast('scrollings.redditPostsClearThreshold');
      redditStates.redditsPostsAfter[type] = response.data.data.after;
      $scope.redditPosts[type] = angular.isDefined($scope.redditPosts[type]) && $scope.redditPosts[type].concat(response.data.data.children) || response.data.data.children;

    });

  }

  $scope.$on('scrollings.redditPostsBottomReached', function () {
    
    switch (redditStates.currentSubreddit) {

      case 'frontpage' :
        $scope.getFrontPagePosts(redditStates.currentType, 'bottomReached');
        break;
      default :
        $scope.getSubredditPosts(redditStates.currentSubreddit, redditStates.currentType, 'bottomReached');

    }

  });

  
  $scope.getFrontPagePosts('hot');

  $scope.getPosts = function (args) {

    switch (redditStates.currentSubreddit) {

      case 'frontpage' :
        $scope.getFrontPagePosts(args.type, 'userSelect');
        break;
      default :
        $scope.getSubredditPosts(redditStates.currentSubreddit, args.type, 'tabChanged');
        break;
    }

  }


  $scope.$on('subredditSelected', function (event, args) {
    console.log(args);
    $scope.getSubredditPosts(args.subreddit, redditStates.currentType, 'userSelect');
  });

  $scope.openLink = function (item) {
    window.open(item.data.url, '_blank');
  }


}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});




// $scope.$broadcast('scroll.infiniteScrollComplete');
