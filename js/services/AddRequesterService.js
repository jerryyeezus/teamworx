myApp.factory('add_requester_service', ['$cookieStore', function() {
    var _scope;
    var currentRequester = {};
    var deleteRequesterFlag = false;
    var myTeam = {};
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty,
        setCurrentRequester: setCurrentRequester,
        getCurrentRequester: getCurrentRequester,
        setDeleteRequesterFlag: setDeleteRequesterFlag,
        getDeleteRequesterFlag: getDeleteRequesterFlag,
        setMyTeam : setMyTeam,
        getMyTeam : getMyTeam
    };

    function dirty() {
        return 'add_requester_dirty';
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

    function setCurrentRequester(req) {
        currentRequester = req;
    };
    function getCurrentRequester() {
        return currentRequester;
    }

    function getDeleteRequesterFlag() {
        return deleteRequesterFlag;
    };

    function setDeleteRequesterFlag(flag) {
        deleteRequesterFlag = flag;
    };

    function getMyTeam() {
        return myTeam;
    };

    function setMyTeam(team) {
        myTeam = team;
    }
}]);
