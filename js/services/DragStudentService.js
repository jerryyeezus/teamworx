/**
 * Created by thangnguyen on 3/13/15.
 */
myApp.factory('drag_student_service', ['$cookieStore', function($cookieStore) {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
    };

    function dirty() {
        return 'drag_student_dirty';
    }

    function init(scope) {
        _scope = scope;
    }

    function setDirty() {
        _scope.$emit(dirty());
    }

}])
