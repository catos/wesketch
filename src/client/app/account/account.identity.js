(function () {
	'use strict';

	angular
		.module('app.account')
		.factory('accountIdentity', accountIdentity);

	accountIdentity.$inject = ['$window', 'usersService'];
	function accountIdentity($window, usersService) {
		var currentUser;

		if (!!$window.bootstrappedUserObject) {
			currentUser = new usersService();
			angular.extend(currentUser, $window.bootstrappedUserObject);
		}

		return {
			currentUser: currentUser,
			isAuthenticated: function () {
				return !!this.currentUser;
			},
			isAuthorized: function (role) {
				return !!this.currentUser &&
					this.currentUser.roles.indexOf('admin') > -1;
			}
		}
	}
})();