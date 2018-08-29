"use strict";

/**
Schema to store image ranking data in database
**/

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	_id: String,
	rectangle: Object,
	circle: Object,
	triangle: Object,
	capsule: Object,
	human_1: Object,
	human_2: Object,
	text: Object,
	background: Object,
	color: Object
});

var ImageData = mongoose.model('Image', imageSchema);
module.exports = ImageData;