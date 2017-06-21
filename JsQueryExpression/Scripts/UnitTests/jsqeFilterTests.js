/// <reference path="../jsqe.js" />
/// <reference path="http://code.jquery.com/qunit/git/qunit.js"/>
/// <reference path="http://code.jquery.com/jquery-latest.js"/>

$(document).ready(function () {
    test('should create filter expression', should_create_filter);
    test('should add condition', should_add_condition);
    test('should throw error when condition is empty', should_throw_error_when_condition_is_empty);
    test('should add filter', should_add_filter);
    test('should throw error when filter is empty', should_throw_error_when_filter_is_empty);
    test('should set operator', should_set_operator);
    test('should set default operator and', should_set_default_operator_and);
    test('should geneate simple condition', should_generate_simple_condition);
    test('should geneate complex condition', should_generate_complex_condition);
    test('should generate sub filter', should_generate_sub_filter);
    test('should generate full filter', should_generate_full_filter);
});

function should_create_filter() {
    var condition = 'my eq 1';
    var filterObj = jsqe.filter(condition, jsqe.options.filterOperator.and);
    var conditions = filterObj.getConditions();
    var newCondition = conditions[0];
    equal(newCondition, condition);

    var newOperator = filterObj.getOperator();
    equal(newOperator, jsqe.options.filterOperator.and);
}

function should_add_condition() {
    var condition1 = 'my eq 1';
    var condition2 = 'my2 eq 2';
    var filterObj = jsqe.filter(condition1, jsqe.options.filterOperator.and);
    filterObj.addCondition(condition2);

    var conditions = filterObj.getConditions();
    equal(conditions.length, 2);
}

function should_throw_error_when_condition_is_empty() {
    var filterObj = null;
    raises(function () {
        filterObj = jsqe.filter(null, jsqe.options.filterOperator.and);
    });

    raises(function () {
        var condition = 'my eq 1';
        filterObj = jsqe.filter(condition, jsqe.options.filterOperator.and);
        filterObj.addCondition(null);
    });
}

function should_set_operator() {
    var condition = 'my eq 1';
    var filterObj = jsqe.filter(condition, jsqe.options.filterOperator.and);
    filterObj.setOperator(jsqe.options.filterOperator.or);
    var newOperator = filterObj.getOperator();
    equal(newOperator, jsqe.options.filterOperator.or);
}

function should_set_default_operator_and() {
    var condition = 'my eq 1';
    var filterObj = jsqe.filter(condition);
    var actual = filterObj.getOperator();
    equal(actual, jsqe.options.filterOperator.and);
}
    
function should_add_filter() {
    var condition1 = 'my eq 1';
    var condition2 = 'my2 eq 2';
    var filterObj = jsqe.filter(condition1, jsqe.options.filterOperator.and);
    filterObj.addFilter(jsqe.filter(condition2, jsqe.options.filterOperator.or));
    var subFilters = filterObj.getFilters();
    equal(subFilters.length, 1);
}

function should_throw_error_when_filter_is_empty() {
    raises(function () {
        var condition = 'my eq 1';
        exp = jsqe.filter(condition, jsqe.options.filterOperator.and);
        exp.addFilter(null);
    });

}

function should_generate_simple_condition() {
    var condition = 'my eq 1';
    var exp = jsqe.filter(condition, jsqe.options.filterOperator.and);
    var actual = exp._generateConditions();
    var expected = '(' + condition + ')';
    equal(actual, expected);
}

function should_generate_complex_condition() {
    var condition1 = 'my eq 1';
    var condition2 = 'my2 eq 2';
    var filterObj = jsqe.filter(condition1, jsqe.options.filterOperator.and);
    filterObj.addCondition(condition2);
    var actual = filterObj._generateConditions();
    var expected = '(' + condition1 + ') and (' + condition2 + ')';
    equal(actual, expected);
}

function should_generate_sub_filter() {
    var condition1 = 'my eq 1';
    var condition2 = 'my2 eq 2';
    var condition3 = 'my3 eq 3';
    var subFilter = jsqe.filter(condition2, jsqe.options.filterOperator.or);
    subFilter.addCondition(condition3);
    var filterObj = jsqe.filter(condition1, jsqe.options.filterOperator.and);
    filterObj.addFilter(subFilter);
    var actual = filterObj._generateFilters();
    var expected = '((' + condition2 + ') or (' + condition3 + '))';
    equal(actual, expected);
}

function should_generate_full_filter() {
    var condition1 = 'my eq 1';
    var condition2 = 'my2 eq 2';
    var condition3 = 'my3 eq 3';
    var subFilter = jsqe.filter(condition2, jsqe.options.filterOperator.or);
    subFilter.addCondition(condition3);
    var filterObj = jsqe.filter(condition1, jsqe.options.filterOperator.and);
    filterObj.addFilter(subFilter);
    var actual = filterObj.generateFilter();
    var expected = '(' + condition1 + ') and ((' + condition2 + ') or (' + condition3 + '))';
    equal(actual, expected);
}