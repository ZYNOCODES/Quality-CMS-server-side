require('dotenv').config();

const express = require('express');
const sequelize = require('./config/Database');
//error handler
const ErrorHandler = require('./controller/ErrorController');
//security
const cors = require('cors');
const limiter = require('./middleware/RateLimiting');
const validateRequest = require('./middleware/Sanitize');
//routes
const AuthRoutes = require('./route/AuthRoutes');


//http server
const http = require('http');
const port = process.env.PORT || 8080;

//express app
const app = express();
const server = http.createServer(app);

//midlewares
//cors
app.use(cors());
//static files
app.use('/files', express.static('./files'));
//body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
//RateLimiting
//app.use(limiter);
//Sanitize
app.use(validateRequest);

//routes
app.use('/auth', AuthRoutes);

//error handling
app.use(ErrorHandler);

// Disable logging of SQL queries
sequelize.options.logging = false;
//connect to db
sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
});