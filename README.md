# What is CotFibers? #

Cot is a simple but pleasant interface for CouchDB. This module, CotFibers, wraps the Cot functions so they return Futures instead of taking callbacks.

    var cot = new CotFibers({port: 5984, hostname: 'localhost'});
    var db = cot.db('my-db');
    
    Fiber(function() {
        var doc = db.getDoc('some-doc').wait();
        doc.whatever = 'foo';
        var result = db.putDoc(result).wait();
        doc._rev = result.rev;
    }).run();


CotFibers requires fibers: https://github.com/laverdet/node-fibers

For the complete Cot API, go here: https://github.com/willconant/cot-node
