myApp.factory('add_requester_service', ['$cookieStore', function($cookieStore) {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
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
}]);
