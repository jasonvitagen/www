angular
	.module('reddit')
	.service('reddit.listings', ['reddit.baseUrl', '$http', 'queryStringBuilder', function (baseUrl, $http, queryStringBuilder) {

		this.getSubredditList = function (args, callback) {

			if (!args) {
				callback('No args');
			}
			if (!args.queryString) {
				args.queryString = '';
			}

			$http
				.get(baseUrl + 'subreddits.json?' + args.queryString)
				.then(function (data) {
					callback(null, data);
				});
			
		}

		this.getFrontPagePosts = function (args, callback) {

			if (!args) {
				return callback('No args');
			}
			if (!args.type) {
				return callback('No "type" arg');
			}
			if (!args.queryString) {
				args.queryString = '';
			}

			$http
				.get(baseUrl + args.type + '.json?' + args.queryString)
				.then(function (data) {
					console.log(data);
					callback(null, data);
				});

		}

		this.getSubredditPosts = function (args, callback) {

			if (!args) {
				return callback('No args');
			}
			if (!args.subreddit) {
				return callback('No "subreddit" arg');
			}
			if (!args.type) {
				return callback('No "type" arg');
			}
			if (!args.queryString) {
				args.queryString = '';
			}

			$http
				.get(baseUrl + 'r/' + args.subreddit + '/' + args.type + '.json?' + args.queryString)
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