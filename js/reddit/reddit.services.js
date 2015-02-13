angular
	.module('reddit')
	.service('reddit.listings', ['reddit.baseUrl', '$http', 'queryStringBuilder', function (baseUrl, $http, queryStringBuilder) {

		this.getSubredditList = function (args, callback) {

			$http
				.get(baseUrl + 'subreddits.json?' + queryStringBuilder(args))
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

	}])
	.service('reddit.states', [function () {
		return {};
	}]);