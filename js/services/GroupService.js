myApp.factory('group_service', ['$cookieStore', function($cookieStore) {
    var groups = [];
    var group = [];
    var _scope;
    return {
        init: init,
        pushGroups: pushGroups,
        getCourses: getGroups,
        setCourses: setGroups,
        getGroup: getGroup,
        setGroup:setGroup,
        setDirty: setDirty,
        dirty: dirty
    };

    function pushGroups(group) {
        groups.push(group);
        $cookieStore.put('groups', groups);
        return groups;
    };
    function dirty() {
        return 'group_dirty';
    };

    function getGroups() {
        return groups;
    };

    function setGroups(gro) {
        $cookieStore.put('group', gro);
        groups = gro;
    };

    function getGroup() {
        return group;
    };

    function setGroup(gro) {
        group = gro;
    };
    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };
}]);
