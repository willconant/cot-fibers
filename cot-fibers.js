/*
Copyright (c) 2013 Will Conant, http://willconant.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict';

var Cot = require('cot');
var Future = require('fibers/future');

function CotFibers(opts) {
	this.cot = new Cot(opts);
}

module.exports = CotFibers;

CotFibers.prototype = {
	GET:    cotProxy('GET'),
	DELETE: cotProxy('DELETE'),
	PUT:    cotProxy('PUT'),
	POST:   cotProxy('POST'),
	
	db: function(name) {
		return new DbHandle(this.cot, name);
	}
};

function cotProxy(name) {
	return function() {
		var future = new Future();
		this.cot[name].apply(this.cot, Array.prototype.slice.apply(arguments).concat(future.resolver()));
		return future;
	}
}

function DbHandle(cot, name) {
	this.db = cot.db(name);
}

DbHandle.prototype = {
	info:         dbProxy('info'),
	getDoc:       dbProxy('getDoc'),
	getDocWhere:  dbProxy('getDocWhere'),
	putDoc:       dbProxy('putDoc'),
	updateDoc:    dbProxy('updateDoc'),
	deleteDoc:    dbProxy('deleteDoc'),
	view:         dbProxy('view'),
	allDocs:      dbProxy('allDocs'),
	viewKeys:     dbProxy('viewKeys'),
	allDocsKeys:  dbProxy('allDocsKeys'),
	postBulkDocs: dbProxy('postBulkDocs'),
	changes:      dbProxy('changes')
};

function dbProxy(name) {
	return function() {
		var future = new Future();
		this.db[name].apply(this.db, Array.prototype.slice.apply(arguments).concat(future.resolver()));
		return future;
	}
}
