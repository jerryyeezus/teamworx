myApp.factory('delete_requester_service', ['$cookieStore', function() {
    var _scope;
    var currentRequester = {};
    var delMemberFlag = false;
    var deleteRequesterFlag = false;
    var myTeam = {};
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty,
        getCurrentRequester: getCurrentRequester,
        setCurrentRequester: setCurrentRequester,
        getDelMemberFlag: getDelMemberFlag,
        setDelMemberFlag: setDelMemberFlag,
        getDeleteRequesterFlag: getDeleteRequesterFlag,
        setDeleteRequesterFlag: setDeleteRequesterFlag,
        setMyTeam: setMyTeam,
        getMyTeam: getMyTeam
    };

    function dirty() {
        return 'delete_requester_dirty';
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

    function setCurrentRequester(mem) {
        currentRequester = mem;
    };

    function getCurrentRequester() {
        return currentRequester;
    };

    function setDelMemberFlag(flag) {
        delMemberFlag = flag;
    };

    function getDelMemberFlag() {
        return delMemberFlag;
    };

    function setDeleteRequesterFlag(flag) {
        deleteRequesterFlag = flag;
    };

    function getDeleteRequesterFlag() {
        return deleteRequesterFlag;
    };

    function setMyTeam(team) {
        myTeam = team;
    };

    function getMyTeam() {
        return myTeam;
    };
}]);
