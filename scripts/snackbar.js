(function () {

	var ANIMATION_SPEED = 200;

	/* ngInject */
	function suaveSnackbarService($templateCache, $compile, $rootScope, $timeout) {
		if (!document.getElementById('su-snackbars')) {
			document.getElementsByTagName('BODY')[0].innerHTML += '<div id="su-snackbars"></div>';
		}

		var $snackbarsArea = document.getElementById('su-snackbars'),
			snackbarIndex = 0;

		function push(text, config) {
			var templateInstance = angular.copy($templateCache.get('snackbar.tmpl')),
				compileLink = $compile(templateInstance),
				$scope = $rootScope.$new(true),
				promise;

			if (!config) {
				config = {};
			}

			if (!config.color) {
				config.color = 'default';
			}

			$scope.id = 'su-snackbar-' + snackbarIndex;
			$scope.text = text;
			$scope.config = config;

			var item = compileLink($scope);
			angular.element($snackbarsArea).append(item);

			item
				.on('mouseover', function () {
					$timeout.cancel(promise);
				})
				.on('mouseout', function () {
					initItemRemoval();
				});

			initItemRemoval();

			function initItemRemoval() {
				promise = $timeout(function () {
					angular.element(item).addClass('animated fadeOutUp slideUp');

					$timeout(function () {
						angular.element(item).remove();
					}, ANIMATION_SPEED);
				}, config.timeout || 5000);
			}

			$timeout(function () {
				angular.element(item).removeClass('animated fadeInDown');
			}, ANIMATION_SPEED);

			snackbarIndex++;

			return $scope.id;
		}

		return {
			push: push
		}
	}

	angular.module('su-snackbar', [])
		.service('suSnackbar', suaveSnackbarService);

})();