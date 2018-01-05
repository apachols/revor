# Rover Coding Project
Hi and welcome to my Rover Coding Project!  As you will see, I had a lot of fun putting this together.  Right now the demo version should be available on my domain, hosted at the root:

* https://www.adampacholski.com

Next up is a quick set of instructions for installing and running the project, followed by an in depth walkthrough of some of the details of how the project is put together.

# Quick Start

### Initial setup
* brew install sqlite
* cd rover && npm install

I used sqlite3 databases for testing and local development; on OSX, the homebrew install is easiest.

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

Sequelize is pretty cool - it works with multiple flavors of SQL in the same project, which allowed me to switch seamlessly between sqlite3 and MySQL.  Plus it allowed me to define a bunch of strong Model classes as the foundation of the backend, and use those to power both the import and the API.  The sequelize models also come with built in field validators, which helped me make sure all the data was being imported correctly.

I dont' much like the SQLITE3 default date format that Sequelize left me with, and I mostly ignored this and other date related issues for this project because they don't effect the Search features that power the front end.

##### Koa

Koa is a cool, minimal webserver framework 'from the team behind Express', which I've used before and like very much.  Using the async / await style from the Koa docs is a lot of fun and makes Node.js server code easy to read.

##### Redux-*

React with Redux is my most-used front-end framework-flavor, and I think it scales well to the point where you can have several teams working in the same codebase without tripping each other up.  You could argue that it isn't strictly necessary for a small project, but if this is production code and meant to expand, and Redux is great at scaling up and out.  

I think Redux apps are easy to scale because the one-way data flow and the discipline of changing state only through reducer functions makes larger and larger apps easier to understand, and easier places to guarantee separation of concerns.  The downside is that because of that discpline, Redux is a bit boilerplate heavy, but I don't mind much, and I think there are current and future ways around that problem.

## Database Schema
For schema details, please see `src/server/models`, e.g. `src/server/models/user.js`.
##### User
This is the User that would authenticate to the site.  A User can be both a Sitter and an Owner!
##### Sitter
Both Sitter and Owner include a name field in this schema; going forward I would probably move that into User, since one user would probably always have the same Owner and Sitter name.  With the sitter score calculation in overallrank depending on name, however, it was helpful to have the name on the sitter record.
##### Owner
Very similar to Sitter; includes name field.
##### Dog
Each dog has an Owner!  Also I had intended to create a DogStay record (dogid, stayid), to indicate which dogs had been cared for in each Stay, but I didn't get to it.
##### Stay
Stay records are created when the Owner books with a Sitter; they include the dates of the stay and each Stay has one sitter and one owner.
##### Review
After a Stay is completed, an Owner can leave a Review, which has an associated Stay and a rating.  The text of the review is normalized out to a ReviewText record, to make queries on the review table faster.  Review also includes direct foreign key relationships to Sitter and Owner, which could be obtained by joining to Stay, but are very useful in search queries (e.g. for getting the text of the most recent review).
##### ReviewText
Normalized out to a separate table; Review.reviewtextid = ReviewText.reviewtextid.
##### OverallRank
Now for the good stuff!  We could join to all reviews on every search query, but that would be very stressful for our poor database.  Instead it would be better if the overallrank was calculated ahead of time, and stored separately in the database.

 * Pro: calculate and store overall rank makes search queries much faster
 * Con: need to keep overallrank table updated when reviews and ratings change!

It would be best if we could **quickly** update the overall rank record every time a review was inserted, changed, or deleted, and also be sure the overallrank was consistent with the records in the database.

By storing some extra information in overallrank, we can instantly calculate new overall rank without re-looking at all the reviews:  we just need to store the total and count of ratings, and the sitter score.  With those included on overallrank, we can instantly calculate a new overallrank using (total+newrating, count+1); this operation should be performed whenever a review is inserted, updated, or deleted.

Then, just to make sure our aggregate records (overallrank) aren't too far out of sync with our reviews, we mark the overallrank record field 'dirty' = 1, so we can find it later, using a batch process to recalculate all dirty records (`src/server/commands/recalcRank.js`).  We could run this script once an hour, or once a day, and it would log any discrepancies between the quick-method calculations and the IO-heavy calculations.  (I was pleased that after running the import script on our 100 test data sitters and recalculating them, the calculations matched exactly and there were no discrepancies).

## Search

To make the search as fast as possible, I skipped the ORM and included a raw SQL query which joins overallrank to sitter, and sorts by overallrank.overallrank descending.

I also included a left join to review, to count the total reviews, and a left join to a temp table to count the number of repeat clients (group by sitterid and ownerid on stay).  This allowed me to put "X REVIEWS" and "Y REPEAT CLIENTS" in each search result! :smiley: For more details please see `src/server/service/search.js`.

## Tests
I decided to stick with the Jest test running provided by create-react-app; I think the Jest test runner is pretty good but not great.  There were some spots where I had to use extra try-catch blocks and extra assertions to test some async behavior, and the test runner would sometimes forget to run all the tests until something had been broken for a while (I think this is configurable though).  Plus I've seen better matchers working with Mocha/Chai and Jasmine setups, perhaps those can be imported?

##### Unit - backend
For these I made sure to dependency inject the database into the model objects, so it was easy to give them a testDB at run time.  The backend unit tests don't write or read the testDB, but they do use a Sequelize instance to do their model things.

##### Integration - backend
The backend integration tests do use the test.db extensively, and therefore they take a long time and they *need to not run in parallel*, which you can get Jest to do with the --runInBand option.  I set these up so that you have to run them separately; the regular `npm test` command just runs the unit tests.

##### Unit - frontend
Here I used enzyme to test-mount components and test that their structural logic was working (not much testing of presentation details).  This is super easy and fun for presentation only components, and a little harder for Redux 'connected' components.  Next up here would be using enzyme's Shallow Rendering API to isolate components more effectively.

## Config
I set up the app to use a config to load the correct database for the environment at hand.  The config loader reads NODE_ENV, and then loads `config/{NODE_ENV}.js` and connects to the database specified therein.  'npm test' runs in a sqlite3 test database `test.db`, and anything other than 'production' or 'test' runs in a local sqlite3 database `rover.db`.  I would move the configs out of the project folder going forward, but other than that you can use them so specify other environmental differences as well (these are configs which are NOT bundled into the front-end JS bundle, so no worries about exposing them to the end user).

## Logging
There are actually several logs, and I would refine this a bit so the logging behavior is a bit more unified and predictable.
* logs/app.log

## Next Steps
* Server Side Rendering
* mysql container
* node server container
* Code splitting
