myApp.factory('drag_student_service', ['$cookieStore', function() {
    var _scope;
    var dragStudent = {};
    var dropTeam = {};
    var dragTeam = {};
    var sameTeamFlag = false;

    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty,
        getDragStudent: getDragStudent,
        setDragStudent: setDragStudent,
        getDropTeam: getDropTeam,
        setDropTeam: setDropTeam,
        getDragTeam: getDragTeam,
        setDragTeam: setDragTeam,
        getSameTeamFlag: getSameTeamFlag,
        setSameTeamFlag: setSameTeamFlag
    };

    function dirty() {
        return 'drag_student_dirty';
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

    function getDragStudent() {
        return dragStudent;
    };
    function setDragStudent(student) {
        dragStudent = student;
    };
    function setDropTeam(team) {
        dropTeam = team;
    };
    function getDropTeam() {
        return dropTeam;
    };
    function setDragTeam(team) {
        dragTeam = team;
    };
    function getDragTeam() {
        return dragTeam;
    };
    function getSameTeamFlag() {
        return sameTeamFlag;
    };
    function setSameTeamFlag(flag) {
        sameTeamFlag = flag;
    };

}]);
