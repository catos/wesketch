(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('identity', identity);

    identity.$inject = ['$auth', '$window'];
    
    function identity($auth, $window) {

        var currentUser;

        if ($auth.isAuthenticated()) {
            currentUser = getTokenUser();
        }

        var service = {
            currentUser: currentUser,
            login: function (user) {
                this.currentUser = user;                
            },
            logout: function () {
                this.currentUser = undefined;
                $auth.logout();
            },
            isAuthenticated: function () {
                return !!this.currentUser;
            },
            isAuthorized: function (role) {
                return !!currentUser &&
                    currentUser.roles.indexOf('admin') > -1;
            }
        };

        return service;
        
        /////////////////////
        
        function getTokenUser() {
            var token = $auth.getToken();

            if (!token) {
                throw new Error('Cannot find token');
            }

            var parts = token.split('.');

            if (parts.length !== 3) {
                throw new Error('JWT must have 3 parts');
            }

            var decoded = urlBase64Decode(parts[1]);
            if (!decoded) {
                throw new Error('Cannot decode the token');
            }
            
            var tokenDecoded = angular.fromJson(decoded);
            if (!tokenDecoded.user) {
                throw new Error('Cannot find user on token');
            }

            return tokenDecoded.user;
        }

        function urlBase64Decode(str) {
            var output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0: { break; }
                case 2: { output += '=='; break; }
                case 3: { output += '='; break; }
                default: {
                    throw 'Illegal base64url string!';
                }
            }
            return $window.decodeURIComponent(escape($window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
        }

    }
})();