# TODO

## weSketch

### Client
- Update gulp to copy audio to build-folder
- First man to guess
- Easier words
- Fix domain
- Fix give hint
- Draw stack, makes it possible for clients to catchup
- Undo / Redo
- Scaleable canvas
- Eraser tool
- Fill tool
- Request pause
- Player are drawing x times in a row...
- Next round starts in X seconds: show who the next drawing player is
- Sounds....especially when someone wins
- Time reduces when someone guess the right word
- Sound on timer near the end
- Reset currentDrawingPlayer when end game
- Show scores in the middle, toggle OK
- Make scores more interesting
- Word does not show when game ends
- Lenke på ord til søk på google
- Shortcuts på tools
- Theme, mørkere bakgrunn
- Scroll wheel -> brush size
- Marker på hvem som har gjetta ordet
- Order by points på player-lista
- LOL => LOL selv om det sammenlignes med lowercase
- Brown is missing
- serverEvents.brush: sjekk hva som overføres, vil ha minst mulig data her

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
