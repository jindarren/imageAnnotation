"use strict";

var mongoose = require('mongoose');
//var async = require('async');

var ImageData = require('./schema/imageData.js');

var express = require('express');
var app = express();

//Modules
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/imagedata', function (err) {
    if (err) {
        console.log("connection error", err);

    } else {
        console.log('connection successful!');
    }
});



app.listen(3003);

app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
//app.use(express.static('./'))


app.get('/', function (request, response) {
    //response.send('Simple web server of files from ' + __dirname);
    response.render('image_ranker.html');
});

app.post('/submitForm', function(request, response) {
	ImageData.findOne({_id:request.body._id}, function(err, data) {
		console.log(data);
		var submitStatus = false;
		if(err) {
			console.error("Checking image data error.");
			response.status(400).send("Error");
			return;
		}
		if(data !== null) {
			if(request.body.submit_status == false) {
				console.log('here i am wooot');
				console.log(data.submit_status);
				submitStatus = data.submit_status;
			} else {
				submitStatus = true;
			}
			ImageData.remove({_id:request.body._id}, function(err, data) {
				if(err) throw err;
			});
		}
		var image = new ImageData({
	        _id:request.body._id, submit_status:submitStatus, image_rank:request.body.image_rank, rectangle:request.body.rectangle,
			circle:request.body.circle, triangle:request.body.triangle, capsule:request.body.capsule,
			human_1:request.body.human_1, human_2:request.body.human_2, txt:request.body.txt,
			back:request.body.back, hue:request.body.hue
		});
		image.save(function (err) {
	        if (err) {
	            response.send(err);
	        }
	        // res.json({message: "user profile is updated"})
	    });
	    response.json(image);
		//console.log('Photo added');
        //response.end('Photo data added');
	});
});

app.get('/getPhotoData', function(request, response) {
	ImageData.findOne({_id:request.query._id}, function(err, data) {
		console.log(data);
		if(err) {
			response.status(500).send("Error");
			return;
		}
		if(data === null) {
			console.error("Photo does not exist.");
			response.status(500).send("Error: no photo");
			return;
		}
		response.end(JSON.stringify(data));

	});
});

app.get('/getImages', function(request, response) {
	ImageData.find({}, function(err, photos) {
		 if (err) {
            console.error('Doing /getImages error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (photos.length === 0) {
            response.status(500).send('Missing photo info');
            return;
        }
        if(photos === null) {
        	response.status(500).send('Missing photo info');
            return;
        }
        var photoInfo = [];
        for(var i = 0; i < photos.length; i++) {
            var obj = {_id:photos[i]._id, submit_status:photos[i].submit_status};
            photoInfo.push(obj);
        }
        response.end(JSON.stringify(photoInfo));
	});
});

app.get("/getStat", function(req, res){
    ImageData.find({},function (err, user) {
        if (err)
            res.send(err);
        else{

            // var result = user[user.length-1].div_track.size

            // res.json({"div":result})
            res.json(user);
        }
    })
});