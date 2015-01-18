app.directive('contestantModal', ['$rootScope','EVENTS', 'CONTESTANT_MODAL_MODES', function($rootScope, EVENTS, CONTESTANT_MODAL_MODES) {
    return {
        restrict : 'A',
        templateUrl : 'view/contestantModal',
        controller : ['$scope', '$element', 'contestantFactory', 'selectionFactory', function($scope, $element, contestantFactory, selectionFactory) {
            $scope.visible = false;
            $scope.contestant = null;

            $scope.next = nextContestant;
            $scope.previous = previousContestant;

            $scope.close = function() {
                $scope.visible = false;
            };

            // listen to keyboard events
            angular.element(document.body).on('keydown', function(evt) {
                if (evt.keyCode === 27) return $scope.close();
                if (evt.keyCode === 37) return nextContestant();
                if (evt.keyCode === 39) return previousContestant();
            });

            // listen to scope events
            $rootScope.$on(EVENTS.CONTESTANT_MODAL.NEXT, nextContestant);
            $rootScope.$on(EVENTS.CONTESTANT_MODAL.PREVIOUS, previousContestant);
            $rootScope.$on(EVENTS.CONTESTANT_MODAL.SHOW, function(event, options) {
                if (!options.contestant) { return; }
                setContestant(options.contestant);
            });

            // TODO make single function
            function nextContestant() {
                if (!$scope.visible) return;

                // find index of location of current contestant
                var type = 'remaining';
                var index = _.findIndex(selectionFactory.remaining, {id: $scope.contestant.id});
                if (index < 0) {
                    type = 'selected';
                    index = _.findIndex(selectionFactory.selected, {id: $scope.contestant.id});
                }

                if (index < 0) return;

                var length = selectionFactory[type].length;
                setContestant(selectionFactory[type][(length + index - 1) % length]);
            }

            function previousContestant() {
                if (!$scope.visible) return;

                // find index of location of current contestant
                var type = 'remaining';
                var index = _.findIndex(selectionFactory.remaining, {id: $scope.contestant.id});
                if (index < 0) {
                    type = 'selected';
                    index = _.findIndex(selectionFactory.selected, {id: $scope.contestant.id});
                }

                if (index < 0) return;

                var length = selectionFactory[type].length;
                setContestant(selectionFactory[type][(length + index + 1) % length]);
            }

            function setContestant(contestant) {
                $scope.contestant = contestantFactory.findContestantById(contestant.id);

                // find mode/create callback
                $scope.visible = true;
                $element.find('.innerWrapper').scrollTop(0);
            };

        }]
    };
}]);
