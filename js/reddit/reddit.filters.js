angular
	.module('reddit')
	.filter('reddit.subredditsListFilter', [function () {

		return function (items, keyword) {
			if (angular.isDefined(keyword)) {
				var results = [];
				for (var i = 0; i < items.length; i++) {
					if (items[i].data.title.indexOf(keyword) > -1) {
						results.push(items[i]);
					}
				}
				return results;
			} else {
				return items;
			}
		}

	}]);