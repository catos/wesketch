# TODO Next
- Opprett feature "iSketch" som skal bruke både chat og draw (new name pending)
- Rename draw-* til noe annet og gjør det til en komponent
- Sjekk sailsjs hvordan de setter opp websockets, splitt opp server/config/sockets-io.js i komponenter
- Delete Drawing-directive ?
- Reset password
- Create directive: validate confirm password
	- http://toddmotto.com/killing-it-with-angular-directives-structure-and-mvvm/
- Server-side controllers is not DRY, but what do i do with filters and index() ?
	- Repetetive code on controllers....need a default controller with crud-methods
- Rename server/batteries/batteries.controller.js -> batteries.api.js ?
- Styleguide
	- Rename BatteriesController -> Batteries ? (styleguide)
	- Rename batteries.route.js -> batteries.routes.js (plural)
- https://github.com/johnpapa/gulp-patterns

# TODO Later
- Gulp
- Codereview på batteriesService og callbacks / errorhandling
- batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
- if (err) på server api-controllers må/bør returnere json istedenfor next(err)
- Validation i mongoose, client friendly error messages
- Testing client with *.specs.js
- Chat
	- http://briantford.com/blog/angular-socket-io
	- https://github.com/btford/angular-socket-io-im

	- http://chariotsolutions.com/blog/post/getting-chatty-angular-socket-io-nodeexpress-bootstrap/
	- http://www.hutchinson.io/building-a-real-time-application-with-express-socketio-and-ember/
	- http://fdietz.github.io/2015/04/16/day-4-how-to-build-your-own-team-chat-in-five-days-expressjs-socket-io-and-angularjs-component-based-design-patterns.html
	- https://github.com/fdietz/how_to_build_your_own_team_chat_in_five_days/tree/master/day_4/nodejs_express_socketio_chat/public/app
- iSketch
	- http://stackoverflow.com/a/27025090
	- http://www.jacklmoore.com/notes/mouse-position/
	- http://codepen.io/goker/pen/kbEdn

# TO DONE
- ~~Prototype draw-feature with sockets.io~~
- ~~Prototype chat with sockets.io~~
- ~~Simple CRUD on users in the client~~
- ~~JSCS~~
- ~~JSHINT~~
- ~~Seed users~~
- ~~Moved api-controllers to /server/api~~
- ~~Authentication with jwt-simple, satellizer and passport~~
- ~~Walking skeleton~~
- ~~Routing, serverside~~
- ~~Logging with Morgan~~
- ~~MongdoDB & Models~~
- ~~FontAwesome~~
- ~~WTB Queries for uthenting av data med Mongoose: http://mongoosejs.com/docs/queries.html~~
- ~~Make $resource use path (not querystring)~~
- ~~Client code for Update batteries~~
- ~~Make /api/batteries/0 return an empty Battery object, it returns a status 500 now~~
- ~~Client code for Create & Delete batteries~~
- ~~Reference bower_components in dev, remove client/vendor-references~~
- ~~Fix routing in the client, code is currently inside app.module.js~~
- ~~Rename /src/server/core/routeHandler.getRouter to routeHandler.getApiRouter~~
- ~~Continue on batteries.cycles in server api, and update client to reflect model changes~~

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

	server /
```

# Food sites
- http://allrecipes.com/
- http://www.frutimian.no/
- http://trinesmatblogg.no/
- http://matprat.no
- http://foodwishes.blogspot.no/

# Recipe model
```
Recipe
	Name
	Image
	Description				Chef's comment on recipe
	StepByStep				How to make the stuff
	ActiveTimeToMake		0-20, 20-40, 40-60, 60+
	PassiveTimeToMake
	Difficulty				Easy, Intermediate, Advanced
	Category				Dinner, Dessert, Salad, Cake, Drink
	[Tags]
		Name				Vegetarian, Healthy, Chinese
	Servings				Number of servings on with displayed ingredients				
	[Ingredients]
		Name
		Amount
		Unit
		Comment
	[Comments]
		Comment
		Created
		CreatedBy
	Rating					1-5 stars: Really bad, Bad, Ok, Good, Very Good
	CreatedBy
	Credit					
```
