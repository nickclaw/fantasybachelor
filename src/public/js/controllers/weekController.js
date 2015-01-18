app.controller('weekController', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$interval',
    'EVENTS',
    'CONTESTANT_MODAL_MODES',
    'weeksFactory',
    'backendFactory',
    'routeFactory',
    'selectionFactory',
function($rootScope, $scope, $routeParams, $interval, EVENTS, CONTESTANT_MODAL_MODES, weeksFactory, backendFactory, routeFactory, selectionFactory) {
    console.log($routeParams);
    console.log(selectionFactory);

    $rootScope.showHeaderFooter = true;
    $scope.week = weeksFactory.getWeekById(parseInt($routeParams.weekId)) || weeksFactory.getCurrentWeek();
    $scope.selectionRange = _.range(0, $scope.week.numberOfSelections);
    selectionFactory.setWeekById($scope.week.id);

    $scope.isEliminated = function(contestant) {
        return _.findWhere($scope.week.eliminatedContestants, contestant);
    };

    $scope.selectedContestantClicked = function(contestant, multiplier) {
        var mode;
        if (!$scope.week.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else {
            mode = CONTESTANT_MODAL_MODES.REMOVABLE;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            callback : function() {
                selectionFactory.removeContestantById(contestant.id);
            }
        })
    };

    $scope.remainingContestantClicked = function(contestant, multiplier) {
        var mode;
        if (!$scope.week.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else if ($scope.week.selectedContestants.length < $scope.week.numberOfSelections) {
            mode = CONTESTANT_MODAL_MODES.CHOOSABLE;
        } else {
            mode = CONTESTANT_MODAL_MODES.SELECTION_FULL;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            callback : function() {
                selectionFactory.selectContestantById(contestant.id);
            }
        })
    };

    $scope.updateTimeRemaining = function() {
        weeksFactory.updateWeekAttributes($scope.week);
    };

    $scope.timeRemainingInterval = $interval($scope.updateTimeRemaining, 1000);

    $scope.$on('$destroy', function() {
        if ($scope.timeRemainingInterval) {
            $interval.cancel($scope.timeRemainingInterval);
            $scope.timeRemainingInterval = undefined;
        }
    });

    $scope.goToCurrentWeek = function() {
        routeFactory.goToWeek();
    }
}]);
