Assignment 3 - Persistence: Two-tier Web Application with Flat File Database, Express server, and CSS template
===

Due: September 16th, by 11:59 AM.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Inventory Manager

glitch link  http://a3-AndrewBonaventura.glitch.me

This website is an inventory manager that is linked to an individual's account. This means that every different account 
will have a different set of items associated with it.



- Goal: Create a website that allows a user to manage their company resources through the use of an inventory manager.
- Challenges: I had a lot of trouble with the authentication and its redirect routes. I also had trouble converting from webstorm to glitch due to directory mismatches.
- Authentication/Database: I used the local strategy because it seemed easier and a sqlite database because I had used sqlite
in the past on a Software Engineering project and was familiar with it.
- CSS framework: Milligram because it was easy to work with
- Middleware Packages:
  -  Express-session: Creates a session for a particular user
  -  Passport: Allows for user authentication
  -  Body-parser: Makes dealing with JSON objects easier through some catch all methods
  -  Serve-static: Set the directory of most routing methods
  -  Favicon: server can create a favicon.ico that displays
  -  Express-uncapitalize: allows differently capitalized directories to refer to the same place
  -  Express-slash: deals with trailing slashes
  -  Express-debug: useful in debugging code during development
  -  Sequelize: makes commands to a SQLite database easier
  
Note: I started off by remixing an example glitch project that used sqlite and express: https://glitch.com/~sqlite3-db

## Technical Achievements
- **Tech Achievement 1**: I used SQLite and the Sequelize framework over the suggested low-db, the Sequelize framework is one that provides
methods meant to make working with the SQLite database easier by providing model objects that are used to make the SQL statements instead of
providing a statement in a string.

### Design/Evaluation Achievements
- **Design Achievement 1**: I only used semantic HTML and did not utilize divs or spans which should make it easier to understand what the html
is doing on each page


