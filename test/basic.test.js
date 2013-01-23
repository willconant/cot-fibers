var chai = require('chai');
var expect = chai.expect;

var Fiber = require('fibers');
var CotFibers = require('../cot-fibers');

var config = require('./config');

describe('DbHandle', function() {
	var cot = new CotFibers(config.serverOpts);
	var db = cot.db(config.dbName);

	beforeEach(fibrous(function() {
		cot.DELETE('/' + config.dbName, {}).wait();
		cot.PUT('/' + config.dbName, '', {}).wait();
		db.putDoc({_id: 'person-1', type: 'person', name: 'Will Conant'}).wait();
	}));

	describe('#info', function() {
		it('should return database info', fibrous(function() {
			var info = db.info().wait();
			expect(info).to.be.a('object');
			expect(info.doc_count).to.equal(1);
		}));
	});
	
	describe('#getDoc', function() {
		it('should return test document from database', fibrous(function() {
			var doc = db.getDoc('person-1').wait();
			expect(doc).to.be.a('object');
			expect(doc.name).to.equal('Will Conant');
		}));
	});
	
	describe('#getDocWhere', function() {
		it('should return null when condition does not match', fibrous(function() {
			var doc = db.getDocWhere('person-1', function(doc) { return doc.type === 'clown' }).wait();
			expect(doc).to.be.null;
		}));
		
		it('should return doc when condition matches', fibrous(function() {
			var doc = db.getDocWhere('person-1', function(doc) { return doc.type === 'person' }).wait();
			expect(doc).to.be.a('object');
			expect(doc.name).to.equal('Will Conant');
		}));
	});
});

function fibrous(fn) {
	return function(done) {
		Fiber(function() {
			try {
				fn();
				done();
			}
			catch (err) {
				done(err);
			}
		}).run();
	}
}