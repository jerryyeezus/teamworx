myApp.factory('question_service', ['$cookieStore', function($cookieStore) {
    var questions = [];
    var _scope;
    return {
        init: init,
        pushQuestions: pushQuestions,
        getQuestions: getQuestions,
        setQuestions: setQuestions,
        setDirty: setDirty,
        dirty: dirty
    };

    function pushQuestions(question) {
        questions.push(question);
        $cookieStore.put('questions', questions);
        return questions;
    };

    function dirty() {
        return 'question_dirty';
    };

    function getQuestions() {
        return questions;
    };

    function setQuestions(que) {
        questions = que;
    };

    function init(scope) {
        _scope = scope;
    };

    function setDirty() {
        _scope.$emit(dirty());
    };

}]);