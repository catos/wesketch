# Hmm

// set NODE_ENV=production
// node src/server/server.js


# TODO

## weSketch
- Easier words
- Impl. buttons to toggle chat | guess-mode
- Impl. ctr + t to toggle chat | guess-mode
- Only drawing player can clear the drawingboard
- Reset game when all clients leave
- 'updateState' exclude currentword for all players except drawingplayer
- Replace console.log with a custom logger (that can support heroku-logging?)
- End game after x turns, show score
- Draw stack
- Client catchup
- Undo / Redo
- Width 100% og scale for different client viewports!
- Eraser tool
- Fill tool
- Fix give hint
- Request pause
- Reading material
	- http://stackoverflow.com/a/27025090
	- http://www.jacklmoore.com/notes/mouse-position/
	- http://codepen.io/goker/pen/kbEdn
	- Game-loop = http://buildnewgames.com/real-time-multiplayer/
	- http://encosia.com/first-class-functions-as-an-alternative-to-javascripts-switch-statement/

## Chat
- http://briantford.com/blog/angular-socket-io
- https://github.com/btford/angular-socket-io-im
- http://chariotsolutions.com/blog/post/getting-chatty-angular-socket-io-nodeexpress-bootstrap/
- http://www.hutchinson.io/building-a-real-time-application-with-express-socketio-and-ember/
- http://fdietz.github.io/2015/04/16/day-4-how-to-build-your-own-team-chat-in-five-days-expressjs-socket-io-and-angularjs-component-based-design-patterns.html
- https://github.com/fdietz/how_to_build_your_own_team_chat_in_five_days/tree/master/day_4/nodejs_express_socketio_chat/public/app

## Gulp
- Angular's Template Cache

## Client
- Reset password
- Create directive: validate confirm password
	- http://toddmotto.com/killing-it-with-angular-directives-structure-and-mvvm/

## Server
- ORM: Breeze or Waterline
- Server-side controllers is not DRY, but what do i do with filters and index() ?
	- Repetetive code on controllers....need a default controller with crud-methods
- Rename server/batteries/batteries.controller.js -> batteries.api.js ?
- Styleguide
	- Rename BatteriesController -> Batteries ? (styleguide)
	- Rename batteries.route.js -> batteries.routes.js (plural)
- Codereview på batteriesService og callbacks / errorhandling
- batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
- if (err) på server api-controllers må/bør returnere json istedenfor next(err)
- Validation i mongoose, client friendly error messages
- Testing client with *.specs.js

# Project layout

```
src/
	client/
		app/
			blocks/
			core/
			home/				Default route '/' navigates to this "dashboard"
			layout/

			users/
				users.module.js
			recipes/
				recipes.module.js
			feature3/

			app.module.js
		css/
		images/
		favicon.ico
		index.html

	server/
```
