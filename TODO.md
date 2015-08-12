# TODO Next
[x] Walking skeleton
[x] Routing, serverside
[x] Logging with Morgan
[x] MongdoDB & Models
[x] FontAwesome
[x] WTB Queries for uthenting av data med Mongoose: http://mongoosejs.com/docs/queries.html
[ ] Client code for Create, Update & Delete batteries
	[ ] Trenger å bruke /path/id med $resource for å få til dette 

# TODO Whenever "big"
[ ] Authentication
[ ] Toastr
[ ] Gulp automation
[ ] Testing client with *.specs.js
[ ] Morgan, vurder å fjern...eventuelt logg annerledes i produksjon

# TODO Maybe & Some Thoughts 
[ ] batteries.controller.js => if (err) return next(err): finnes det en bedre måte å håndtere feil i mongoose på ?
[ ] Hmm, kanskje jeg vil ha en batteries.service.js under server ?
[ ] if (err) på server api-controllers må/bør returnere json istedenfor next(err) 