angular
	.module('reddit')
	.directive('recursiveComments', [function () {

		var ddo = {};

		ddo.scope = {
			comments : '=recursiveComments'
		};

		ddo.link = function (scope, element, attrs) {

			var frag = document.createDocumentFragment();

			var recursiveLoop = function (childrenList, level) {

				
				var p = document.createElement('p');
				
					
				if (childrenList.length == 0) {
					return p;
				}

				var item = childrenList.shift();

				p.textContent = level + ' ' + item.data.body;
				p.className = 'level' + level;

				if (item.data.replies) {
					p.appendChild(recursiveLoop(item.data.replies.data.children, ++level));
				}

				if (childrenList.length !== 0) {
					var div = document.createElement('div');
					var siblingP = recursiveLoop(childrenList, level);

					div.appendChild(p);
					p.parentNode.insertBefore(siblingP, p.nextSibling);
					p = div;
				}

				return p;
				
			}

			scope.$watch(attrs['recursiveComments'], function (newVal) {
				console.log(scope.comments);
				setTimeout(function () {
					var frag = recursiveLoop(scope.comments.data.children, 1);
					element.append(frag);
				}, 0);

			});

			

		}

		return ddo;

	}]);