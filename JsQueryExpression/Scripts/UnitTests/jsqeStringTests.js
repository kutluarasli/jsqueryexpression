/// <reference path="../jsqe.js" />
/// <reference path="http://code.jquery.com/qunit/git/qunit.js"/>
/// <reference path="http://code.jquery.com/jquery-latest.js"/>

$(document).ready(function () {
    test('should detect if text is emtpy', should_detect_if_text_is_emtpy)
    test('should trim text', should_trim_text);
    test('should validate if text is in list', should_validate_if_text_is_in_list);
});

function should_detect_if_text_is_emtpy() {
    var text = '    ';
    var actual = jsqe.strings.isEmpty(text);
    equal(actual, true);
    text = 'test';
    actual = jsqe.strings.isEmpty(text);
    equal(actual, false);
    text = null;
    actual = jsqe.strings.isEmpty(text);
    equal(actual, true);
}

function should_trim_text() {
    var expected = 'test';
    var text = ' test';
    var actual = jsqe.strings.trim(text);
    equal(actual, expected);

    text = 'test ';
    actual = jsqe.strings.trim(text);
    equal(actual, expected);

    text = '  test ';
    actual = jsqe.strings.trim(text);
    equal(actual, expected);
}

function should_validate_if_text_is_in_list() {
    var text = jsqe.options.format.atom;
    var actual = jsqe.strings.isInList(text, jsqe.options.format.atom, jsqe.options.format.json);
    equal(actual, true);

    text = 'unrelatedata';
    actual = jsqe.strings.isInList(text, jsqe.options.format.atom, jsqe.options.format.json);
    equal(actual, false);
}