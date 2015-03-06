/**
 * Created by yee on 3/1/15.
 */

myApp.factory('portal_service', ['$cookieStore', function($cookieStore) {
    var course_list = [];
    var _scope;
    return {
        init: init,
        getCourses: getCourses,
        setCourses: setCourses,
        setDirty: setDirty,
        dirty: dirty
    };

    function dirty() {
        return 'portal_dirty';
    }

    function getCourses() {
        return course_list;
    }

    function setCourses(courses) {
        course_list = courses;
    }

    function init(scope) {
        _scope = scope;
    }

    function setDirty() {
        _scope.$emit(dirty());
    }

}])
