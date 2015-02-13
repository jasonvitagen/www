angular
	.module('scrollings', [])
	.directive('scrollReachesBottom', ['$window', '$rootScope', function ($window, $rootScope) {

		var ddo = {};

		ddo.link = function (scope, element, attrs) {

			if (!attrs['physicalList']) { // directive needs a physical list as a base to calculate position
				return console.log('Expecting a physical list');
			}
			if (!attrs['bottomReachedEventName']) { // directive's need, self explanatory
				return console.log('Expecting a name for bottomReached event');
			}
			if (!attrs['clearThresholdEventName']) { // directive's need, self explanatory
				return console.log('Expecting a name for clearThreshold event');
			}


			var threshold = true; // var used as a threshold

			element.on('scroll', function () {

				if (!threshold) { // rejects if threshold not met
					return;
				}

				if (document.querySelector(attrs['physicalList']).getBoundingClientRect().bottom <= $window.innerHeight) { // whenever scroll reaches bottom

					$rootScope.$broadcast(attrs['bottomReachedEventName'], {});
					threshold = false; // prevents multiple triggers

				}

			});

			scope.$on(attrs['clearThresholdEventName'], function () { // event handler, self explanatory
				threshold = true;
			});

			scope.$on('$destroy', function () { // prevents memory leak
				element.off();
			});

		}

		return ddo;

	}])
	.directive('waitLoader', [function () {

		var ddo = {};

		ddo.link = function (scope, element, attrs) {

			// some dependencies
			if (!attrs['appendTo']) {
				return console.log('Expecting a DOM selector to append to');
			}
			if (!attrs['appendEventName']) {
				return console.log('Expecting a name for append loader event');
			}
			if (!attrs['removeEventName']) {
				return console.log('Expecting a name for remove loader event');
			}
			if (!attrs['loaderImagePath']) {
				attrs['loaderImagePath'] = './img/hourglass.svg';
			}
			if (!attrs['wrapperElement']) {
				attrs['wrapperElement'] = '<div></div>';
			}
			if (!attrs['loaderCss']) {
				attrs['loaderCss'] = {};
			}

			var waitLoaderElement = angular
										.element('<img src="' + attrs['loaderImagePath'] + '">')
										.wrap(attrs['wrapperElement'])
										.css(angular.fromJson(attrs['loaderCss']));


			scope.$on(attrs['appendEventName'], function () {
				angular
					.element(document.querySelector(attrs['appendTo']))
					.append(waitLoaderElement);

				if (attrs['forceScrollBottom']) { // scroll to loader
					document.querySelector(attrs['forceScrollBottom']).scrollTop += 80;
				}
			});

			scope.$on(attrs['removeEventName'], function () {
				waitLoaderElement.remove();
			});

		}

		return ddo;

	}]);