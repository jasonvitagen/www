angular.module('starter.controllers', ['reddit', 'helpers', 'scrollings'])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'reddit.listings', 'reddit.states', '$filter', '$ionicLoading', 'queryStringBuilder', function($scope, $ionicModal, $timeout, redditListings, redditStates, $filter, $ionicLoading, queryStringBuilder) {
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

  // starting states
  $scope.listings = [];
  redditStates.subredditsList = [];

  $scope.getSubredditsList = function () {

    $scope.$broadcast('scrollings.showSubredditsListLoader');

    redditListings.getSubredditList({
      queryString : queryStringBuilder({'after' : redditStates.subredditsListAfter})
    }, function (err, response) {

      if (err) {
        return console.log(err);
      }

      $scope.$broadcast('scrollings.removeSubredditsListLoader');
      $scope.$broadcast('scrollings.subredditsListClearThreshold');

      redditStates.subredditsListAfter = response.data.data.after;
      redditStates.subredditsList = redditStates.subredditsList.concat(response.data.data.children);
      $scope.listings = $scope.listings.concat(response.data.data.children);

    });

  }

  $scope.getSubredditsList(); // to be run on load

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
    $scope.$broadcast('subredditSelected', {
      subreddit : args.subreddit
    });
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

.controller('redditPostsCtrl', ['$scope', '$window', 'reddit.listings', 'reddit.states', 'queryStringBuilder', function($scope, $window, redditListings, redditStates, queryStringBuilder) {

  // starting states
  $scope.redditPosts = {};
  redditStates.redditsPostsAfter = {};
  redditStates.currentSubreddit = 'frontpage';
  redditStates.currentType = 'hot';

  $scope.getFrontPagePosts = function (args) {

    var after = '';

    if (!args) {
      return console.log('No args');
    }
    if (!args.type) {
      return console.log('No type arg');
    }
    if (args.from) {
      
      if (args.from == 'bottomReached') {
        after = redditStates.redditsPostsAfter[args.type];
      }

    }

    redditStates.currentType = args.type;
    $scope.$broadcast('scrollings.showRedditPostsLoader');

    redditListings.getFrontPagePosts({

      type : args.type,
      queryString : queryStringBuilder({
        after : after
      })

    }, function (err, response) {

      if (err) {
        return console.log(err);
      }

      $scope.$broadcast('scrollings.removeRedditPostsLoader');
      $scope.$broadcast('scrollings.redditPostsClearThreshold');
      redditStates.redditsPostsAfter[args.type] = response.data.data.after;
      $scope.redditPosts[args.type] = angular.isDefined($scope.redditPosts[args.type]) && $scope.redditPosts[args.type].concat(response.data.data.children) || response.data.data.children;

    });
    
  }

  $scope.getSubredditPosts = function (args) {

    var after = '';

    if (!args) {
      return console.log('No args');
    }
    if (!args.subreddit) {
      return console.log('No "subreddit" arg');
    }
    if (!args.type) {
      return console.log('No "type" arg');
    }
    if (args.from) {

      if (args.from == 'bottomReached') {
        after = redditStates.redditsPostsAfter[args.type];
      }

      if (args.from == 'userSelect') { // new subreddit selected, reset all types of existing listings
        for (key in $scope.redditPosts) {
          $scope.redditPosts[key] = [];
        }
      }

    }

    redditStates.currentSubreddit = args.subreddit;
    redditStates.currentType = args.type;
    $scope.$broadcast('scrollings.showRedditPostsLoader');

    redditListings.getSubredditPosts({

      subreddit : args.subreddit,
      type : args.type,
      queryString : queryStringBuilder({ after : after })

    }, function (err, response) {
      console.log(args);
      $scope.$broadcast('scrollings.removeRedditPostsLoader');
      $scope.$broadcast('scrollings.redditPostsClearThreshold');
      redditStates.redditsPostsAfter[args.type] = response.data.data.after;
      $scope.redditPosts[args.type] = angular.isDefined($scope.redditPosts[args.type]) && $scope.redditPosts[args.type].concat(response.data.data.children) || response.data.data.children;

    });

  }

  $scope.$on('scrollings.redditPostsBottomReached', function () {
    
    switch (redditStates.currentSubreddit) {

      case 'frontpage' :
        $scope.getFrontPagePosts({
          type : redditStates.currentType,
          from : 'bottomReached'
        });
        break;
      default :
        $scope.getSubredditPosts({
          subreddit : redditStates.currentSubreddit,
          type : redditStates.currentType,
          from : 'bottomReached'
        });

    }

  });

  
  $scope.getFrontPagePosts({
    type : 'hot',
    from : 'onLoad'
  });

  $scope.getPosts = function (args) {

    if (!args) {
      return console.log('No args');
    }
    if (!args.type) {
      return console.log('No "type" arg');
    }

    switch (redditStates.currentSubreddit) {

      case 'frontpage' :
        $scope.getFrontPagePosts({
          type : args.type,
          from : 'userSelect'
        });
        break;
      default :
        $scope.getSubredditPosts({
          subreddit : redditStates.currentSubreddit,
          type : args.type,
          from : 'tabChanged'
        });
        break;
    }

  }


  $scope.$on('subredditSelected', function (event, args) {

    if (!args) {
      return console.log('No args');
    }
    if (!args.subreddit) {
      return console.log('No "subreddit" arg');
    }

    $scope.getSubredditPosts({
      subreddit : args.subreddit,
      type : redditStates.currentType,
      from : 'userSelect'
    });

  });


  $scope.openLink = function (item) {
    window.open(item.data.url, '_blank');
  }


}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});




// $scope.$broadcast('scroll.infiniteScrollComplete');
