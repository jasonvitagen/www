angular
	.module('helpers', [])
	.factory('queryStringBuilder', [function () {

		var queryStringBuilder = function (args) { // accepts an object, returns query string
				if (!args) {
					return '';
				}
				var queryString = [];
				for (var key in args) {
					if (args.hasOwnProperty(key)) {
						queryString.push(key);
						queryString.push('=');
						queryString.push(args[key]);
						queryString.push('&');
					}
				}
				return queryString.join('').slice(0, -1);
			}

		return queryStringBuilder;	

	}])
	.directive('onInfiniteScrolling', ['$window', function ($window) {

	  var ddo = {};

	  ddo.link = function (scope, element, attrs) {

	    var loadingMsg = true;
	    element.on('scroll', function () {

	      if (document.querySelector(attrs['physicalList']).getBoundingClientRect().bottom <= $window.innerHeight) {
	        if (loadingMsg) {
	          setTimeout(function () {
	            document.querySelector(attrs['forceScrollBottom']).scrollTop += 80;
	          }, 0);
	          scope.$eval(attrs['onInfiniteScrolling']);
	          element.find(attrs['messageAppend']).append(angular.element('<img src="./img/hourglass.svg" >').wrap('<p>').css({'margin' : '0 auto', 'display' : 'block'}));
	          loadingMsg = false;
	        }
	      }

	    });

	    scope.$on('scroll.infiniteScrollComplete', function () {
	      element.find('img').remove();
	      loadingMsg = true;
	    });

	    scope.$on('$destroy', function () {
	      element.off();
	    });


	  }

	  return ddo;

	}]);