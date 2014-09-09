#!/bin/env node
//  OpenShift sample Node application

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

// These are the new imports we're adding:
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');


var index_routes = require('./routes/index');
var auth_routes = require('./routes/auth');








/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8081;
        self.express_secret = process.env.EXPRESS_SECRET || Hha8Ayro3HoQ;
        self.tmpfolder = process.env.OPENSHIFT_DATA_DIR + '/tmp' || './tmp';

        // default to a 'localhost' configuration:
        self.mongo_connection_string = 'admin:'+ process.env.MONGO_PWD +'@127.0.0.1:27017/thelooks';

        // if OPENSHIFT env variables are present, use the available connection info:
        if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
          self.mongo_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
        }

        
        


        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "0.0.0.0";
        }
    };


    
    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    

    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    

    /**
     *  Initialize the server (express)
     */
    self.initializeServer = function() {
       
        self.app = express();

        // Here is what we're adding:
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

self.app.use(function (req, res, next) {
        if (req.headers['x-forwarded-proto'] == 'http') {
            console.log("Hello World");
            res.redirect('https://' + req.headers.host + req.path);
        } else {
            return next();
        }
});

self.app.set('view engine', 'jade');

self.app.use(favicon());
self.app.use(logger('dev'));
self.app.use(bodyParser.json());
self.app.use(bodyParser.urlencoded());
self.app.use(cookieParser());
self.app.use(require('stylus').middleware(path.join(__dirname, 'public')));
self.app.use(express.static(path.join(__dirname, 'public')));

// Stuff we're adding:
self.app.use(session({
  secret: self.express_secret,
  key: 'sid',
  cookie: {secure: false},
  saveUninitialized: true,
  resave: true
}));
self.app.use(passport.initialize());
self.app.use(passport.session());
self.app.use(flash());
self.app.use(multer({ dest: self.tmpfolder}));



self.app.set('views', path.join(__dirname, 'views'));



self.app.use('/', auth_routes);
self.app.use('/', index_routes);

//establish connection to mongoose
console.log(self.mongo_connection_string);
mongoose.connect('mongodb://' + self.mongo_connection_string);



 };



   


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
