angular
	.module('scrollings', [])
	.directive('scrollReachesBottom', ['$window', function ($window) {

		var ddo = {};

		ddo.link = function (scope, element, attrs) {

			if (!attrs['physicalList']) { // directive needs a physical list as a base to calculate position
				return console.log('Expecting a physical list');
			}

			var threshold = true; // var used as a threshold

			element.on('scroll', function () {

				if (!threshold) { // rejects if threshold not met
					return;
				}

				if (document.querySelector(attrs['physicalList']).getBoundingClientRect().bottom <= $window.innerHeight) { // whenever scroll reaches bottom

					scope.$broadcast('scrollings.bottomReached');
					threshold = false; // prevents multiple triggers

				}

			});

		}

		return ddo;

	}]);