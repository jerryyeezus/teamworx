myApp.factory('answer_service', ['$cookieStore', function() {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
    };

    function init(scope) {
        _scope = scope;
    }

    function dirty() {
        return 'answer_dirty';
    }

    function setDirty() {
        _scope.$emit(dirty());
    }
}]);

