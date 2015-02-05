angular
	.module('reddit')
	.service('reddit.listings', ['reddit.baseUrl', '$http', function (baseUrl, $http) {

		this.subredditListGet = function (args, callback) {

			$http
				.get(baseUrl + 'subreddits.json')
				.then(function (data) {
					callback(null, data);
				});
			
		}

	}]);