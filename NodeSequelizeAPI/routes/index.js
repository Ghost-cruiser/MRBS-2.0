"use strict";

module.exports = function (router) {
    router.use(function (req, res, next) {
        console.log('Setting Headers');
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.setHeader('Access-Control-Allow-Headers', 'Authorization,content-type');
    
        next(); // make sure we go to the next routes and don't stop here
    });
    
    //fs.readdirSync("controllers").forEach(function (controllerName) {
    //    require("./controllers/" + controllerName)(app);
    //});

    require('./areas')(router);
    require('./users')(router);
    require('./rooms')(router);
    require('./entries')(router);

    };
