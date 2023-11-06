# Acorn for MERN stack
===

The MERN stack is a web development framework made up of the stack of MongoDB, Express.js, React.js, and Nodejs. It is one of the several variants of the MEAN stack.


This is Acornfile for simple MERN stack application following the standard [MongoDB sample application guide](https://www.mongodb.com/languages/mern-stack-tutorial) which creates a simple Record List for Employees.


## Configure the MERN stack

MERN stack uses MongoDB as the database. In this Acorn, we've used the native Acorn MongoDB [service](https://docs.acorn.io/reference/acornfile#services-consuming). If you select "Advanaced Options" at deployment time on Acorn, you can configure arguments to provide the `mongodbname`. By default it will be named as `mongodb`.

Once your application is running on Acorn, just click on the client to get the UI Server, which will expose the web UI for the sample application.
