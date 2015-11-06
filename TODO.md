# TODO Next
- Delete .vscode from repository and add to .gitignore
- CRUD on users in the client
- Restrict users CRUD to roles.contain('admin')

- Repetetive code on controllers....need a default controller with crud-methods
- Server-side controllers is not DRY, but what do i do with filters and index() ?
- Rename server/batteries/batteries.controller.js -> batteries.api.js ?
- Gulp automation
- Create directive: validate confirm password

# TODO Big tasks, thoughts & reminders
- Codereview på batteriesService og callbacks / errorhandling
- få til å fremprovosere en 500 hvor response = render 500.jade 
- batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
- if (err) på server api-controllers må/bør returnere json istedenfor next(err)
- Clean out console.log's
- Testing client with *.specs.js
- Proper Error Handling aka. codereview på config/errors.js
- Rename BatteriesController -> Batteries ? (styleguide)
- Rename batteries.route.js -> batteries.routes.js (plural)
- JSCS
- JSHINT


# TO-Read
- http://justbuildsomething.com/node-js-best-practices/#2

# TO DONE
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
