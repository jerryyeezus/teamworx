/**
 * Created by thangnguyen on 3/13/15.
 */
myApp.factory('delete_group_service', ['$cookieStore', function($cookieStore) {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
    };

    function dirty() {
        return 'delete_team_dirty';
    }

    function init(scope) {
        _scope = scope;
    }

    function setDirty() {
        _scope.$emit(dirty());
    }

}])
