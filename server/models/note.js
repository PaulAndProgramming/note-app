const mongoose = require('mongoose');

let Note = mongoose.model('Note', {
	text: {
		type: String,
		required: true
	},
	added: {
		type: Number,
		required: true
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

module.exports = Note;
