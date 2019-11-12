
# mongoose-infinite-pagination

> Pagination plugin for [Mongoose](http://mongoosejs.com) & [expressJS](https://expressjs.com/) and It is used to paginate the bulk datas.

[![NPM version](https://img.shields.io/npm/v/mongoose-infinite-pagination.svg)](https://npmjs.org/package/mongoose-infinite-pagination)
[![Build status](https://img.shields.io/travis/edwardhotchkiss/mongoose-infinite-pagination.svg)](https://travis-ci.org/edwardhotchkiss/mongoose-infinite-pagination)

**Note:** This plugin will only work with Node.js >= 4.2 and Mongoose >= 4.2
=======
[![NPM](https://nodei.co/npm/mongoose-infinite-pagination.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mongoose-infinite-pagination/)

## Installation

```sh
npm install mongoose-infinite-pagination
```

## Usage
### Installation
Add plugin to a schema and then use model `findWithPaginate` method:

```js
var mongoose = require('mongoose');
var mongooseInfinitePaginate = require('mongoose-infinite-pagination');

var schema = new mongoose.Schema({ /* schema definition & fields */ });
schema.plugin(mongooseInfinitePaginate);

var Model = mongoose.model('Model',  schema);
```

## Normal Pagination

### Model.findWithPaginate(query, options, callback) : Promise<any>

**Parameters**

* `[query]` {Object} - Query criteria. [Documentation](https://docs.mongodb.org/manual/tutorial/query-documents)
* `[options]` {Object}
  - `[req]` {URL request} - Use `req` to set get the url for next set of results & get the url for previous set of results.
  - `[skip=0]` {Number} - Use `skip` to set skip position.
  - `[limit=10]` {Number} - Use `limit` to set number of results to be obtain.
* `[callback(err, result)]` - If specified the callback is called once pagination results are retrieved or when an error has occurred

**Return value**

Promise fulfilled with object having properties:
* `results` {Array} - Array of documents
* `count` {Number} - Total number of documents in collection that match a query
* `next` {Number} - URL for the next set of results
* `previous` {Number} - URL for previous set of results

### Examples

#### Skip 5 documents and return upto 10 documents

```js
Model.findWithPaginate({}, {req : req, skip: 5, limit: 10 }, function(err, result) {
  // result.results
  // result.count
  // result.next
  // result.previous
});
```

### Skip 5 documents and return upto 10 documents with select & populate:

```js
Model
   .paginateSelect('name') // Select Options same as mongoose select();
   .paginatePopulate([populateOpts]) // Populate Options same as mongoose populate();
   .findWithPaginate({}, {req : req, skip: 5, limit: 10 }, function(err, result) {
  // result.results
  // result.count
  // result.next
  // result.previous
});
```
### Note : Please use paginateSelect() & paginatePopulate() before findWithPaginate() otherwise it will not work.

### With promise:

```js
Model.findWithPaginate({}, {req : req, skip: 3, limit: 10 }).then(function(result) {
  // ...
}).catch(err =>{
  // ...
});
```
## Paginate with Aggregation

### Model.aggregatePaginate(pipelines, options, callback) : Promise<any>

**Parameters**

* `[pipelines]` {Object} - Aggregate Pipeline criteria. [Documentation](https://docs.mongodb.com/manual/core/aggregation-pipeline/)
* `[options]` {Object}
  - `[req]` {URL request} - Use `req` to set get the url for next set of results & get the url for previous set of results.
  - `[skip=0]` {Number} - Use `skip` to set skip position.
  - `[limit=10]` {Number} - Use `limit` to set number of results to be obtain.
* `[callback(err, result)]` - If specified the callback is called once pagination results are retrieved or when an error has occurred

**Return value**

Promise fulfilled with object having properties:
* `results` {Array} - Array of documents
* `count` {Number} - Total number of documents in collection that match a query
* `next` {Number} - URL for the next set of results
* `previous` {Number} - URL for previous set of results

### Examples

#### Skip 5 documents and return upto 10 documents

```js
Model.aggregatePaginate({}, {req : req, skip: 5, limit: 10 }, function(err, result) {
  // result.results
  // result.count
  // result.next
  // result.previous
});
```

### With promise:

```js
Model.aggregatePaginate({}, {req : req, skip: 3, limit: 10 }).then(function(result) {
  // ...
}).catch(err =>{
  // ...
});
```

#### Set custom default options for all queries

config.js:

```js
var mongooseInfinitePaginate = require('mongoose-infinite-pagination');

mongooseInfinitePaginate.paginate.options = { 
  defaulLimit: 10,
  defaulSkip: 0,
};
```

controller.js:

```js
Model
    .paginateSelect('name mobile ...')
    .paginatePopulate({path : 'userprofile'})
    .findWithPaginate(query).then(function(result) {
      // result.docs - array of objects
      // result.limit - 10
      // result.skip - 0
    });

Model
    .aggregatePaginate(pipelines,opts).then(function(result) {
      // result.docs - array of objects
      // result.limit - 10
      // result.skip - 0
    });
```

## Tests

```sh
npm install
npm test
```

## License

[MIT](LICENSE)
