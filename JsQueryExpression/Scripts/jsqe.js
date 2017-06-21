//Namespace declaration
var jsqe = jsqe || {};

/// <summary>Enumarations</summary>
jsqe.options = {

    /// <summary>List of possible inlinecount options</summary>
    inlineCount: {
        allpages: 'allpages',
        none: 'none'
    },

    /// <summary>List of possible formats</summary>
    format: {
        atom: 'atom',
        json: 'json'
    },

    /// <summary>List of possible filter operators</summary>
    filterOperator: {
        or: 'or',
        and: 'and'
    },

    /// <summary>List of possible order directions</summary>
    orderDirection: {
        asc: 'asc',
        desc: 'desc'
    }
};

/// <summary>String utilities</summary>
jsqe.strings = {

    /// <summary>Trims source text</summary>
    /// <param name="text" type="String">Source text</param>
    /// <returns type="String" />
    trim: function (text) {
        if (!text) {
            throw new Error('text is required');
        }

        var beginPosition = 0;
        var endPosition = text.length;

        for (var i = 0; i < text.length; i++) {
            var beginChar = text.charAt(i);
            if (beginChar !== ' ') {
                break;
            }
            beginPosition++;
        }

        if (beginPosition == text.length) {
            return '';
        }

        for (var j = text.length - 1; j >= 0; j--) {
            var endChar = text.charAt(j);
            if (endChar !== ' ') {
                break;
            }
            endPosition--;
        }
        var result = text.substring(beginPosition, endPosition);
        return result;
    },

    /// <summary>Checks whether given text is null or empty</summary>
    /// <param name="text" type="String">Text to be checked</param>
    /// <returns type="Boolean" />
    isEmpty: function (text) {
        if (!text) {
            return true;
        }

        var trimmedText = this.trim(text);
        if (trimmedText === '') {
            return true;
        }

        return false;
    },

    /// <summary>Checks whether source text is included in target list</summary>
    /// <param name="text" type="String">Source text</param>
    /// <param name="listItems" type="Array">Target list</param>
    /// <returns type="Boolean" />
    isInList: function (text, listItems) {
        if (!text) {
            throw new Error('text is required');
        }

        for (var i = 1; i < arguments.length; i++) {
            if (text === arguments[i]) {
                return true;
            }
        }

        return false;
    }
};

/// <summary>Creates an instance of query object</summary>
/// <param name="rootUri" type="String">URI of OData service</param>
/// <param name="resourcePath" type="String">Resource path</param>
/// <returns type="jsqe.query" />
jsqe.query = function (rootUri, resourcePath) {

    //Member declarations
    var _filterExpression = null;
    var _orderExpressions = [];
    var _expands = [];
    var _selects = [];
    var _customQueryOptions = [];

    var _rootUri = rootUri;
    var _resourcePath = resourcePath;
    var _top = -1;
    var _skip = -1;
    var _format = null;
    var _inlinecount = null;

    var _addSelect = function (select) {
        if (jsqe.strings.isEmpty(select) === true) {
            throw new Error('select is required');
        }

        _selects.push(select);
    };

    return {

        /// <summary>Sets query filter</summary>
        /// <param name="filterExpression" type="jsqe.filter">Filter expression</param>
        /// <returns type="jsqe.query" />
        setFilter: function (filterExpression) {
            if (!filterExpression) {
                throw new Error('filterExpression is required');
            }

            _filterExpression = filterExpression;
            return this;
        },

        /// <summary>Returns query filter</summary>
        /// <returns type="jsqe.filter" />
        getFilter: function () {
            return _filterExpression;
        },

        /// <summary>For internal use</summary>
        _addOrders: function (listOfAttributes, direction) {
            var attributeCount = listOfAttributes.length;
            for (var i = 0; i < attributeCount; i++) {
                var newOrder = jsqe.orderBy(listOfAttributes[i], direction);
                this.addOrder(newOrder);
            }
        },

        /// <summary>Adds an order epxression</summary>
        /// <param name="orderExpression" type="jsqe.order">Order expression</param>
        /// <returns type="jsqe.query" />
        addOrder: function (orderExpression) {
            if (!orderExpression) {
                throw new Error('orderExpression is required');
            }

            _orderExpressions.push(orderExpression);
            return this;
        },

        /// <summary>Adds order epxressions for ascending sorting. Attribute names are specified as seperate parameters. 
        /// See params keyword in C#</summary>
        /// <param name="listOfAttributes" type="String">Attribute names</param>
        /// <returns type="jsqe.query" />
        addOrdersAsc: function (listOfAttributes) {
            this._addOrders(arguments, jsqe.options.orderDirection.asc);
            return this;
        },

        /// <summary>Adds order epxressions for descending sorting. Attribute names are specified as seperate parameters. 
        /// See params keyword in C#</summary>
        /// <param name="listOfAttributes" type="String">Attribute names</param>
        /// <returns type="jsqe.query" />
        addOrdersDesc: function (listOfAttributes) {
            this._addOrders(arguments, jsqe.options.orderDirection.desc);
            return this;
        },

        /// <summary>Returns list of order expressions</summary>
        /// <returns type="Array" />
        getOrders: function () {
            return _orderExpressions;
        },

        /// <summary>Adds an expand options</summary>
        /// <param name="expand" type="String">Name of relation to be expanded</param>
        addExpand: function (expand) {
            if (jsqe.strings.isEmpty(expand) === true) {
                throw new Error('expand is required');
            }

            _expands.push(expand);
            return this;
        },

        /// <summary>Returns list of expand options</summary>
        /// <returns type="Array" />
        getExpands: function () {
            return _expands;
        },

        /// <summary>Returns list of selected attributes</summary>
        /// <returns type="Array" />
        getSelects: function () {
            return _selects;
        },

        /// <summary>Adds a new select option</summary>
        /// <param name="select" type="String">Name of attribute to be selected</param>
        /// <returns type="jsqe.query" />
        addSelect: function (select) {
            _addSelect(select);
            return this;
        },

        /// <summary>Adds multiple select options</summary>
        /// <param name="select" type="Array">Name of attributes to be selected</param>
        /// <returns type="jsqe.query" />
        addSelects: function (listOfItems) {
            if (typeof (listOfItems) === 'object') {
                for (var i = 0; i < listOfItems.length; i++) {
                    var currentSelect = listOfItems[i];
                    _addSelect(currentSelect);
                }
            }
            else if (arguments.length > 0) {
                for (var i = 0; i < arguments.length; i++) {
                    var currentSelect = arguments[i];
                    _addSelect(currentSelect);
                }
            }

            return this;
        },

        /// <summary>Adds custom query options</summary>
        /// <param name="key" type="String">Option key</param>
        /// <param name="value" type="String">Option value</param>
        /// <returns type="jsqe.query" />
        addCustomQueryOption: function (key, value) {
            if (jsqe.strings.isEmpty(key) === true) {
                throw new Error('key is required');
            }

            var pair = { _key: key, _value: value };
            _customQueryOptions.push(pair);
            return this;
        },

        /// <summary>Returns list of custom query options</summary>
        /// <returns type="Array" />
        getCustomerQueryOptions: function () {
            return _customQueryOptions;
        },

        /// <summary>Sets number of records to retrieve</summary>
        /// <param name="top" type="Number">Number of records to retrieve</param>
        /// <returns type="jsqe.query" />
        setTop: function (top) {
            if (typeof (top) !== 'number') {
                throw new Error('top has to contain a numeric value');
            }

            if (top < 1) {
                throw new Error('top has to contain a value greater than 0');
            }

            _top = top;
            return this;
        },

        /// <summary>Returns number of records to retrieve</summary>
        /// <returns type="Number" />
        getTop: function () {
            return _top;
        },

        /// <summary>Sets number of records to skip</summary>
        /// <param name="skip" type="Number">Number of records to skip</param>
        /// <returns type="jsqe.query" />
        setSkip: function (skip) {

            if (typeof (skip) !== 'number') {
                throw new Error('skip has to contain a numeric value');
            }

            if (skip < 0) {
                throw new Error('skip has to contain a value greater than or equal to 0');
            }

            _skip = skip;
            return this;
        },

        /// <summary>Returns number of records to skip</summary>
        /// <returns type="Number" />
        getSkip: function () {
            return _skip;
        },

        /// <summary>Sets required format query result</summary>
        /// <param name="format" type="Enumeration">atom|json</param>
        /// <returns type="jsqe.query" />
        setFormat: function (format) {
            var isValid = jsqe.strings.isInList(format, jsqe.options.format.atom, jsqe.options.format.json);
            if (isValid === false) {
                throw new Error('valid values for format are atom|json');
            }

            _format = format;
            return this;
        },

        /// <summary>Returns required format of query result</summary>
        /// <returns type="String" />
        getFormat: function () {
            return _format;
        },

        /// <summary>Sets inlinecount option</summary>
        /// <param name="inlinecount" type="Enumeration">allpages|none</param>
        /// <returns type="jsqe.query" />
        setInlinecount: function (inlinecount) {
            var isValid = jsqe.strings.isInList(inlinecount, jsqe.options.inlineCount.allpages, jsqe.options.inlineCount.none);
            if (isValid === false) {
                throw new Error('valid values for inlinecount are allpages|none');
            }

            _inlinecount = inlinecount;
            return this;
        },

        /// <summary>Returns inlinecount option</summary>
        /// <returns type="String" />
        getInlinecount: function () {
            return _inlinecount;
        },

        /// <summary>Returns generated URI to retrieve resource(s)</summary>
        /// <returns type="String" />
        generateUri: function () {
            var result = _rootUri;
            var lastCharacter = result.charAt(result.length - 1);
            if (lastCharacter !== '/') {
                result += '/'
            }
            result += _resourcePath;

            var allOptions = '';
            var addOption = function (scope, newOptionsGenerator) {
                var newOptions = newOptionsGenerator.call(scope);
                if (jsqe.strings.isEmpty(allOptions) === false && jsqe.strings.isEmpty(newOptions) === false) {
                    allOptions += '&';
                }
                allOptions += newOptions;
                return allOptions;
            }

            allOptions = addOption(this, this._generateTop);
            allOptions = addOption(this, this._generateOrders);
            allOptions = addOption(this, this._generateSkip);
            allOptions = addOption(this, this._generateExpand);
            allOptions = addOption(this, this._generateFormat);
            allOptions = addOption(this, this._generateSelect);
            allOptions = addOption(this, this._generateInlinecount);
            allOptions = addOption(this, this._generateCustomQueryOptions);
            allOptions = addOption(this, this._generateFilter);

            if (allOptions !== '') {
                result +=  '?' + allOptions;
            }

            return result;
        },

        /// <summary>For internal use</summary>
        _generateFilter: function () {
            if (_filterExpression) {
                var filterOptions = _filterExpression.generateFilter();
                if (jsqe.strings.isEmpty(filterOptions) === false) {
                    filterOptions = '$filter=' + filterOptions;
                }
                return filterOptions;
            }
            return '';
        },

        /// <summary>For internal use</summary>
        _generateOrders: function () {
            var formattedOrders = [];
            for (var i = 0; i < _orderExpressions.length; i++) {
                var orderExpression = _orderExpressions[i].generateOrderBy();
                formattedOrders.push(orderExpression);
            }
            return this._generateCommaSeperatedOption('orderby', formattedOrders);
        },

        /// <summary>For internal use</summary>
        _generateTop: function () {
            if (_top > 0) {
                return this._generateKeyValueOption('top', _top);
            }
            return '';
        },

        /// <summary>For internal use</summary>
        _generateSkip: function () {
            if (_skip > -1) {
                return this._generateKeyValueOption('skip', _skip);
            }
            return '';
        },

        /// <summary>For internal use</summary>
        _generateExpand: function () {
            return this._generateCommaSeperatedOption('expand', _expands);
        },

        /// <summary>For internal use</summary>
        _generateFormat: function () {
            return this._generateKeyValueOption('format', _format);
        },

        /// <summary>For internal use</summary>
        _generateSelect: function () {
            return this._generateCommaSeperatedOption('select', _selects);
        },

        /// <summary>For internal use</summary>
        _generateInlinecount: function () {
            return this._generateKeyValueOption('inlinecount', _inlinecount);
        },

        /// <summary>For internal use</summary>
        _generateCustomQueryOptions: function () {
            result = '';
            for (var i = 0; i < _customQueryOptions.length; i++) {
                var customOption = _customQueryOptions[i];
                if (result !== '') {
                    result += '&';
                }
                result += customOption._key + '=' + customOption._value;
            }
            return result;
        },

        /// <summary>For internal use</summary>
        _generateKeyValueOption: function (key, value) {
            var result = '';
            if (value) {
                result = '$' + key + '=' + value;
            }
            return result;
        },

        /// <summary>For internal use</summary>
        _generateCommaSeperatedOption: function (name, options) {
            var result = '';
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (result !== '') {
                    option = ', ' + option;
                }
                result += option;
            }
            if (result !== '') {
                result = '$' + name + '=' + result;
            }
            return result;
        }
    }
}

/// <summary>Creates an instance of query filter</summary>
/// <param name="initialCondition" type="String">Condition text</param>
/// <param name="operator" type="Enumeration">jsqe.options.filterOperator</param>
/// <returns type="jsqe.filter" />
jsqe.filter = function (initialCondition, operator) {
    var _conditions = [];
    var _filters = [];
    var _operator = null;

    if (!operator) {
        operator = jsqe.options.filterOperator.and;
    }

    var filterResult = {

        /// <summary>Sets operator</summary>
        /// <param name="newOperator" type="Enumeration">jsqe.options.filterOperator</param>
        /// <returns type="jsqe.filter" />
        setOperator: function (newOperator) {
            var isValid = jsqe.strings.isInList(newOperator, jsqe.options.filterOperator.or, jsqe.options.filterOperator.and);
            if (isValid === false) {
                throw new Error('invalid value for operator');
            }
            _operator = newOperator;
            return this;
        },

        /// <summary>Returns operator</summary>
        /// <returns type="String" />
        getOperator: function () {
            return _operator
        },

        /// <summary>Adds condition to filter</summary>
        /// <param name="condition" type="String">Condition text</param>
        /// <returns type="jsqe.filter" />
        addCondition: function (condition) {
            if (jsqe.strings.isEmpty(condition) === true) {
                throw new Error('condition is required');
            }

            _conditions.push(condition);
            return this;
        },

        /// <summary>Returns list of conditions</summary>
        /// <returns type="Array" />
        getConditions: function () {
            return _conditions;
        },

        /// <summary>Adds a sub filter to filter (conposite structure)</summary>
        /// <param name="filter" type="jsqq.filter">Sub filter</param>
        /// <returns type="jsqe.filter" />
        addFilter: function (filter) {
            if (!filter) {
                throw new Error('filter is required');
            }

            _filters.push(filter);
            return this;
        },

        /// <summary>Returns list of filters</summary>
        /// <returns type="Array" />
        getFilters: function () {
            return _filters;
        },

        /// <summary>Generates part of query URI to represent filter. Not intended for client library usage</summary>
        /// <returns type="String" />
        generateFilter: function () {
            var result = this._generateConditions();

            var filters = this._generateFilters();
            if (result !== '' && filters !== '') {
                result += ' ' + _operator + ' ';
                result += filters;
            }

            return result;
        },

        /// <summary>For internal use</summary>
        _generateConditions: function () {
            var result = '';
            for (var i = 0; i < _conditions.length; i++) {
                if (result !== '') {
                    result += ' ' + _operator + ' ';
                }
                var condition = _conditions[i];
                result += '(' + condition + ')';
            }
            return result;
        },

        /// <summary>For internal use</summary>
        _generateFilters: function () {
            var result = '';
            for (var i = 0; i < _filters.length; i++) {
                if (result !== '') {
                    result += ' ' + _operator + ' ';
                }
                var filter = _filters[i];
                result += '(' + filter.generateFilter() + ')';
            }
            return result;
        }
    }

    filterResult.setOperator(operator);
    filterResult.addCondition(initialCondition);

    return filterResult;
};


/// <summary>Creates an instance of query order</summary>
/// <param name="attribute" type="String">Name of attribute sort by</param>
/// <param name="direction" type="Enumeration">sqe.options.orderDirection</param>
/// <returns type="jsqe.filter" />
jsqe.orderBy = function (attribute, direction) {
    var _attribute = null;
    var _direction = null;

    if (!direction) {
        direction = jsqe.options.orderDirection.asc;
    }

    var orderBy = {

        /// <summary>Sets attribute name</summary>
        /// <param name="newAttribute" type="String ">Name of attribute</param>
        /// <returns type="jsqe.orderBy" />
        setAttribute: function (newAttribute) {
            if (jsqe.strings.isEmpty(newAttribute) === true) {
                throw new Error('attribute is reqiured');
            }

            _attribute = newAttribute;
            return this;
        },

        /// <summary>Returns name of attribute to sort by</summary>
        /// <returns type="String" />
        getAttribute: function () {
            return _attribute;
        },

        /// <summary>Sets sorting direction</summary>
        /// <param name="newDirection" type="Enumeration">sqe.options.orderDirection</param>
        /// <returns type="jsqe.orderBy" />
        setDirection: function (newDirection) {
            var isValid = jsqe.strings.isInList(newDirection, jsqe.options.orderDirection.asc, jsqe.options.orderDirection.desc);
            if (isValid === false) {
                throw new Error('attribute is reqiured');
            }

            _direction = newDirection;
            return this;
        },

        /// <summary>Returns sort direction</summary>
        /// <returns type="String" />
        getDirection: function () {
            return _direction;
        },

        /// <summary>Generates part of query URI to represent order statement. Not intended for client library usage</summary>
        /// <returns type="String" />
        generateOrderBy: function () {
            var result = _attribute + ' ' + _direction;
            return result;
        }
    }

    orderBy.setAttribute(attribute);
    orderBy.setDirection(direction);

    return orderBy;
};