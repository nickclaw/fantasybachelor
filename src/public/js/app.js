var app = angular.module('FantasyBach', ['ngRoute']);

app.run(['$rootScope', '$q', 'userFactory', 'weeksFactory', 'contestantFactory', 'routeFactory', 'selectionFactory','routeValidatorFactory', 'unauthorizedInterceptor', function($rootScope, $q, userFactory, weeksFactory, contestantFactory, routeFactory, selectionFactory, routeValidatorFactory, unauthorizedInterceptor) {
    $q.all([userFactory.promise, userFactory.aliasPromise, contestantFactory.promise, weeksFactory.promise, selectionFactory.promise]).then(function(data) {
        console.log('All loaded and good to go!');
        $rootScope.appLoaded = true;
        routeFactory.goToWeek();
    });
}]);

app.run(function() {
    FastClick.attach(document.body);
});
