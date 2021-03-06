myApp.factory('ass_service', ['$cookieStore', function($cookieStore) {
    var assignments = [];

    var assignment = [];

    var which_assignment = -1;

    var assignment_pk = -1;

    var isUploaded = false;


    var _scope;
    return {
        init: init,
        getAssignments: getAssignments,
        getAssignment: getAssignment,
        getWhichAssignment: getWhichAssignment,
        getAssignmentpk: getAssignmentpk,
        getIsUploaded: getIsUploaded,
        setIsUploaded: setIsUploaded,
        setAssignmentpk: setAssignmentpk,
        pushAssignment: pushAssignment,
        setAssignments: setAssignments,
        setAssignment: setAssignment,
        setWhichAssignment: setWhichAssignment,
        assInvalidate: assInvalidate,
        setDirty: setDirty,
        dirty: dirty
    };

    function init(scope) {
        _scope = scope;
    }

    function dirty() {
        return 'ass_dirty';
    }

    function setDirty() {
        _scope.$emit(dirty());
    }

    function setAssignments(the_assignments) {
        $cookieStore.put('assignments', the_assignments);
        assignments = the_assignments;
    }

    function pushAssignment(assignment) {
        assignments.push(assignment);
        $cookieStore.put('assignments', assignments);
        setWhichAssignment(assignment.assignment_number);
        setAssignmentpk(assignment.pk);
        return assignments;
    }
    function getAssignments() {
        return assignments;
    }
    function getAssignmentpk() {
        return assignment_pk;
    }
    function setAssignmentpk(ass_pk) {
        $cookieStore.put('assignment_pk', ass_pk);
        assignment_pk = ass_pk;
    }
    function getWhichAssignment() {
        return which_assignment;
    }

    function assInvalidate() {
        _scope.$emit('ass_invalidate');
    }

    function setAssignment(the_assignment) {
        $cookieStore.put('assignment', the_assignment);
        assignment = the_assignment;
    }

    function getAssignment() {
        return assignment;
    }

    function setIsUploaded(uploaded) {
        isUploaded = uploaded;
    }
    function getIsUploaded() {
        return isUploaded;
    }
    function setWhichAssignment(in_which_assignment) {
        $cookieStore.put('which_assignment', in_which_assignment);
        which_assignment = in_which_assignment;
    }
}]);
