myApp.factory('add_project_service', ['$cookieStore', function() {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
    };

    function dirty() {
        return 'add_project_dirty';
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

}]);
