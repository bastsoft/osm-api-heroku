# osm-api-heroku
osm heroku ajax endpoint


##forTest

node --experimental-modules src/server.mjs
http://localhost:5000/api/0.6/map?bbox=61.40574,55.15424,61.41073,55.15617


##Build and deploy

webpack
heroku create
git push heroku master -f
heroku logs

##example
https://blooming-beach-75686.herokuapp.com/api/0.6/map?bbox=61.40574,55.15424,61.41073,55.15617
