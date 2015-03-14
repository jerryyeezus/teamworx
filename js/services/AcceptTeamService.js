/**
 * Created by thangnguyen on 3/13/15.
 */
/**
 * Created by thangnguyen on 3/13/15.
 */
/**
 * Created by thangnguyen on 3/13/15.
 */
myApp.factory('accept_team_service', ['$cookieStore', function($cookieStore) {
    var _scope;
    return {
        init: init,
        setDirty: setDirty,
        dirty: dirty
    };

    function dirty() {
        return 'accept_team_dirty';
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

}]);
