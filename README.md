VueBase is a Boilerplate for vuejs, a quick way to create administrative systems with login and password already built with jwt

# Technologies

* Backend in nodejs
* Frontend in javascript (Vuejs) and BootstrapVue

# Support

* Uploads with authenticated routes
* Https

# Features

* Generic components on frontend: Nav, Pagination, CrudHeader and AlertMessage
* Global Mixin
* Complete user and client CRUD (User with upload, we are using Multer on backend )
* Authentication using Vuex
* Http with axios
* VueRouter for route manage
* Typeahead on users form
* Dynamic menu with access validation on links

# SETUP

```
sudo npm install -g nodemon
```

```
cd backend
cp config.js.dist config.js
npm install
nodemon index.js

cd ..
cd frontend
npm install
npm run serve
```

## Initialization:

```
    Go to your project folder...
    First change you dbName on /backend/config.js
    Go to /backend/app/systemMOdules and execute "node createModules.js"
    This will create the defaults modules in your db
```
then...

```
    Go to your project folder /backend/app/usuarios/fixture and execute "node createRoot.js"
    This will create the root user in your db
```
at last...

```
change the "uploadPath" on backend/config.js to you correspondent path
```

### this is just to create admin user, login: root, pass: 123

## Access

http://localhost:8080

And thats all folks!
