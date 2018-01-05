# Rover Coding Project
Hi and welcome to my Rover Coding Project!  As you will see, I had a lot of fun putting this together.  Right now the demo version should be available on my domain, hosted at the root:

* https://www.adampacholski.com

Next up is a quick set of instructions for installing and running the project, followed by an in depth walkthrough of some of the details of how the project is put together.

# Quick Start

### Initial setup
* brew install sqlite
* npm install

I used sqlite3 databases for testing and local development; on OSX, the homebrew install is easy.

### Development
##### Test
Run the unit tests: `npm test`

Integration tests: `npm run test:int`

##### Run locally
* Run the CSV import locally (creates sqlite3 db in `rover.db` in project folder):

```
$ node src/server/commands/import.js
cleanDB: 101.652ms
readCSV: 120.163ms
processData: 15842.548ms

$ node src/server/commands/recalcRank.js
$ cat logs/app.log
[2018-01-05T11:32:25.146] [INFO] application - Starting import
[2018-01-05T11:32:25.253] [INFO] application - Clean db complete
[2018-01-05T11:32:41.217] [INFO] application - Import complete
[2018-01-05T11:33:46.012] [INFO] application - Starting recalc
[2018-01-05T11:33:46.068] [INFO] application - Recalculating 100 dirty records
[2018-01-05T11:33:46.620] [INFO] application - found 0 differences after recalculation
[2018-01-05T11:33:46.621] [INFO] application - Recalc complete
```

The second command will recalculate the sitters overall ranks after the conversion, and check to make sure the 'quick version' of the overall rank calculation matches the recalculation based on the database after the conversion is finished.

* Start the api server and webpack dev server: `npm start`

## Production
First, make sure a production config is available in the config/production.js folder in the project.  (A better long term choice would be on a config folder outside the project somewhere on the production machine.)

Example production config:
```
module.exports = {
  name: 'production',
  database: ['rover', 'root', 'A PASSWORD', {
    dialect: 'mysql',
    host: '127.0.0.1',
    logging: false,
    operatorsAliases: false
  }]
}
```

Build the app in the project directory `npm run build`

And then use pm2 to start the app: `pm2 start ecosystem.json`

You'll also need to make sure the app can connect to the mysql instance specified in the production config.

# Design
This project is a React front end powered by the [create-react-app](https://github.com/facebookincubator/create-react-app)
 framework, which uses a node API server with a MySQL database for backend.

It's very similar to the mobile website platform at my last job, with one exception: the backend was a collection of PHP microservices (for which the Node server was a pass-through layer).  I didn't want to use PHP or apache for this project, so I decided to do the backend directly from Node instead.

## Framework
##### create-react-app
create-react-app is a 'zero build configuration' React app framework by created by Facebook that collects standard React build tools and best practices and abstracts them away, providing a nice interface of "react scripts" that build, run, and test your project.  I left the create-react-app README in the docs folder ('create-react-app-README.me').  That's a good reference for the base structure provided by create-react-app.

Overall I was very satisified using create-react-app, except that when I tried to put Server Side Rendering into the project, it proved too challenging; create-react-app is not set up for that.  (The earlier you set up SSR the better!)

create-react-app uses ES6 syntax, ESLint for style checking, Jest for tests, and Webpack to build and bundle the app.

##### Database:  MySQL and sqlite3
Looking at the project requirements, I think the database structure for our Rover recovery app would be well suited to a relational database, and SQL is fast and reliable, so SQL was my pick.  I started the project using sqlite3, which is **crazy** fast, and *mostly* similar to MySQL (more on this in a sec).  About 2 days in I realized I had a domain available, and I was able to get a cloud database MySQL instance up and running, which meant that the project could use sqlite3 for local and test environments, but MySQL in production.

In general I tried to write production *application code* for this project, and let the deployment / configuration / ops features be a little less refined, in order to spend my time effectively.  That was why I figured having a mismatch between production and test database engines would be fine, as long as I didn't use any features from MySQL that aren't supported in sqlite3...

:stuck_out_tongue_winking_eye:

Yep the feature that was missing was SQL_CALC_FOUND_ROWS, which is really good if you want to deliver both a page of search results and the TOTAL number of search results in all pages and only run one query to get both of those.  Please see src/service/search.js for an in depth explanation of how I solved this problem (short version: the app does a 2nd query for the total row count, until we move the test db to MySQL).

## Notable Node Modules
##### Sequelize
In order to get the google-scraped Rover site data into the database, I wanted to use an ORM, for several reasons.  I wanted the backend code to be as productiony as possible, and I think a good ORM, used wisely, is a great strategy for writing disciplined and well tested backend code with a relational database setup like the one for this project.  (Plus, doesn't Django have a cool ORM? :wink:)

Sequelize is pretty cool - it works with multiple flavors of SQL in the same project, which allowed me to switch seamlessly between sqlite3 and MySQL.  Plus it allowed me to define a bunch of strong Model classes as the foundation of the backend, and use those to power both the import and the API.  The sequelize models come with built in validators too, which helped me make sure all the data was being imported correctly.

I dont' much like the SQLITE3 default date format that Sequelize left me with, and I mostly ignored this and other date related issues for this project because they don't effect the Search features that power the front end.

##### Koa

Koa is a cool, minimal webserver framework 'from the team behind Express', which I've used before and like very much.  Using the async / await style from the Koa docs is a lot of fun and makes Node.js server code easy to read.

##### Redux

React with Redux is my most-used front-end framework, and I think it scales well to the point where you can have several teams working in the same codebase without tripping each other up.

## Config
* production, local, test

## Tests
* unit
* integration

## Logging
* app.log

## Front end
* Folder structure

## Production
* https://www.adampacholski.com

## Next Steps
* Server Side Rendering
* mysql container
* node server container
* Code splitting
