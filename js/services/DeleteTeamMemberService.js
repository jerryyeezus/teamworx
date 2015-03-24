myApp.factory('delete_team_member_service', ['$cookieStore', function($cookieStore) {
    var _scope;
    var dragStudent = {};
    var dragTeam = {};
    var delTeamFlag = false;
    var delMemberFlag = false;
    var dragStudentRosterFlag = false;

    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty,
        getDragStudent: getDragStudent,
        setDragStudent: setDragStudent,
        getDragTeam: getDragTeam,
        setDragTeam: setDragTeam,
        getDelTeamFlag: getDelTeamFlag,
        setDelTeamFlag: setDelTeamFlag,
        getDelMemberFlag: getDelMemberFlag,
        setDelMemberFlag: setDelMemberFlag,
        getDragStudentRosterFlag: getDragStudentRosterFlag,
        setDragStudentRosterFlag: setDragStudentRosterFlag
    };

    function dirty() {
        return 'delete_team_member_dirty';
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

    function getDragTeam() {
        return dragTeam;
    };

    function setDragTeam(team) {
        dragTeam = team;
    };
    function setDelTeamFlag(flag) {
        delTeamFlag = flag;
    };

    function getDelTeamFlag() {
        return delTeamFlag;
    };

    function setDelMemberFlag(flag) {
        delMemberFlag = flag;
    };

    function getDelMemberFlag() {
        console.log(delMemberFlag);
        return delMemberFlag;
    };

    function getDragStudentRosterFlag() {
        return dragStudentRosterFlag;
    };

    function setDragStudentRosterFlag(flag) {
        dragStudentRosterFlag = flag;
    };
}]);
