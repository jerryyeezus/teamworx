/**
 * Created by yee on 3/1/15.
 */

myApp.factory('group_service', ['$cookieStore', function($cookieStore) {
    var groups = [];
    var _scope;
    return {
        init: init,
        pushGroups: pushGroups,
        getCourses: getGroups,
        setCourses: setGroups,
        setDirty: setDirty,
        dirty: dirty
    };

    function pushGroups(group) {
        groups.push(group);
        $cookieStore.put('groups', groups);
        return groups;
    }
    function dirty() {
        return 'group_dirty';
    }

    function getGroups() {
        return groups;
    }

    function setGroups(gro) {
        groups = gro;
    }

    function init(scope) {
        _scope = scope;
    }

    function setDirty() {
        _scope.$emit(dirty());
    }

}]);
