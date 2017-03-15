# yelpcamp built on node
a simple CRUD app built with ExpressJS

This app uses:

- Express
- Sequelize (ORM)
- PassportJS
- sqlite3 (or install mysql, postgresql module if need be)
- ejs
- bcrypt

## Usage

* Clone the repo
* Run the following commands

      npm install
      node app.js

* Navigate to localhost:3000

## Note:

* I haven't added persistent sessions (eg. if the server is turned off, the sessions are lost)
  The easy fix is to add 'connect-session-sequelize' module
