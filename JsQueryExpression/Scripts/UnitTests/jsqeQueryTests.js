/// <reference path="../jsqe.js" />
/// <reference path="http://code.jquery.com/qunit/git/qunit.js"/>
/// <reference path="http://code.jquery.com/jquery-latest.js"/>

var ROOT_URI = 'http://srvcrmdev01/Organization/XRMServices/2011/OrganizationData.svc';
var RESOURCE_NAME = 'ProductSet';

$(document).ready(function () {
    test('addOrdersAsc should add new asc orderBy', addOrdersAsc_should_add_new_asc_orderBy);
    test('addOrdersDesc should add new desc orderBy', addOrdersDesc_should_add_new_desc_orderBy);
    test('addOrder should accept string parameter', addOrder_should_accept_string_parameter);
    test('addOrder throws error when sortExpression is null', addOrder_should_thow_error_when_not_specified);
    test('setFilter throws error when filterexpression is null', setFilter_should_throw_error_when_filter_is_null);
    test('setFilter shoud simply set filterexpression', setFilter_should_simply_set_filter);
    test('addExpand throws error when expand is null or empty', addExpand_should_throw_error_when_expand_is_null_or_empty);
    test('addExpand shoud simply add an expand to array', addExpand_should_simply_add_a_expand_to_array);
    test('addSelect throws error when select is null or empty', addSelect_should_throw_error_when_select_is_null_or_empty);
    test('addSelect shoud simply add an select to array', addSelect_should_simply_add_a_select_to_array);
    test('addSelects shoud accept select array', addSelects_should_accept_select_array)
    test('addCustomQueryOption throws error when key is null or empty', addCustomQueryOption_throws_error_when_key_is_null_or_empty);
    test('addCustomQueryOption should simply add an key-value pair', addCustomQueryOption_should_simply_add_an_key_value_pair);
    test('setTop should throw error when an alphabetic parameter is passed', setTop_should_throw_error_when_an_alphabetic_parameter_is_passed);
    test('setTop should throw error when value less than 1', setTop_should_throw_error_when_value_is_less_then_one);
    test('setTop should simply set top attribute', setTop_should_simply_set_top_attribute);
    test('setSkip should throw error when an alphabetic parameter is passed', setSkip_should_throw_error_when_an_alphabetic_parameter_is_passed);
    test('setSkip should throw error when value less than 0', setSkip_should_throw_error_when_value_is_less_then_zero);
    test('setSkip should simply set skip attribute', setSkip_should_simply_set_top_attribute);
    test('setformat should throw error when invalid value is set', setFormat_should_throw_error_when_invalid_value_is_set);
    test('setformat should accept valid values', setFormat_should_accept_valid_values);
    test('setInlineCount should throw error when invalid value is set', setInlineCount_should_throw_error_when_invalid_value_is_set);
    test('setInlineCount should accept valid values', setInlineCount_should_accept_valid_values);
});

$(document).ready(function () {
    test('should generate basic URI', should_generate_basic_uri);
    test('should generate orders', should_generate_orders);
    test('should generate top', should_generate_top);
    test('should generate skip', should_generate_skip);
    test('should generate expand', should_generate_expand);
    test('should generate format', should_generate_format);
    test('should generate select', should_generate_select);
    test('should generate inlinecount', should_generate_inlinecount);
    test('should generate uri with filters and orders', should_generate_uri_with_filters_and_orders);
});


function addOrdersAsc_should_add_new_asc_orderBy() {
    var query = jsqe.query('testorganization', 'myresource');
    query.addOrdersAsc('att1', 'att2');
    var orders = query.getOrders();
    equal(orders.length, 2);
    equal(orders[0].getDirection(), jsqe.options.orderDirection.asc);
}

function addOrdersDesc_should_add_new_desc_orderBy() {
    var query = jsqe.query('testorganization', 'myresource');
    query.addOrdersDesc('att1', 'att2');
    var orders = query.getOrders();
    equal(orders.length, 2);
    equal(orders[0].getDirection(), jsqe.options.orderDirection.desc);
}

function addOrder_should_accept_string_parameter() {
    var query = jsqe.query('testorganization', 'myresource');
    var order = jsqe.orderBy('myAttribute');
    query.addOrder(order);
    var sortings = query.getOrders();
    equal(sortings.length, 1, 'should already have added a sort expression');
    var newSorting = sortings[0];
    equal(newSorting.getAttribute(), 'myAttribute', 'sort expression not created properly');
}

function addOrder_should_thow_error_when_not_specified() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addOrder(null);
    });
}

function setFilter_should_throw_error_when_filter_is_null() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addFilter(null);
    });
}

function setFilter_should_simply_set_filter() {
    var filter = jsqe.filter('myproperty eq 1', jsqe.options.filterOperator.and);
    var query = jsqe.query('testorganization', 'myresource');
    query.setFilter(filter);
    var newFilter = query.getFilter();
    deepEqual(newFilter, filter, 'new filter expression not properly set');
}

function addExpand_should_throw_error_when_expand_is_null_or_empty() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addExpand(null);
    });
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addExpand('');
    });
}

function addExpand_should_simply_add_a_expand_to_array() {
    var expand = 'mynavigationproperty';
    var query = jsqe.query('testorganization', 'myresource');
    query.addExpand(expand);
    var expands = query.getExpands();
    equal(expands.length, 1, 'should already have added a expand');
    var newExpand = expands[0];
    equal(newExpand, expand, 'new expand not properly added');
}

function addSelect_should_throw_error_when_select_is_null_or_empty() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addSelect(null);
    });
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addSelect('');
    });
}

function addSelect_should_simply_add_a_select_to_array() {
    var select = 'myProperty';
    var query = jsqe.query('testorganization', 'myresource');
    query.addSelect(select);
    var selects = query.getSelects();
    equal(selects.length, 1, 'should already have added a select');
    var newSelect = selects[0];
    equal(newSelect, select, 'new select not properly added');
}

function addSelects_should_accept_select_array() {
    var selectsToBeAdded = ['property1', 'property2', 'property2'];
    var query = jsqe.query('testorganization', 'myresource');
    query.addSelects(selectsToBeAdded);
    var selects = query.getSelects();
    equal(selects.length, selectsToBeAdded.length, 'should contain all array elements');
}

function addCustomQueryOption_throws_error_when_key_is_null_or_empty() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addCustomQueryOption(null, '');
    });
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.addCustomQueryOption('', '');
    });
}

function addCustomQueryOption_should_simply_add_an_key_value_pair() {
    var key = 'myKey';
    var value = 'myValue';
    var query = jsqe.query('testorganization', 'myresource');
    query.addCustomQueryOption(key, value);
    var customQueryOptions = query.getCustomerQueryOptions();
    equal(customQueryOptions.length, 1, 'should contain an item in array')
    var newCustomQueryOption = customQueryOptions[0];
    equal(newCustomQueryOption._key, key, 'key not set properly');
    equal(newCustomQueryOption._value, value, 'value not set properly');
}

function setTop_should_throw_error_when_an_alphabetic_parameter_is_passed() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setTop('test');
    });
}

function setTop_should_throw_error_when_value_is_less_then_one() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setTop(0);
    });
}

function setTop_should_simply_set_top_attribute() {
    var top = 50;
    var query = jsqe.query('testorganization', 'myresource');
    query.setTop(top);
    var newValue = query.getTop();
    equal(newValue, top, 'top attribute not set properly');
}

function setSkip_should_throw_error_when_an_alphabetic_parameter_is_passed() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setSkip('test');
    });
}

function setSkip_should_throw_error_when_value_is_less_then_zero() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setSkip(-1);
    });
}

function setSkip_should_simply_set_top_attribute() {
    var skip = 10;
    var query = jsqe.query('testorganization', 'myresource');
    query.setSkip(skip);
    var newValue = query.getSkip();
    equal(newValue, skip, 'skip attribute not set properly');
}


function setFormat_should_throw_error_when_invalid_value_is_set() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setFormat('unrelatedvalue');
    });
}

function setFormat_should_accept_valid_values() {
    var query = jsqe.query('testorganization', 'myresource');
    query.setFormat(jsqe.options.format.atom);
    var newValue = query.getFormat();
    equal(newValue, jsqe.options.format.atom);
    query.setFormat(jsqe.options.format.json);
    newValue = query.getFormat();
    equal(newValue, jsqe.options.format.json);
}

function setInlineCount_should_throw_error_when_invalid_value_is_set() {
    raises(function () {
        var query = jsqe.query('testorganization', 'myresource');
        query.setInlineCount('unrelatedvalue');
    });
}

function setInlineCount_should_accept_valid_values() {
    var query = jsqe.query('testorganization', 'myresource');
    query.setInlinecount(jsqe.options.inlineCount.allpages);
    var newValue = query.getInlinecount();
    equal(newValue, jsqe.options.inlineCount.allpages);
    query.setInlinecount(jsqe.options.inlineCount.none);
    newValue = query.getInlinecount();
    equal(newValue, jsqe.options.inlineCount.none);
}


function should_generate_basic_uri() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    var actual = query.generateUri();
    var expected = ROOT_URI + '/' + RESOURCE_NAME;
    equal(actual, expected);
    var rootUriWhichEndsWithSlash = ROOT_URI + '/';
    query = jsqe.query(rootUriWhichEndsWithSlash, RESOURCE_NAME);
    actual = query.generateUri();
    equal(actual, expected, 'generation can not handle root Uri s which ends with a slash');
}

function should_generate_orders() {
    var order1 = jsqe.orderBy('MyAttribute');
    var order2 = jsqe.orderBy('MyAttribute2', jsqe.options.orderDirection.desc);
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addOrder(order1);
    query.addOrder(order2);
    var actual = query._generateOrders();
    var expected = '$orderby=MyAttribute asc, MyAttribute2 desc';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addOrder(order1);
    actual = query._generateOrders();
    expected = '$orderby=MyAttribute asc';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateOrders();
    expected = '';
    equal(actual, expected);
}

function should_generate_top() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.setTop(10);
    var actual = query._generateTop();
    var expected = '$top=10';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateTop();
    expected = '';
    equal(actual, expected);
}


function should_generate_skip() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.setSkip(10);
    var actual = query._generateSkip();
    var expected = '$skip=10';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateSkip();
    expected = '';
    equal(actual, expected);
}


function should_generate_expand() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addExpand('property1');
    var actual = query._generateExpand();
    var expected = '$expand=property1';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addExpand('property1');
    query.addExpand('property2');
    actual = query._generateExpand();
    expected = '$expand=property1, property2';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateSkip();
    expected = '';
    equal(actual, expected);
}

function should_generate_format() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.setFormat(jsqe.options.format.atom);
    var actual = query._generateFormat();
    var expected = '$format=atom';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateFormat();
    expected = '';
    equal(actual, expected);
}

function should_generate_select() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addSelect('property1');
    var actual = query._generateSelect();
    var expected = '$select=property1';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.addSelect('property1');
    query.addSelect('property2');
    actual = query._generateSelect();
    expected = '$select=property1, property2';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateSelect();
    expected = '';
    equal(actual, expected);
}

function should_generate_inlinecount() {
    var query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    query.setInlinecount(jsqe.options.inlineCount.allpages);
    var actual = query._generateInlinecount();
    var expected = '$inlinecount=allpages';
    equal(actual, expected);

    query = jsqe.query(ROOT_URI, RESOURCE_NAME);
    actual = query._generateInlinecount();
    expected = '';
    equal(actual, expected);
}

function should_generate_uri_with_filters_and_orders() {
    var filter = jsqe.filter('balance gt (100)').addCondition('type eq (1)');

    var query = jsqe.query('http://myserver', 'accounts');
    query.addOrdersAsc('name').addOrdersDesc('createDate').setFilter(filter);

    var actual = query.generateUri();
    var expected = 'http://myserver/accounts?$orderby=name asc, createDate desc&$filter=(balance gt (100)) and (type eq (1))';
    equal(actual, expected);
}