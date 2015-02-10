angular
	.module('reddit')
	.service('reddit.listings', ['reddit.baseUrl', '$http', function (baseUrl, $http) {

		this.getSubredditList = function (args, callback) {

			$http
				.get(baseUrl + 'subreddits.json')
				.then(function (data) {
					callback(null, data);
				});
			
		}

		this.getFrontPagePosts = function (args, callback) {

			$http
				.get(baseUrl + args.type + '.json')
				.then(function (data) {
					console.log(data);
					callback(null, data);
				});

		}

		this.currentSubreddit = null;

		this.currentSubredditPosts = {

		};

	}]);