# TODO Next
[x] Walking skeleton
[x] Routing, serverside
[x] Logging with Morgan
[x] MongdoDB & Models
[x] FontAwesome
[x] WTB Queries for uthenting av data med Mongoose: http://mongoosejs.com/docs/queries.html
[x] Make $resource use path (not querystring)
[x] Client code for Update batteries
[x] Make /api/batteries/0 return an empty Battery object, it returns a status 500 now
[x] Client code for Create & Delete batteries
[x] Reference bower_components in dev, remove client/vendor-references
[x] Fix routing in the client, code is currently inside app.module.js
[ ] Rename /src/server/core/routeHandler -> restApiSomething.-...
[ ] app.layout i client
[ ] Toastr
[ ] Gulp automation

# TODO Whenever "big"
[ ] Make a TODO-feature and replace this file with that feature
[ ] Authentication
[ ] Testing client with *.specs.js
[ ] Morgan, vurder å fjern...eventuelt logg annerledes i produksjon
[ ] Proper Error Handling aka. codereview på congig/errors.js

# TODO Maybe & Some Thoughts
[ ] Codereview på batteriesService og callbacks / errorhandling
[ ] få til å fremprovosere en 500 hvor response = render 500.jade 
[ ] batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
[ ] Hmm, kanskje jeg vil ha en batteries.service.js under server ?
[ ] if (err) på server api-controllers må/bør returnere json istedenfor next(err)
[ ] Clean out console.log's