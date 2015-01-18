app.directive('contestant', ['contestantFactory', function(contestantFactory) {
    return {
        restrict : 'A',
        templateUrl : 'view/contestant',
        scope : {
            contestant : '=',
            showScore : '=',
            eliminated : '=',
            callback : '='
        },
        controller : ['$scope', function($scope) {
            $scope.$watch('contestant', function() {
                $scope.contestant = contestantFactory.findContestantById($scope.contestant.id);
            });
        }]
    };
}]);
