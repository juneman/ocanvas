var expect = require('expect.js');
var EventEmitter = require('../../../classes/EventEmitter');

describe('EventEmitter', function() {

  describe('#on()', function() {

    it('should add a handler function for an event', function(done) {
      var emitter = new EventEmitter();

      emitter.on('some-event', function() {
        done();
      });

      emitter.emit('some-event');
    });

  });

  describe('#off()', function() {

    it('should remove a handler function for an event', function(done) {
      var emitter = new EventEmitter();
      var hasBeenCalled = false;

      var handler = function() {
        hasBeenCalled = true;
      };

      emitter.on('some-event', handler);

      emitter.off('some-event', handler);

      emitter.emit('some-event');

      setTimeout(function() {
        if (hasBeenCalled) {
          done(new Error('The off method does not remove the handler.'));
        } else {
          done();
        }
      }, 10);

    });

  });

  describe('#emit()', function() {

    it('should call all handler functions for the event', function(done) {
      var emitter = new EventEmitter();
      var numCalls = 0;

      emitter.on('some-event', function() {
        numCalls++;
      });

      emitter.on('some-event', function() {
        numCalls++;
        if (numCalls === 2) done();
        else done(new Error('Not all handlers were called (or they were called in the wrong order).'));
      });

      emitter.emit('some-event');
    });

    it('should call handler functions for all passed event types', function(done) {
      var emitter = new EventEmitter();
      var numCalls = 0;

      emitter.on('some-event', function() {
        numCalls++;
      });

      emitter.on('some-other-event', function() {
        numCalls++;
        if (numCalls === 2) done();
        else done(new Error('Not all handlers were called (or they were called in the wrong order).'));
      });

      emitter.emit('some-event some-other-event');
    });

    it('should call the handler function for the event with the passed event object', function(done) {
      var emitter = new EventEmitter();

      emitter.on('some-event', function(event) {
        expect(event.property).to.equal('value');
        done();
      });

      emitter.emit('some-event', {property: 'value'});
    });

    it('should call the handler function for the event with an event object with a type property', function(done) {
      var emitter = new EventEmitter();

      emitter.on('some-event', function(event) {
        expect(event.type).to.equal('some-event');
      });
      emitter.on('some-other-event', function(event) {
        expect(event.type).to.equal('some-other-event');
      });
      emitter.on('some-other-new-event', function(event) {
        expect(event.type).to.equal('some-other-new-event');
        done();
      });

      emitter.emit('some-event', {property: 'value'});
      emitter.emit('some-event some-other-event', {property: 'value'});
      emitter.emit('some-other-new-event');
    });

  });

});
