
# WeSketch v0.2.0

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
- Drawing-tools are now hidden for non-drawing players

## Version 0.1.0 - Prototype
- Input mode: use the buttons beside the text-input (or | "pipe") to toggle between chat and guess mode.

## TODO

### Client
- Update gulp to copy audio to build-folder
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
- Sound on timer near the end
- Reset currentDrawingPlayer when end game
- Show scores in the middle, toggle OK
- Word does not show when game ends
- Lenke på ord til søk på google
- Shortcuts på tools
- Theme, mørkere bakgrunn
- Scroll wheel -> brush size
- Marker på hvem som har gjetta ordet
- Order by points på player-lista
- LOL => LOL selv om det sammenlignes med lowercase
- serverEvents.brush: sjekk hva som overføres, vil ha minst mulig data her

### Server
- Minify js & css
- Only apply draw restrictions in drawing-phase
- Exclude currentword for all players except drawingplayer
- Replace console.log with a custom logger (that can also support heroku-logging?)
- IsNullOrEmpty på guess og chat
- Reset game when all clients leave
- Check development || production in client...app.config.js

### Gulp
- Angular's Template Cache

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
