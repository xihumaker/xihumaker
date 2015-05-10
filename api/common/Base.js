'use strict';

var Events = require('../core/events');

var Base = Events.extend({

	init: function() {
		console.log('Common Base init');
	}

});


module.exports = Base;
