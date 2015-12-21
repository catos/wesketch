
# WeSketch v0.2.0

## Version 0.2.2
- Gulp-task 'serve-dev' and 'serve-build' will now produce environment-specific configurations
- Client will no longer allow empty strings in chat or as guess

## Version 0.2.1
- A new wordlist appears: it is smaller and much simpler. You may remember me from such word as "cat", "circle" and "nothing"

## Version 0.2.0 - Three shades of brown
- Revamped UI: experience should be more comfortable, especially on smaller devices (such as Espens iMacBookPro4k)
- Revised scoring
	- Drawing player gets 10 points for the first guess, then 1 point for each folloing guess until 15, which is the maximum.
	- Guessing players gets 10 points for begin first, each following player gets 1 less until 5, which is the minimum.
- Sfx on: player joined, player guessed correct, 30 seconds timer start
- Added toggle music and audio (not persistent)
- Updated palette with new awesome color, including 3 shades of brown!
- Unnecessary fullscreen button added, it includes the framework on zoom so it brings nothing more than the basic browser feature.
- Drawing player has a different colored UI to indicate that he (or she) is in fact the drawing player
- Timer shakes on 30 seconds...
- Tense music starts after the first correct guess
- Drawing-tools are now hidden for non-drawing players
- Input mode now toggles automatically between chat and guess depending on gamephase
- Scoreboard implemented, should pop up at the end of a game
- Word should now be shown after the last round

## Version 0.1.0 - Prototype
- Input mode: use the buttons beside the text-input (or | "pipe") to toggle between chat and guess mode.
- Walking skeleton using socket.io, angularjs and nodejs

## TODO

### WeSketch Client
- Recalculate # rounds at start of first round
- Warning om at det er din tur, type lyd
- Close guess = sound (only for guessing player)
- Reset drawing settings
- Clear board after round
- Sort scoreboard
- x seconds idle = kick
- Remove overflow-hidden on #fw-wrapper
- Support multiple wordlists, choose in lobby before game
- CRUD & Import wordslists
- Fix give hint
- Draw stack, makes it possible for clients to catchup
- Undo / Redo
- Scaleable canvas
- Eraser tool
- Fill tool
- Request pause
- Next round starts in X seconds: show who the next drawing player is
- Lenke på ord til søk på google
- Shortcuts på tools
- Theme, mørkere bakgrunn
- Scroll wheel -> brush size
- Marker på hvem som har gjetta ordet
- Order by points på player-lista
- LOL => LOL selv om det sammenlignes med lowercase
- serverEvents.brush: sjekk hva som overføres, vil ha minst mulig data her

### WeSketch Server
- Minify js & css
- Only apply draw restrictions in drawing-phase
- Exclude currentword for all players except drawingplayer
- Replace console.log with a custom logger (that can also support heroku-logging?)
- IsNullOrEmpty på guess og chat
- Reset game when all clients leave

### Client
- Reset password
- Create directive: validate confirm password
	- http://toddmotto.com/killing-it-with-angular-directives-structure-and-mvvm/

### Server
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
