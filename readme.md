# This is the new and better dots.

## Testing locally

for frontend
`npx webpack serve` 

for backend
`npm run server`

## TODO

- [x] Add buttons to the botton part of page
  - [x] Add add button
  - [x] Add remove button
- [x] Append a command log when clicking buttons
- [x] Parse command log to GeoJson
- [x] Send commands when clicking the buttons on sockets.io
- [x] Build with webpack
- [ ] Use environment variable for sockets.io url
- [x] Don't rely on CDN for mapbox
- [x] Use query parameter for dot color setting
- [x] Render custom dot color
- [x] Get closest point property to position.
- [ ] Fix import of turfDistance
- [x] set mapboxgl.accessToken as environment var.
- [x] add render function.
- [x] listen to commands from sockets.io
- [ ] push to heroku
- [x] set up database
- [x] fix SQLITE_ERROR when trying to write to database.
- [x] Send database content on socket connect.
- [x] parse query param for context/map id
- [x] send context with CLIENT_ACTION to server.
- [x] Keep track on which contexts are connected to which sockets
      (I think this is a bit like rooms, but I'd rather don't become
      too reliant on Socket.io)
- [x] Add context to sendActionLog query.
- [ ] Zoom to bounding box of points
   https://www.npmjs.com/package/turf-extent
- [ ] Create docker-compose with reboot rule
- [ ] Deploy
- [ ] Commit latest changes
- [ ] Clean up code a bit

## Suggestions

- [ ] Set limit on how far away points can be deleted