const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { connectDB } = require('./src/db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema')
const { authenticate } = require('./src/middleware/auth')
const cookieParser = require('cookie-parser')


// Execute the connectDB function to connect to our database
connectDB();

// Basic Middleware
const myLogger = function(req, res, next){
    console.log('myLogger middleware')
    console.log(req.path)
    next()
};


// Add Cookie Parser middleware BEFORE the authenticate
app.use(cookieParser())

app.use(myLogger);

// Add authentication middleware to the app
app.use(authenticate)

// Add graphql middleware to app
app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}))

app.set('view engine', 'ejs');
// Update the location of the folder for res.render views
app.set('views', path.join(__dirname, 'src/templates/views'));

// Set up middleware to parse form data and add to request body
app.use(express.urlencoded({extended: true}));

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });


// Import the function from routes module
const initRoutes = require('./src/routes');
// Execute the function with app as the argument
initRoutes(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});
