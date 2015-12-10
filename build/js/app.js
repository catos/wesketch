/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [
            'ngResource',
            'satellizer',

            'blocks.alert',
            'blocks.sawkit',
            'blocks.tokenIdentity',
            
            'components.wesketch',

            'ui.router',
            'ui.bootstrap',

            'app.layout',
            'app.home',
            'app.account',

            'app.users',
            'app.chat',
            'app.draw',
            'app.batteries',
        ]);

} ());

(function () {
	'use strict';

	angular
		.module('app.account', []);
		
})();
(function () {
	'use strict';

	angular
		.module('app.batteries', []);
		
})();
(function() {
	'use strict';

	angular.module('app.chat', []);
})();
(function() {
    'use strict';

	angular.module('app.draw', []);
})();
(function () {
	'use strict';

	angular
		.module('app.layout', []);
		
})();
(function () {
	'use strict';

	angular
		.module('app.home', []);
		
})();
(function() {
	'use strict';

	angular.module('app.users', []);
})();
(function() {
	'use strict';

	angular.module('blocks.alert', []);
})();
(function() {
    'use strict';

    angular
        .module('blocks.tokenIdentity', []);
})();

(function() {
	'use strict';

	angular.module('blocks.sawkit', []);
})();
(function() {
    'use strict';

    angular
        .module('components.wesketch', []);
})();

(function() {
    'use strict';

    var appSettings = {
        ApplicationName: 'Cato Skogholt Application',
        ApplicationPrefix: 'CSA',
        ApiUrl: 'http://localhost:7203/',
        SocketUrl: 'http://localhost:7203/'
    };

    angular
        .module('app')
        .constant('appSettings', appSettings)
        .config(config)
        .run(run);

    config.$inject = ['$authProvider', '$urlRouterProvider', 'appSettings'];

    function config($authProvider, $urlRouterProvider, appSettings) {
        $urlRouterProvider.otherwise('/');

        $authProvider.loginUrl = appSettings.ApiUrl + 'login';
        $authProvider.signupUrl = appSettings.ApiUrl + 'register';
        $authProvider.tokenPrefix = appSettings.ApplicationPrefix;
    }

    run.$inject = ['$rootScope', '$state', '$auth', 'alert', 'tokenIdentity'];

    function run($rootScope, $state, $auth, alert, tokenIdentity) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {

                if (toState.restricted) {

                    if (toState.restricted.requiresLogin && !tokenIdentity.isAuthenticated())
                    {
                        $state.transitionTo('layout.account.login');
                        event.preventDefault();
                    }

                    if (toState.restricted.requiresAdmin && !tokenIdentity.isAdmin())
                    {
                        alert.show(
                            'info', 
                            'Restricted area', 
                            'You do not have sufficient permissions to enter this area');
                        $state.go('layout.home');
                        event.preventDefault();
                    }

                }

            });
    }
})();

(function () {
	'use strict';

	angular
		.module('app.account')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.account', {
				abstract: true,
                url: '/account',
				templateUrl: 'app/account/account.html',
            })
			.state('layout.account.login', {
				url: '/login',
				templateUrl: 'app/account/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
			})
			.state('layout.account.logout', {
				url: '/logout',				
                controller: 'LogoutController',
			})
			.state('layout.account.register', {
				url: '/register',
				templateUrl: 'app/account/register.html',
                controller: 'RegisterController',
				controllerAs: 'vm'
			});
	}
}());
(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$auth', '$state', 'alert', 'tokenIdentity'];

    function LoginController($auth, $state, alert, tokenIdentity) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.submit = submit;
        vm.quickSignIn = quickSignIn;

        function submit() {
            $auth
                .login({
                    email: vm.email,
                    password: vm.password
                })
                .then(function (res) {
                    alert.show('info', 'Welcome!', 'Thanks for coming back, ' + res.data.user.email + '!');
                    tokenIdentity.login(res.data.user);
                    $state.go('layout.home');
                })
                .catch(function (err) {
                    alert.show('warning', 'Something went wrong :(', err.message);
                });
        }
        
        function quickSignIn(email, password) {
            vm.email = email;
            vm.password = password;
            
            vm.submit();
        }
    }
})();

(function() {
'use strict';

	angular
		.module('app.account')
		.controller('LogoutController', LogoutController);

	LogoutController.$inject = ['$state', 'alert', 'tokenIdentity'];
	function LogoutController($state, alert, tokenIdentity) {
		alert.show('info', 'Snakkes!', 'Welcome back at later time yes');
		tokenIdentity.logout();
		$state.go('layout.home');
	}
})();

(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$auth', 'alert', 'tokenIdentity'];
    function RegisterController($auth, alert, tokenIdentity) {
        var vm = this;
        vm.name = '';
        vm.email = '';
        vm.password = '';
        vm.submit = submit;

        function submit() {
            $auth
                .signup({
                    name: vm.name,
                    email: vm.email,
                    password: vm.password
                })
                .then(function (res) {
                    alert.show('success', 'Account Created!', 'Welcome, ' + res.data.user.email + '!');
                    $auth.setToken(res);
                    tokenIdentity.login(res.data.user);
                })
                .catch(function (err) {
                    alert.show('warning', 'Something went wrong :(', err.message);
                });
        }
    }
})();

/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesListController', BatteriesListController);

	BatteriesListController.$inject = ['batteriesService'];

	function BatteriesListController(batteriesService) {
		var vm = this;
		vm.batteries = [];
		
		activate();
		
		function activate() {
			batteriesService.query(
				{},
				function (data) {
					vm.batteries = data;
				}
			);
		}
	}


} ());
(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesController', BatteriesController);

	BatteriesController.$inject = ['$state', '$stateParams'];

	function BatteriesController($state, $stateParams) {
		var vm = this;
		vm.message = 'Hei, fra BatteriesController';

		activate();

		function activate() {
			vm.message = $stateParams.message;
		}
	}
}());
(function () {
	'use strict';

	angular
		.module('app.batteries')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.batteries', {
				abstract: true,
                url: '/batteries',
				// views: {
            	// 	'container@layout': {
                		templateUrl: 'app/batteries/batteries.html',
						controller: 'BatteriesController',
						controllerAs: 'vm'
					// }
				// }				
            })
			.state('layout.batteries.list', {
				url: '',
				templateUrl: 'app/batteries/batteries-list.html',
                controller: 'BatteriesListController',
                controllerAs: 'vm',
				restricted: {
					requiresLogin: true					
				}
			})
			.state('layout.batteries.details', {
				url: '/:id',
				templateUrl: 'app/batteries/battery-details.html',
				controller: 'BatteryDetailsController',
				controllerAs: 'vm'
			});

	}
}());
(function () {
    'use strict';

    angular
        .module('app.batteries')
        .factory('batteriesService', batteriesService);

    batteriesService.$inject = ['$resource', 'appSettings'];

    function batteriesService($resource, appSettings) {
        return $resource(appSettings.ApiUrl + 'api/batteries/:id',
            { id: '@id' },
            {
                'get': {
                    method: 'GET'
                },
                'save': {
                    method: 'POST'
                },
                'update': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE'
                }
            });
    }

} ());
(function() {
    'use strict';

    angular
        .module('app.batteries')
        .controller('BatteryDetailsController', BatteryDetailsController);

    BatteryDetailsController.$inject = [
        '$location', '$state', '$stateParams', '$timeout', 'batteriesService'
    ];

    function BatteryDetailsController(
        $location, $state, $stateParams, $timeout, batteriesService) {
        var vm = this;
        vm.battery = {};

        vm.title = '';
        vm.message = '';
        vm.action = '';

        vm.submit = submit;
        vm.addCycle = addCycle;
        vm.deleteCycle = deleteCycle;
        vm.del = del;

        vm.newCycle = {
            created: new Date()
        };
        vm.datepickerIsOpened = false;
        vm.toggleDatepicker = toggleDatepicker;

        activate();

        function activate() {
            batteriesService.get({
                    id: $stateParams.id
                },
                function(data) {
                    vm.battery = data;

                    if (vm.battery && vm.battery.name) {
                        vm.action = 'update';
                        vm.title = 'Edit Battery';
                    } else {
                        vm.action = 'create';
                        vm.title = 'New Battery';
                    }

                },
                function(response) {
                    setMessage(response.data.message);
                });
        }

        function setMessage(message) {
            vm.message = message;
            $timeout(function() {
                vm.message = '';
            }, 2000);
        }

        function toggleDatepicker() {
            vm.datepickerIsOpened = !vm.datepickerIsOpened;
        }

        function addCycle() {
            vm.battery.cycles.push(vm.newCycle);
            vm.newCycle = {
                created: new Date()
            };
            submit('Cycle added');
        }

        function deleteCycle(index) {
            vm.battery.cycles.splice(index, 1);
            submit('Cycle deleted');
        }

        function submit() {
            if (vm.action === 'update') {
                vm.battery.$update({
                        id: vm.battery._id
                    },
                    function(data) {
                        setMessage('Update complete.');
                    },
                    function(response) {
                        setMessage(response.data.message);
                    });
            } else {
                vm.battery.$save(
                    function(data) {
                        setMessage('Save complete.');
                    },
                    function(response) {
                        setMessage(response.data.message);
                    });
            }
        }

        function del() {
            vm.battery.$delete({
                    id: vm.battery._id
                },
                function(data) {
                    $location.path('/');
                },
                function(response) {
                    setMessage(response.data.message);
                });
        }

    }
}());

(function () {
	'use strict';

	angular
		.module('app.chat')
		.controller('ChatController', ChatController);

	ChatController.$inject = ['alert', 'sawkit', 'tokenIdentity'];
	function ChatController(alert, sawkit, tokenIdentity) {
		var vm = this;
		vm.messages = [];
        vm.user = {};
        vm.users = [];

		vm.newMessage = '';
		vm.sendMessage = sendMessage;

        activate();

        function activate() {
            vm.messages.push({
                message: 'Welcome to the chat!'
            });

            vm.user = {
                name: tokenIdentity.currentUser.name
            };

            sawkit.emit('user-join', vm.user);
        }

		sawkit.on('user-join', function (users) {
			vm.users = users;
		});

		sawkit.on('user-message', function (message) {
			vm.messages.push(message);
			console.log('messages: ', vm.messages);
		});

        sawkit.on('user-disconnect', function (user) {
			vm.messages.push({ message: user.name + ' joined...' });
		});

		function sendMessage(message) {
			if (message.length) {
				sawkit.emit('user-message', {
                    sent: Date.now(),
                    user: vm.user,
                    message: message
                });
				vm.newMessage = '';
			}
		}

	}
})();

(function () {
	'use strict';

	angular
		.module('app.chat')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.chat', {
                url: '/chat',
				templateUrl: 'app/chat/chat.html',
				controller: 'ChatController',
				controllerAs: 'vm',
                restricted: {
					requiresLogin: true
				}
			});
	}
} ());

(function() {
    'use strict';

    angular
        .module('app.draw')
        .controller('DrawController', DrawController);

    function DrawController() {
        var vm = this;
    }
})();
(function () {
	'use strict';

	angular
		.module('app.draw')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.draw', {
                url: '/draw',
				templateUrl: 'app/draw/draw.html',
				controller: 'DrawController',
				controllerAs: 'vm',
                restricted: {
					requiresLogin: true
				}
			});
	}
} ());

(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['tokenIdentity'];

	function HeaderController(tokenIdentity) {
		var vm = this;
		vm.tokenIdentity = tokenIdentity;
	}
})();

(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('LayoutController', LayoutController);

	/* @ngInject */
	function LayoutController() {
	}
}());
(function () {
	'use strict';

	angular
		.module('app.layout')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout', {
                url: '',
				views: {
					'@': {
						templateUrl: 'app/layout/layout.html',
						controller: 'LayoutController',
						controllerAs: 'vm'
					},
					'header@layout': {
						templateUrl: 'app/layout/header.html',
						controller: 'HeaderController',
						controllerAs: 'vm'
					},
					'sidebar@layout': {
						templateUrl: 'app/layout/sidebar.html',
						controller: 'SidebarController',
						controllerAs: 'vm'
					},
					'container@layout': {
						template: '<div ui-view></div>',
					},
					'footer@layout': {
						templateUrl: 'app/layout/footer.html',
						// controller: 'FooterController',
						// controllerAs: 'vm'
					}
				},
            });
	}
} ());
(function() {
'use strict';

	angular
		.module('app.layout')
		.controller('SidebarController', SidebarController);

	SidebarController.$inject = ['$state'];
	function SidebarController($state) {
		var vm = this;
		

		activate();

		function activate() { }
	}
})();
(function () {
	'use strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController);

	/* @ngInject */
	function HomeController() {
		var vm = this;
		vm.message = 'Hei, fra HomeController';
		

		activate();

		function activate() {
			// Insert initial 
		}
	}
}());
(function () {
	'use strict';

	angular
		.module('app.home')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.home', {
				url: '/',
				templateUrl: 'app/home/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			});

	}
} ());
(function () {
	'use strict';

	angular
		.module('app.users')
		.controller('UserCreateController', UserCreateController);

	UserCreateController.$inject = ['$state', 'alert', 'UsersService'];
	function UserCreateController($state, alert, UsersService) {
        var vm = this;
        vm.user = new UsersService();
        vm.submit = submit;

		function submit() {
			vm.user.$save(
				function (data) {
					alert.show(
						'info', 'Create user', 'User has been created.');
					$state.go('layout.users.list');
				},
				errorHandler);
		}

        // --------------------------------

        function errorHandler(response) {
            alert.show('danger', response.data.name, response.data.message);
        }

	}
})();
(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UserEditController', UserEditController);

    UserEditController.$inject = ['$state', '$stateParams', 'alert', 'UsersService'];

    function UserEditController($state, $stateParams, alert, UsersService) {
        var vm = this;
        vm.user = {};
        vm.submit = submit;
        vm.del = del;

        activate();

        function activate() {

            UsersService.get(
                {
                    id: $stateParams.id
                },
                function (data) {
                    vm.user = data;
                },
                function (response) {
                    errorHandler(response);
                });

        }

        function submit() {
            vm.user.$update(
                {
                    id: vm.user._id
                },
                function (data) {
                    alert.show('info', 'Update user', 'Update complete.');
                },
                errorHandler);
        }

        function del() {
            vm.user.$delete(
                {
                    id: vm.user._id
                },
                function (data) {
                    $state.go('layout.users.list');
                },
                errorHandler);
        }
        
        // --------------------------------

        function errorHandler(response) {
            alert.show('danger', response.data.name, response.data.message);
        }
    }
})();

(function() {
'use strict';

	angular
		.module('app.users')
		.controller('UsersListController', UsersListController);

	UsersListController.$inject = ['UsersService'];
	function UsersListController(UsersService) {
		var vm = this;
		vm.users = [];
		
		activate();
		
		function activate() {
			UsersService.query(
				{},
				function (data) {
					vm.users = data;
				}
			);
		}
	}
})();
(function () {
	'use strict';

	angular
		.module('app.users')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.users', {
				abstract: true,
                url: '/users',
				templateUrl: 'app/users/users.html',
			})
			.state('layout.users.list', {
				url: '',
				templateUrl: 'app/users/users-list.html',
                controller: 'UsersListController',
                controllerAs: 'vm',
				restricted: {
					requiresLogin: true,
					requiresAdmin: true
				}

			})
			.state('layout.users.edit', {
				url: '/:id/edit',
				templateUrl: 'app/users/user-edit.html',
                controller: 'UserEditController',
                controllerAs: 'vm',
				restricted: {
					requiresLogin: true,
					requiresAdmin: true
				}

			})
			.state('layout.users.create', {
				url: '/create',
				templateUrl: 'app/users/user-create.html',
                controller: 'UserCreateController',
                controllerAs: 'vm',
				restricted: {
					requiresLogin: true,
					requiresAdmin: true
				}

			});

	}
} ());
(function () {
    'use strict';

    angular
        .module('app.users')
        .factory('UsersService', UsersService);

    UsersService.$inject = ['$resource', 'appSettings'];

    function UsersService($resource, appSettings) {
        return $resource(appSettings.ApiUrl + 'api/users/:id',
            { id: '@id' },
            {
                'get': {
                    method: 'GET'
                },
                'save': {
                    method: 'POST'
                },
                'update': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE'
                }
            });
    }

} ());
(function () {
	'use strict';

	angular
		.module('blocks.alert')
		.factory('alert', alert);

	alert.$inject = ['$rootScope', '$timeout'];
	function alert($rootScope, $timeout) {
		var alertTimeout;

		var service = {
			show: show
		};

		return service;

		////////////////

		function show(type, title, message, timeout) {
			$rootScope.alert = {
                hasBeenShow: true,
                show: true,
                type: type,
                message: message,
                title: title
            };

            $timeout.cancel(alertTimeout);

            alertTimeout = $timeout(function () {
                $rootScope.alert.show = false;
            }, timeout || 5000);
		}
	}
})();
(function() {
    'use strict';

    angular
        .module('blocks.tokenIdentity')
        .factory('tokenIdentity', tokenIdentity);

    tokenIdentity.$inject = ['$auth', '$window'];

    function tokenIdentity($auth, $window) {

        var currentUser;

        if ($auth.isAuthenticated()) {
            currentUser = getTokenUser();
        }

        var service = {
            currentUser: currentUser,
            login: function(user) {
                this.currentUser = user;
            },
            logout: function() {
                this.currentUser = undefined;
                $auth.logout();
            },
            isAuthenticated: function() {
                return !!this.currentUser;
            },
            isAdmin: function() {
                return !!this.currentUser && this.currentUser.isAdmin;
            }
        };

        return service;

        // ------------------------------------

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
                case 0: {
                    break;
                }
                case 2: {
                    output += '==';
                    break;
                }
                case 3: {
                    output += '=';
                    break;
                }
                default: {
                    throw 'Illegal base64url string!';
                }
            }

            // polyfill https://github.com/davidchambers/Base64.js
            return $window.decodeURIComponent(escape($window.atob(output)));
        }

    }
})();

/* global io */
(function () {
        'use strict';

	angular
		.module('blocks.sawkit')
		.factory('sawkit', sawkit);

	sawkit.$inject = ['$rootScope', 'appSettings'];
	function sawkit($rootScope, appSettings) {

		var socket;

		var service = {
            connect: connect,
			on: on,
			emit: emit
		};

        return service;

        function connect(room) {
             socket = io.connect(appSettings.SocketUrl + room);
             console.log('sawkit is connecting to room: ' + room);
        }

        function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }

	}
})();

(function () {
	'use strict';

	angular
		.module('components.wesketch')
		.directive('wsScrollDown', ['$timeout', function ($timeout) {
			return {
				scope: {
					wsScrollDown: '='
				},
				link: function ($scope, $element) {
					$scope.$watchCollection('wsScrollDown', function (newValue) {
						if (newValue) {
							$timeout(function () {
								$element.scrollTop($element[0].scrollHeight);
							}, 0);
						}
					});
				}
			};
		}]);

})();

(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['alert', 'sawkit', 'tokenIdentity'];

    function WesketchController(alert, sawkit, tokenIdentity) {
        /**
         * Private variables
         */
        var tools = ['brush', 'eraser', 'fill'];
        var colors = [
            '#000', '#fff', '#c0c0c0',
            '#808080', '#f00', '#0f0',
            '#00f', '#ff0', '#0ff',
            '#f0f', '#800', '#808000',
            '#008000', '#800080', '#008080',
            '#000080'
        ];

        /**
         * Viewmodel
         */
        var vm = this;
        vm.canvas = null;
        vm.ctx = null;
        vm.drawing = false;
        vm.coords = {
            from: {
                x: 0,
                y: 0
            },
            to: {
                x: 0,
                y: 0
            }
        };

        vm.player = {
            id: -1,
            email: ''
        };

        vm.state = {};
        vm.myMessages = [];
        vm.chatMessages = [];
        vm.newMessage = '';
        vm.drawSettings = {
            lineWidth: 2,
            lineJoin: 'round', // 'butt', 'round', 'square'
            lineCap: 'round', // 'bevel', 'round', 'miter',

            currentTool: tools[0],
            tools: tools,

            strokeStyle: colors[0],
            colors: colors,
        };

        // TODO: remove later...
        vm.messagesElement = {};

        vm.sendClientEvent = sendClientEvent;
        vm.addMessage = addMessage;
        vm.onKeyUp = onKeyUp;

        init();

        function init() {
            sawkit.connect('weesketch');

            // TODO: dette er vel ikke helt spa, hva med å sende med som
            // parameter fra directive, eller bruke angular.element ?
            vm.canvas = document.getElementById('canvas');
            vm.messagesElement = document.getElementById('messages');
            if (vm.canvas !== undefined) {

                // TODO: resize canvas
                // vm.canvas.onresize = onResize;
                // var w = angular.element($window);
                // w.bind('resize', function () {
                //     console.log('resize!');

                //     var rowElement = document.getElementById('canvas-height');
                //     console.log('rowElement.clientHeight: ' + rowElement.offsetHeight);
                //     vm.canvas.style.width = '100%';
                //     vm.canvas.style.height = rowElement.offsetHeight + 'px';
                //     vm.canvas.width = vm.canvas.offsetWidth;
                //     vm.canvas.height = vm.canvas.offsetHeight;
                // });

                vm.canvas.onmousedown = onMouseDown;
                vm.canvas.onmouseup = onMouseUp;
                vm.canvas.onmousemove = onMouseMove;
                vm.canvas.onmouseleave = onMouseLeave;
                vm.ctx = vm.canvas.getContext('2d');
            }

            // Add player to the game
            vm.player.id = -1;
            vm.player.email = tokenIdentity.currentUser.email;
            vm.player.name = tokenIdentity.currentUser.name;
            vm.sendClientEvent('addPlayer', vm.player);
        }

        /**
         * Client events
         */
        function onMouseDown(event) {
            vm.coords.from = getCoords(event);
            vm.drawing = true;

            if (vm.state.drawingPlayer.id === vm.player.id) {
                vm.coords.to = { x: vm.coords.from.x - 1, y: vm.coords.from.y - 1 };
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);
            }
        }

        function onMouseUp(event) {
            vm.drawing = false;
        }

        function onMouseMove(event) {
            if (vm.drawing && vm.state.drawingPlayer.id === vm.player.id) {
                vm.coords.to = getCoords(event);
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.drawing = false;
        }

        function onResize(event) {
            console.log('onResize: ', event);
        }

        function onKeyUp(event) {

            switch (event.keyCode) {
                // Enter key
                case 13: {
                    addMessage();
                    break;
                }
                // Arrow up
                case 38: {
                    vm.newMessage = vm.myMessages[vm.myMessages.length - 1];
                    break;
                }
            }
        }

        function addMessage() {

            vm.myMessages.push(vm.newMessage);

            // Drawing player cannot use chat
            if (vm.player.id === vm.state.drawingPlayer.id) {
                alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
                vm.newMessage = '';
                return;
            }

            var eventType = 'guessWord';
            var eventValue = {
                timestamp: new Date(),
                type: 'guess-word',
                from: vm.player.name,
                message: vm.newMessage
            };

            if (vm.newMessage.charAt(0) === '!') {
                eventType = 'addMessage';
                eventValue.type = 'chat';
                eventValue.message = vm.newMessage.substr(1);
            }

            sendClientEvent(eventType, eventValue);

            vm.newMessage = '';
        }

        function sendClientEvent(type, value) {
            sawkit.emit('clientEvent', {
                player: vm.player,
                type: type,
                value: value
            });

            if (type !== 'brush') {
                console.log(
                    '\n*** sendClientEvent:' +
                    ' player = ' + vm.player.email + '(' + vm.player.id + ')' +
                    ', type = ' + type +
                    ', value = ' + value);
            }
        }

        /**
         * Server events
         */
        sawkit.on('serverEvent', function (serverEvent) {

            var serverEvents = serverEvents || {};

            serverEvents.updateState = function (serverEvent) {
                angular.extend(vm.state, serverEvent.value);

                var updatedPlayer;
                for (var i = 0; i < vm.state.players.length; i++) {
                    if (vm.state.players[i].email === vm.player.email) {
                        updatedPlayer = vm.state.players[i];
                    }
                }
                angular.extend(vm.player, updatedPlayer);
            };

            serverEvents.updateDrawSettings = function (serverEvent) {
                angular.extend(vm.drawSettings, serverEvent.value);
            };

            serverEvents.updateTimer = function (serverEvent) {
                vm.state.timer = serverEvent.value;
            };

            // TODO: sjekk hva som overføres av data her...vil ha minst mulig
            serverEvents.brush = function (serverEvent) {
                var coords = serverEvent.value;

                vm.ctx.beginPath();

                vm.ctx.strokeStyle = vm.drawSettings.strokeStyle;
                vm.ctx.lineWidth = vm.drawSettings.lineWidth;
                vm.ctx.lineJoin = vm.drawSettings.lineJoin;
                vm.ctx.lineCap = vm.drawSettings.lineCap;

                vm.ctx.moveTo(coords.from.x, coords.from.y);
                vm.ctx.lineTo(coords.to.x, coords.to.y);
                vm.ctx.stroke();
            };

            serverEvents.clear = function (serverEvent) {
                vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            };

            serverEvents.addMessage = function (serverEvent) {
                vm.chatMessages.push(serverEvent.value);
            };

            serverEvents.serverError = function (serverEvent) {
                vm.chatMessages.push({
                    timestamp: new Date(),
                    type: 'danger',
                    message: serverEvent.value
                });
                alert.show('warning', serverEvent.type, serverEvent.value);
                console.log('Server Error: ', serverEvent.value);
            };

            serverEvents.default = function (serverEvent) {
                alert.show('warning', 'Client Error', 'No handler found for type: ' + serverEvent.type);
                console.log('Client Error - No handler found for type: ' + serverEvent.type);
            };

            if (serverEvents[serverEvent.type]) {
                return serverEvents[serverEvent.type](serverEvent);
            } else {
                return serverEvents.default(serverEvent);
            }
        });

        /**
         * Private functions
         */
        function getCoords(event) {
            var coords = {
                x: 0,
                y: 0
            };

            if (event.offsetX !== undefined) {
                coords.x = event.offsetX;
                coords.y = event.offsetY;
            } else {
                // Firefox compatibility
                coords.x = event.layerX - event.currentTarget.offsetLeft;
                coords.y = event.layerY - event.currentTarget.offsetTop;
            }

            return coords;
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .directive('wesketch', wesketch);

    // TODO: 2 move back to feature, this is not a component
    function wesketch() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/wesketch/wesketch.html',
            scope: {
            },
            link: linkFunc,
            controller: 'WesketchController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }
})();
