# TODO Next
- !!! Update user -> reset's password
- Gulp
- CRUD on users in the client
- Restrict users CRUD to roles.contain('admin')
- Node.js best practises:
	- Never require Modules Inside of Functions
	- Always “use strict” (mangler endel på server-siden)
- Repetetive code on controllers....need a default controller with crud-methods
- Server-side controllers is not DRY, but what do i do with filters and index() ?
- Rename server/batteries/batteries.controller.js -> batteries.api.js ?
- Gulp automation
- Create directive: validate confirm password
- Styleguide
	- Rename BatteriesController -> Batteries ? (styleguide)
	- Rename batteries.route.js -> batteries.routes.js (plural)

# TODO Later
- Codereview på batteriesService og callbacks / errorhandling
- batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
- if (err) på server api-controllers må/bør returnere json istedenfor next(err)
- Validation i mongoose, client friendly error messages
- Testing client with *.specs.js
- Chat
- TicTacToe

# TO DONE
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
