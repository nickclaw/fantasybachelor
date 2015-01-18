app.factory('selectionFactory', [
    'contestantFactory',
    'weeksFactory',
    'backendFactory',
    '$q',
    function(contestantFactory, weeksFactory, backendFactory, $q) {

        var week;
        var factory = {
            selected: [],
            remaining: []
        };

        factory.promise = $q.all([
            contestantFactory.promise,
            weeksFactory.promise
        ]).then(function(data) {
            factory.setWeekById(weeksFactory.getCurrentWeekId());
        });


        /**
         * Set the current week
         */
        factory.setWeekById = function(id) {
            week = weeksFactory.getWeekById(id);
            factory.selected = week.selectedContestants;
            factory.remaining = week.remainingContestants;
        };

        /**
         * Select a remainging contestant by their id
         * @param {Integer} id
         * @return {$http} request
         */
        factory.selectContestantById = function(id) {

            // don't allow if there's no space
            if (week.selectedContestants.length >= week.numberOfSelections) return;

            // find index of contestant to add
            var index = _.findIndex(factory.remaining, {id: id});
            if (index < 0) return;

            // move contestant object
            var contestantObj = factory.remaining[index];
            factory.selected.push(contestantObj);
            factory.remaining.splice(index, 1);

            // fire request
            return backendFactory.selectContestant(week.id, contestantObj.id);
        };

        /**
         * Remove a selected contestant by their id
         * @param {Integer} id
         * @return {$http} request
         */
        factory.removeContestantById = function(id) {
            // find index of contestant to add
            var index = _.findIndex(factory.selected, {id: id});
            if (index < 0) return;

            // move contestant object
            var contestantObj = factory.selected[index];
            factory.remaining.push(contestantObj);
            factory.selected.splice(index, 1);

            // fire request
            return backendFactory.removeContestant(week.id, contestantObj.id)
        };

        return factory;
    }
]);
