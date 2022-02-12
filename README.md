# Project Overview

> The project was developed in a Linux environment using the distro Ubuntu 20.04 using docker to handle the Database, and with Node and Express, and a ORM called sequelize which is the most popular (not the most robust), the project uses a relational database PostgresDB, and the database is launched in a docker container.
To make the database online it's necessary to run the command: 
docker-compose up -d
by default im using /home/docker/Docker-Compose/PostgreSQL to store the image, and /var/lib/postgresql/data to the container
But, it's also possible to use a downloaded local instance of postgres. The database environment configuration is stored in the .env file.
The first thing that's executed is the app.js/server.js files, that basically starts the HTTP server, and load-up the routes (i.e. endpoints), all of the routes can be found in the routes.js file. Those routes basically have 2 parameters: The URL of the endpoint, and the function that will handle the request.
The functions that handle request can be found under the /src/controllers folder, each function inside the module.exporst is a function that is being mapped to and enpoint. And there's also the middlewares, that are executed before the functions on the controllers, middlewares have the job to validate information before its been sended to the actual function.
In sequelize, there is the concept of model, that is basically a interpretation of your database table and it's relationship with other tables, the models folder can be found in src/models path, and basically each file represents a table or entity of the database.
In the database folders there are 3 things: migrations, seeders, and configuration file. The configuration file can be found in database/index.js, and it basically links the models to the actual database, where the migration and seeder plays similar roles, which is to populate the empty database with the SQL structure of the tables of the project. The migration contains structural steps to create the empty tables, where the seeder contains the structure to insert chunks of data in those tables.
The project also have some automated tests to test if the endpoints are responding accordingly, basically it tests if the endpoints can create valid users, create valid posts, can validate the follow/unfollow actions, or if the user can post after already made 5 posts in under 24 hours. The automated tests runs on the SQLite database (that's why there are 2 envs: .env and .env.test), every time the tests are called, it run all migrations, insert data to make the tests, and then undo all the migrations, resetting the initial empty state of the database.
In the controllers we have all the code for the endpoints POST and GET, and all get urls that return a list of data are paginated to be as production-ready as possible.
In the project there is also some configuration files like .sequelizerc and config/database.js

# Planning

- Could there be a post starting with some @ mentioning that is not a reply-to-post?
- The same characters limit that is in the post is applied to the reply-to-post?
- What would happen to the reply-to-post when the original post get deleted?

> There's really not much to change in the database, just the creation of a new postType (called: 'Reply-to-post', with probably the id 4 on the table), and linking the post that is being replied to, in the original_post_id. This would make very easy to collect "Post and Replies" since they're the same model with different post_type_id.

# Critique

> If i had more time, one of the first thing i would do is a robust errorHandling Middleware.
One other thing that migth be handy is to improve the pattern of routes.js, since if we had more endpoints, the file would be too big, and too complex to read, maybe if i could split each endpoint to be coded grouped by it respective controller would be better on the code scalability and easiness to read.
It also would be possible with more time, to implement even more tests, specifically, unit tests, and e2e tests
The relational database could be a problem if the number of users and the volume of posts increase, in order for the project to grow, and maintain performance, maybe a non-relation database (e.g. Documents collections) could work better thinking of the data volume
Redis would be a big add-in to the project, unfortunately, i found some severe bugs when trying to use redis, but the concept of cache could be applied to some funcionalities of the API (e.g. limit 5 post per day), and reduce the number of queries to the database making the API more performant.
In a real-life situation maybe i would try to use more webServices like aws lambda, and technologies link sentry for finding and debbuging for handling production bugs