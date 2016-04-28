module.exports = function (grunt) {

    grunt.initConfig({
        concatShared: {
            dist: {
                src: [
                    
                    "js/shared/datetime/datetime.js",
                    "js/shared/datetime/datetime.month.js",
                    "js/shared/datetime/datetime.calcul.js",
                    "js/shared/datetime/datetime.french.js",
                    "js/shared/datetime/datetime.Time.js",
                    "js/shared/datetime/datetime.datetimeFactory.js",


                    "js/shared/navigation/navigation.js",
                    "js/shared/navigation/nwNavigationMenuDirective.js",


                    "js/shared/settings/settings.js",
                    "js/shared/settings/settings.LocationService.js",
                    "js/shared/settings/settings.PeriodicityService.js",

                    
                    "js/shared/shared.js",
                    "js/shared/shared.ContextService.js",
                    "js/shared/shared.AreaService.js",
                    "js/shared/shared.NotificationService.js",
                ],



                dest: 'temp/mrbs-2.0.shared.js'
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);

};