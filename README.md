## Introduction

JsQueryExpression aims to create a javascript library to generate URIs by using QueryExpression like (names are inspired from Microsoft Dynamics CRM QueryExpression class) object model to query OData resources.

## What is all that about?

Typing URIs or formatting strings to access OData resource is error prone, hard to write,  hard to read and even boring.

I was working on a MS Dynamic CRM project and i was really fed up typing complex URIs in client side to retrieve my objects via REST endpoint. So i thought, it might to be helpful to create a javascript object which exposes an object model to generate these URIs.

## Under the hood

There is no dependency to 3rd party solutions. Fluent coding.

## Sample Code

```javascript
    var filter = jsqe.filter('balance gt (100)').addCondition('type eq (1)');

    var query = jsqe.query('http://myserver', 'accounts');
    query.addOrdersAsc('name').addOrdersDesc('createDate').setFilter(filter);

    var actual = query.generateUri();
    var expected = 'http://myserver/accounts?$orderby=name asc,createDate desc&$filter=(balance gt (100)) and (type eq (1))';
    equal(actual, expected);

```
