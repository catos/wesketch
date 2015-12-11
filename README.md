# TODO

## weSketch

### Client
- Easier words
- Fix domain
- Fix give hint
- Draw stack, makes it possible for clients to catchup
- Undo / Redo
- Scaleable canvas
- Eraser tool
- Fill tool
- Request pause

### Server
- Minify js & css
- Only apply draw restrictions in drawing-phase
- Exclude currentword for all players except drawingplayer
- Replace console.log with a custom logger (that can also support heroku-logging?)
- IsNullOrEmpty på guess og chat
- Reset game when all clients leave
- Check development || production in client...app.config.js

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
