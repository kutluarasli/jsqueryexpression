/// <reference path="../jsqe.js" />
/// <reference path="http://code.jquery.com/qunit/git/qunit.js"/>
/// <reference path="http://code.jquery.com/jquery-latest.js"/>

$(document).ready(function () {
    test('should create order expression', should_create_order);
    test('should throw error when attributeName is empty', should_throw_error_when_attributeName_is_empty);
    test('should throw error when direction is invalid', should_throw_error_when_direction_is_invalid);
    test('should have default direction asc when not specified', should_have_default_direction_asc_when_not_specified);
    test('should generate order statement', should_generate_order_statement);
});

function should_create_order() {
    var attributeName = 'myAtt';
    var orderObj = jsqe.orderBy(attributeName, jsqe.options.orderDirection.asc);
    equal(orderObj.getAttribute(), attributeName);
    equal(orderObj.getDirection(), jsqe.options.orderDirection.asc);
}

function should_throw_error_when_attributeName_is_empty() {
    raises(function () {
        var orderObj = jsqe.orderBy('', jsqe.options.orderDirection.asc);
        ok(orderObj);
    });
}

function should_throw_error_when_direction_is_invalid() {
    raises(function () {
        var orderObj = jsqe.orderBy('test', 'testvalue');
        ok(orderObj);
    });
}

function should_have_default_direction_asc_when_not_specified() {
    var orderObj = jsqe.orderBy('myAttribute');
    equal(orderObj.getDirection(), jsqe.options.orderDirection.asc);
}

function should_generate_order_statement() {
    var attributeName = 'myAttribute';
    var orderObj = jsqe.orderBy(attributeName);
    var actual = orderObj.generateOrderBy();
    var expected = attributeName + ' ' + jsqe.options.orderDirection.asc;
    equal(actual, expected);
}

