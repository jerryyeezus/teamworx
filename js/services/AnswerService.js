/**
 * Created by yee on 3/15/15.
 */
/**
 * Created by yee on 3/1/15.
 */

myApp.factory('answer_service', ['$cookieStore', function($cookieStore) {
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

