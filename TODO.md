# TODO Next
[x] Walking skeleton
[x] Routing, serverside
[x] Logging with Morgan
[x] MongdoDB & Models
[x] FontAwesome
[x] WTB Queries for uthenting av data med Mongoose: http://mongoosejs.com/docs/queries.html
[x] Make $resource use path (not querystring)
[x] Client code for Update batteries
[ ] Make /api/batteries/0 return an empty Battery object, it returns a status 500 now
[ ] Codereview på batteriesService og callbacks / errorhandling
[ ] Client code for Create & Delete batteries
[ ] Reference bower_components in dev, remove client/vendor-references
[ ] Fix routing in the client, code is currently inside app.module.js
[ ] Make a reference to useful site for development in the client nav
[ ] Make a TODO-feature and replace this file with that feature

# TODO Whenever "big"
[ ] Authentication
[ ] Toastr
[ ] Gulp automation
[ ] Testing client with *.specs.js
[ ] Morgan, vurder å fjern...eventuelt logg annerledes i produksjon
[ ] Proper Error Handling aka. codereview på congig/errors.js

# TODO Maybe & Some Thoughts
[ ] få til å fremprovosere en 500 hvor response = render 500.jade 
[ ] batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
[ ] Hmm, kanskje jeg vil ha en batteries.service.js under server ?
[ ] if (err) på server api-controllers må/bør returnere json istedenfor next(err) 