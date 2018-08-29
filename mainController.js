'use strict';

var imageClassifier = angular.module('imageClassifier', ['ngRoute', 'ngMaterial', 'ngResource']);

imageClassifier.controller('MainController', ['$scope', '$routeParams', '$rootScope', '$location', '$resource', '$http',
    function ($scope, $routeParams, $rootScope, $location, $resource, $http) {

        $scope.images = [{filename: "poster/poster_1.jpg"}, {filename: "poster/poster_2.jpg"}, {filename: "poster/poster_3.jpg"},
            {filename: "poster/poster_4.jpg"}, {filename: "poster/poster_5.jpg"}, {filename: "poster/poster_10.jpg"}, 
            {filename: "poster/poster_12.jpg"}, {filename: "poster/poster_14.jpg"}, {filename: "poster/poster_15.jpg"}];

        //$scope.imageData = [];

        $scope.form = {};
        $scope.form.rectangle = {};
        $scope.form.rectangle.area = '0';
        $scope.form.rectangle.x = '0';
        $scope.form.rectangle.y = '0';
        $scope.form.rectangle.count = '0';
        $scope.form.rectangle.blur = '0';
        $scope.form.rectangle.z = '0';
        $scope.form.rectangle.direction = '0';

        $scope.form.circle = {};
        $scope.form.circle.area = '0';
        $scope.form.circle.x = '0';
        $scope.form.circle.y = '0';
        $scope.form.circle.count = '0';
        $scope.form.circle.blur = '0';
        $scope.form.circle.z = '0';

        $scope.form.tri = {};
        $scope.form.tri.area = '0';
        $scope.form.tri.x = '0';
        $scope.form.tri.y = '0';
        $scope.form.tri.count = '0';
        $scope.form.tri.blur = '0';
        $scope.form.tri.z = '0';
        $scope.form.tri.direction = '0';

        $scope.form.cap = {};
        $scope.form.cap.area = '0';
        $scope.form.cap.x = '0';
        $scope.form.cap.y = '0';
        $scope.form.cap.count = '0';
        $scope.form.cap.blur = '0';
        $scope.form.cap.z = '0';
        $scope.form.cap.direction = '0';

        $scope.form.hum1 = {};
        $scope.form.hum1.area = '0';
        $scope.form.hum1.x = '0';
        $scope.form.hum1.y = '0';
        $scope.form.hum1.count = '0';
        $scope.form.hum1.z = '0';
        $scope.form.hum1.direction = '0';

        $scope.form.hum2 = {};
        $scope.form.hum2.area = '0';
        $scope.form.hum2.x = '0';
        $scope.form.hum2.y = '0';
        $scope.form.hum2.count = '0';
        $scope.form.hum2.z = '0';
        $scope.form.hum2.direction = '0';

        $scope.form.txt = {};
        $scope.form.txt.area = '0';
        $scope.form.txt.x = '0';
        $scope.form.txt.y = '0';
        $scope.form.txt.count = '0';
        $scope.form.txt.z = '0';
        $scope.form.txt.direction = '0';

        $scope.form.back = {};
        $scope.form.back.c1 = '0';
        $scope.form.back.c2 = '0';
        $scope.form.back.c3 = '0';
        $scope.form.back.c4 = '0';
        $scope.form.back.c5 = '0';
        $scope.form.back.g1 = '0';
        $scope.form.back.g2 = '0';
        $scope.form.back.g3 = '0';
        $scope.form.back.g4 = '0';
        $scope.form.back.g5 = '0';
        $scope.form.back.g6 = '0';
        $scope.form.back.g7 = '0';
        $scope.form.back.g8 = '0';
        $scope.form.back.direction = '0';

        $scope.form.hue = {};
        $scope.form.hue.c1 = '0';
        $scope.form.hue.c2 = '0';
        $scope.form.hue.c3 = '0';
        $scope.form.hue.c4 = '0';
        $scope.form.hue.c5 = '0';
        $scope.form.hue.c6 = '0';
        $scope.form.hue.c7 = '0';
        $scope.form.hue.c8 = '0';
        $scope.form.hue.c9 = '0';
        $scope.form.hue.c10 = '0';
        $scope.form.hue.g1 = '0';
        $scope.form.hue.g2 = '0';
        $scope.form.hue.g3 = '0';
        $scope.form.hue.g4 = '0';
        $scope.form.hue.g5 = '0';
        $scope.form.hue.g6 = '0';
        $scope.form.hue.g7 = '0';
        $scope.form.hue.g8 = '0';
        $scope.form.hue.g9 = '0';
        $scope.form.hue.g10 = '0';
        $scope.form.hue.g11 = '0';
        $scope.form.hue.g12 = '0';
        $scope.form.hue.direction = '0';

        var currX = 0;
        var currY = 0;
        var currDisplayedImage = 'poster/poster_1.jpg';
        getNewImageData();
        var canvas = document.getElementById('imageCanvas');
        var hiddenCanvas = document.getElementById('hiddenCanvas');
        var posX = '';
        var posY = '';
        var prevX = '';
        var prevY = '';
        var condition = 1;
        var points = [];//holds the mousedown points
        var imageObj = new Image();
        var currSection = 0;
        var sections = [document.getElementById('rectangle-form'), document.getElementById('circle-form'),
            document.getElementById('triangle-form'), document.getElementById('capsule-form'),
            document.getElementById('human1-form'), document.getElementById('human2-form'), 
            document.getElementById('text-form'), document.getElementById('background-form'),
            document.getElementById('color-form')];
        var mode = 0;

        var sectionNames = ['rect', 'circle', 'tri', 'cap', 'hum1', 'hum2', 'text'];

        function getImageStatus() {

            var photoResource = $resource('/getImages', {});
            photoResource.query({}, function(responseData) {
                var imageData = responseData;
                for(var i = 0; i < imageData.length; i++) {
                    for(var j = 0; j < $scope.images.length; j++) {
                        if(imageData[i]._id === $scope.images[j].filename) {
                            $scope.images[j].submit_status = imageData[i].submit_status;
                        }
                    }
                }
            }, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }

        function setInputMinMax() {
            var inputBoxes = document.getElementsByClassName('input-box');
            for(var i = 0; i < inputBoxes.length; i++) {
                inputBoxes[i].onchange = function() {
                    if(isNaN(this.value)) {
                        this.value = '0';
                    } else if(parseFloat(this.value) < 0) {
                        this.value = '0';
                    } else if(parseFloat(this.value) > 1) {
                        this.value  = '1';
                    }
                }
            }
        }



        $(document).ready(function() {

            getImageStatus();
            setInputMinMax();

            //canvas = document.getElementById('imageCanvas');
            this.isOldIE = (window.G_vmlCanvasManager);
            $(function() {
              //  if (document.domain == 'localhost') {

                    if (this.isOldIE) {
                        G_vmlCanvasManager.initElement(imageCanvas);
                    }
                    var ctx = canvas.getContext('2d');
                    imageObj.crossOrigin = "Anonymous";

                    function init() {
                        canvas.addEventListener('mousedown', mouseDown, false);
                        canvas.addEventListener('mouseup', mouseUp, false);
                        canvas.addEventListener('mousemove', mouseMove, false);
                    }


                    // Draw  image onto the canvas
                    imageObj.onload = function() {
                        ctx.drawImage(imageObj, 0, 0);

                    };
                    imageObj.src = "poster/poster_1.jpg";



                    // Switch the blending mode
                    ctx.globalCompositeOperation = 'destination-over';

                    //mousemove event
                    $('#imageCanvas').mousemove(function(e) {
                        if (condition == 1 && mode == 0) {

                            ctx.beginPath();

                            posX = e.offsetX;
                            posY = e.offsetY;
        
                        }
                    });
                    //mousedown event
                    $('#imageCanvas').mousedown(function(e) {
                        if (condition == 1 && mode == 0) {

                            if (e.which == 1) {
                                var pointer = $('<span class="spot">').css({
                                    'position': 'absolute',
                                    'background-color': '#000000',
                                    'width': '5px',
                                    'height': '5px',
                                    'top': e.pageY,
                                    'left': e.pageX


                                });
                                //store the points on mousedown
                                points.push(e.pageX, e.pageY);

                                //console.log(points);

                                ctx.globalCompositeOperation = 'destination-out';
                                ctx.beginPath();
                                ctx.moveTo(prevX, prevY);
                                if (prevX != '') {
                                    ctx.lineTo(e.offsetX, e.offsetY);
                                    ctx.strokeStyle="#FF0000";
                                    ctx.stroke();
                                }
                                prevX = e.offsetX;
                                prevY = e.offsetY;
                            }
                            $(document.body).append(pointer);
                            posX = e.offsetX;
                            posY = e.offsetY;
                        }//condition
                    });



                    $('#restore-button').click(function() {
                        var ratioLabel = document.getElementById('ratio-label');
                        ratioLabel.value = '';
                        $('.spot').each(function() {
                            $(this).remove();

                        })
                        prevX = '';
                        prevY = '';
                        points = [];
                        condition = 1;
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.globalCompositeOperation = 'destination-over';
                        var imageObj = new Image();
                        imageObj.crossOrigin = "Anonymous";

                        // Draw  image onto the canvas
                        imageObj.onload = function() {
                            ctx.drawImage(imageObj, 0, 0);

                        };
                        imageObj.src = currDisplayedImage;
                    });

               // }
            });

        });

        $scope.onCalculateClick = function() {
            condition = 0;

            //  var pattern = ctx.createPattern(imageObj, "repeat");
            //ctx.fillStyle = pattern;
            $('.spot').each(function() {
                $(this).remove();

            })
            //clear canvas

            //var context = canvas.getContext("2d");

            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            var hiddenCtx = hiddenCanvas.getContext('2d');
            hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            hiddenCtx.beginPath();
            hiddenCtx.width = hiddenCanvas.width;
            hiddenCtx.height = hiddenCanvas.height;
            hiddenCtx.globalCompositeOperation = 'destination-over';
            //draw the polygon
            //setTimeout(function() {


                //console.log(points);
                var offset = $('#hiddenCanvas').offset();
                //console.log(offset.left,offset.top);


                for (var i = 0; i < points.length; i += 2) {
                    var x = parseInt(jQuery.trim(points[i]));
                    var y = parseInt(jQuery.trim(points[i + 1]));


                    if (i == 0) {
                        hiddenCtx.moveTo(x - offset.left, y - offset.top);
                    } else {
                        hiddenCtx.lineTo(x - offset.left, y - offset.top);
                    }
                    //console.log(points[i],points[i+1])
                }

                points = [];

                if (this.isOldIE) {

                    hiddenCtx.fillStyle = '';
                    hiddenCtx.fill();
                    var fill = $('fill', hiddenCanvas).get(0);
                    fill.color = '';
                    fill.src = element.src;
                    fill.type = 'tile';
                    fill.alignShape = false;
                }
                else {
                    var pattern = hiddenCtx.createPattern(imageObj, "repeat");
                    hiddenCtx.fillStyle = pattern;
                    hiddenCtx.fill();
                    var dataurl = hiddenCanvas.toDataURL("image/png");

                    var alphaPixels = 0;
                    var data = hiddenCtx.getImageData(0, 0, hiddenCtx.canvas.width, hiddenCtx.canvas.height).data;
                    for(var i = 3; i < data.length; i+=4) {
                        if(data[i] > 0) alphaPixels++;
                    }
                    var ratio = Math.round((alphaPixels/(hiddenCtx.canvas.width * hiddenCtx.canvas.height)) * 10000);
                    var currAmount = document.getElementById('ratio-label').value;
                    if(currAmount != '') {
                        document.getElementById('ratio-label').value = parseFloat(currAmount) + ratio/10000;
                    } else {
                        document.getElementById('ratio-label').value = ratio/10000;
                    }
                    if(currSection <= 6) {
                        if(currSection == 0) {
                            console.log("here");
                            $scope.form.rectangle.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 1) {
                            $scope.form.circle.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 2) {
                            $scope.form.tri.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 3) {
                            $scope.form.cap.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 4) {
                            $scope.form.hum1.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 5) {
                            $scope.form.hum2.area = document.getElementById('ratio-label').value;
                        } else if(currSection == 6) {
                            $scope.form.txt.area = document.getElementById('ratio-label').value;
                        }
                    }
                    condition = 1;
                    points = [];
                    prevX = '';
                    prevY = '';

                }

            //}, 20);

        };


        document.getElementById('imageCanvas').addEventListener('mousedown', function(event) {
            var rect = event.target.getBoundingClientRect();
            var x = Math.round(((event.pageX - rect.left)/rect.width)*10000);
            var y = Math.round(((event.pageY - rect.top)/rect.height)*10000);
            currX = x/10000;
            currY = y/10000;
            document.getElementById('coordinate-label-x').value = x/10000;
            document.getElementById('coordinate-label-y').value = y/10000;

        });

        $scope.captureCoordinates = function() {
            if(currSection == 0) {
                $scope.form.rectangle.x = currX;
                $scope.form.rectangle.y = currY;
            } else if(currSection == 1) {
                $scope.form.circle.x = currX;
                $scope.form.circle.y = currY;
            } else if(currSection == 2) {
                $scope.form.tri.x = currX;
                $scope.form.tri.y = currY;
            } else if(currSection == 3) {
                $scope.form.cap.x = currX;
                $scope.form.cap.y = currY;
            } else if(currSection == 4) {
                $scope.form.hum1.x = currX;
                $scope.form.hum1.y = currY;
            } else if(currSection == 5) {
                $scope.form.hum2.x = currX;
                $scope.form.hum2.y = currY;
            } else if(currSection == 6) {
                $scope.form.txt.x = currX;
                $scope.form.txt.y = currY;
            }
            
        }

        function clearForm() {
            $scope.form.rectangle.area = '0';
            $scope.form.rectangle.x = '0';
            $scope.form.rectangle.y = '0';
            $scope.form.rectangle.count = '0';
            $scope.form.rectangle.blur = '0';
            $scope.form.rectangle.z = '0';
            $scope.form.rectangle.direction = '0';

            $scope.form.circle.area = '0';
            $scope.form.circle.x = '0';
            $scope.form.circle.y = '0';
            $scope.form.circle.count = '0';
            $scope.form.circle.blur = '0';
            $scope.form.circle.z = '0';

            $scope.form.tri.area = '0';
            $scope.form.tri.x = '0';
            $scope.form.tri.y = '0';
            $scope.form.tri.count = '0';
            $scope.form.tri.blur = '0';
            $scope.form.tri.z = '0';
            $scope.form.tri.direction = '0';

            $scope.form.cap.area = '0';
            $scope.form.cap.x = '0';
            $scope.form.cap.y = '0';
            $scope.form.cap.count = '0';
            $scope.form.cap.blur = '0';
            $scope.form.cap.z = '0';
            $scope.form.cap.direction = '0';

            $scope.form.hum1.area = '0';
            $scope.form.hum1.x = '0';
            $scope.form.hum1.y = '0';
            $scope.form.hum1.count = '0';
            $scope.form.hum1.z = '0';
            $scope.form.hum1.direction = '0';

            $scope.form.hum2.area = '0';
            $scope.form.hum2.x = '0';
            $scope.form.hum2.y = '0';
            $scope.form.hum2.count = '0';
            $scope.form.hum2.z = '0';
            $scope.form.hum2.direction = '0';

            $scope.form.txt.area = '0';
            $scope.form.txt.x = '0';
            $scope.form.txt.y = '0';
            $scope.form.txt.count = '0';
            $scope.form.txt.z = '0';
            $scope.form.txt.direction = '0';

            $scope.form.back.c1 = '0';
            $scope.form.back.c2 = '0';
            $scope.form.back.c3 = '0';
            $scope.form.back.c4 = '0';
            $scope.form.back.c5 = '0';
            $scope.form.back.g1 = '0';
            $scope.form.back.g2 = '0';
            $scope.form.back.g3 = '0';
            $scope.form.back.g4 = '0';
            $scope.form.back.g5 = '0';
            $scope.form.back.g6 = '0';
            $scope.form.back.g7 = '0';
            $scope.form.back.g8 = '0';
            $scope.form.back.direction = '0';

            $scope.form.hue.c1 = '0';
            $scope.form.hue.c2 = '0';
            $scope.form.hue.c3 = '0';
            $scope.form.hue.c4 = '0';
            $scope.form.hue.c5 = '0';
            $scope.form.hue.c6 = '0';
            $scope.form.hue.c7 = '0';
            $scope.form.hue.c8 = '0';
            $scope.form.hue.c9 = '0';
            $scope.form.hue.c10 = '0';
            $scope.form.hue.g1 = '0';
            $scope.form.hue.g2 = '0';
            $scope.form.hue.g3 = '0';
            $scope.form.hue.g4 = '0';
            $scope.form.hue.g5 = '0';
            $scope.form.hue.g6 = '0';
            $scope.form.hue.g7 = '0';
            $scope.form.hue.g8 = '0';
            $scope.form.hue.g9 = '0';
            $scope.form.hue.g10 = '0';
            $scope.form.hue.g11 = '0';
            $scope.form.hue.g12 = '0';
            $scope.form.hue.direction = '0';

             document.getElementById("image-rank-check").checked = true;
        }

        function getNewImageData() {
            var userResource = $resource('/getPhotoData', {});
            userResource.get({_id:currDisplayedImage}, function(responseData) {
                //console.log(res);
                //var responseData = JSON.parse(res);
                document.getElementById("image-rank-check").checked = responseData.image_rank;

                $scope.form.rectangle.area = responseData.rectangle.area;
                $scope.form.rectangle.x = responseData.rectangle.x;
                $scope.form.rectangle.y = responseData.rectangle.y;
                $scope.form.rectangle.count = responseData.rectangle.count;
                $scope.form.rectangle.blur = responseData.rectangle.blur;
                $scope.form.rectangle.z = responseData.rectangle.z;
                $scope.form.rectangle.direction = responseData.rectangle.direction;

                $scope.form.circle.area = responseData.circle.area;
                $scope.form.circle.x = responseData.circle.x;
                $scope.form.circle.y = responseData.circle.y;
                $scope.form.circle.count = responseData.circle.count;
                $scope.form.circle.blur = responseData.circle.blur;
                $scope.form.circle.z = responseData.circle.z;

                $scope.form.tri.area = responseData.triangle.area;
                $scope.form.tri.x = responseData.triangle.x;
                $scope.form.tri.y = responseData.triangle.y;
                $scope.form.tri.count = responseData.triangle.count;
                $scope.form.tri.blur = responseData.triangle.blur;
                $scope.form.tri.z = responseData.triangle.z;
                $scope.form.tri.direction = responseData.triangle.direction;

                $scope.form.cap.area = responseData.capsule.area;
                $scope.form.cap.x = responseData.capsule.x;
                $scope.form.cap.y = responseData.capsule.y;
                $scope.form.cap.count = responseData.capsule.count;
                $scope.form.cap.blur = responseData.capsule.blur;
                $scope.form.cap.z = responseData.capsule.z;
                $scope.form.cap.direction = responseData.capsule.direction;

                $scope.form.hum1.area = responseData.human_1.area;
                $scope.form.hum1.x = responseData.human_1.x;
                $scope.form.hum1.y = responseData.human_1.y;
                $scope.form.hum1.count = responseData.human_1.count;
                $scope.form.hum1.z = responseData.human_1.z;
                $scope.form.hum1.direction = responseData.human_1.direction;

                $scope.form.hum2.area = responseData.human_2.area;
                $scope.form.hum2.x = responseData.human_2.x;
                $scope.form.hum2.y = responseData.human_2.y;
                $scope.form.hum2.count = responseData.human_2.count;
                $scope.form.hum2.z = responseData.human_2.z;
                $scope.form.hum2.direction = responseData.human_2.direction;

                $scope.form.txt.area = responseData.txt.area;
                $scope.form.txt.x = responseData.txt.x;
                $scope.form.txt.y = responseData.txt.y;
                $scope.form.txt.count = responseData.txt.count;
                $scope.form.txt.z = responseData.txt.z;
                $scope.form.txt.direction = responseData.txt.direction;

                $scope.form.back.c1 = responseData.back.c1;
                $scope.form.back.c2 = responseData.back.c2;
                $scope.form.back.c3 = responseData.back.c3;
                $scope.form.back.c4 = responseData.back.c4;
                $scope.form.back.c5 = responseData.back.c5;
                $scope.form.back.g1 = responseData.back.g1;
                $scope.form.back.g2 = responseData.back.g2;
                $scope.form.back.g3 = responseData.back.g3;
                $scope.form.back.g4 = responseData.back.g4;
                $scope.form.back.g5 = responseData.back.g5;
                $scope.form.back.g6 = responseData.back.g6;
                $scope.form.back.g7 = responseData.back.g7;
                $scope.form.back.g8 = responseData.back.g8;
                $scope.form.back.direction = responseData.back.direction;

                $scope.form.hue.c1 = responseData.hue.c1;
                $scope.form.hue.c2 = responseData.hue.c2;
                $scope.form.hue.c3 = responseData.hue.c3;
                $scope.form.hue.c4 = responseData.hue.c4;
                $scope.form.hue.c5 = responseData.hue.c5;
                $scope.form.hue.c6 = responseData.hue.c6;
                $scope.form.hue.c7 = responseData.hue.c7;
                $scope.form.hue.c8 = responseData.hue.c8;
                $scope.form.hue.c9 = responseData.hue.c9;
                $scope.form.hue.c10 = responseData.hue.c10;
                $scope.form.hue.g1 = responseData.hue.g1;
                $scope.form.hue.g2 = responseData.hue.g2;
                $scope.form.hue.g3 = responseData.hue.g3;
                $scope.form.hue.g4 = responseData.hue.g4;
                $scope.form.hue.g5 = responseData.hue.g5;
                $scope.form.hue.g6 = responseData.hue.g6;
                $scope.form.hue.g7 = responseData.hue.g7;
                $scope.form.hue.g8 = responseData.hue.g8;
                $scope.form.hue.g9 = responseData.hue.g9;
                $scope.form.hue.g10 = responseData.hue.g10;
                $scope.form.hue.g11 = responseData.hue.g11;
                $scope.form.hue.g12 = responseData.hue.g12;
                $scope.form.hue.direction = responseData.hue.direction;

                console.log($scope.form);

            }, function errorHandling(err) {
                clearForm();
            });
        }

        $scope.setImage = function(filename) {
            var ratioLabel = document.getElementById('ratio-label');
            ratioLabel.value = '';
            submitForm(false);
            currDisplayedImage = filename;
            $('.spot').each(function() {
                $(this).remove();

            })
            prevX = '';
            prevY = '';
            points = [];
            condition = 1;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var hiddenCtx = hiddenCanvas.getContext('2d');
            hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
            ctx.globalCompositeOperation = 'destination-over';
            imageObj = new Image();
            imageObj.crossOrigin = "Anonymous";

            // Draw  image onto the canvas
            imageObj.onload = function() {
                ctx.drawImage(imageObj, 0, 0);

            };
            imageObj.src = currDisplayedImage;
            getNewImageData();
            document.getElementById("submit-success-label").style.visibility = "hidden";
        }

        /**
        Check if all entries are filled.
        */
        function isFormComplete() {

            if($scope.form.rectangle.area == '' || $scope.form.rectangle.x == '' || $scope.form.rectangle.y == '' ||
                $scope.form.rectangle.count == '' || $scope.form.rectangle.blur == '' || $scope.form.rectangle.z == '' ||
                $scope.form.rectangle.direction == '') return false;

            if($scope.form.circle.area == '' || $scope.form.circle.x == '' || $scope.form.circle.y == '' ||
                $scope.form.circle.count == '' || $scope.form.circle.blur == '' || $scope.form.circle.z == '') return false;

            if($scope.form.tri.area == '' || $scope.form.tri.x == '' || $scope.form.tri.y == '' ||
                $scope.form.tri.count == '' || $scope.form.tri.blur == '' || $scope.form.tri.z == '' ||
                $scope.form.tri.direction == '') return false;

            if($scope.form.cap.area == '' || $scope.form.cap.x == '' || $scope.form.cap.y == '' ||
                $scope.form.cap.count == '' || $scope.form.cap.blur == '' || $scope.form.cap.z == '' ||
                $scope.form.cap.direction == '') return false;

             if($scope.form.hum1.area == '' || $scope.form.hum1.x == '' || $scope.form.hum1.y == '' ||
                $scope.form.hum1.count == '' || $scope.form.hum1.blur == '' || $scope.form.hum1.z == '' ||
                $scope.form.hum1.direction == '') return false;

             if($scope.form.hum2.area == '' || $scope.form.hum2.x == '' || $scope.form.hum2.y == '' ||
                $scope.form.hum2.count == '' || $scope.form.hum2.blur == '' || $scope.form.hum2.z == '' ||
                $scope.form.hum2.direction == '') return false;

             if($scope.form.txt.area == '' || $scope.form.txt.x == '' || $scope.form.txt.y == '' ||
                $scope.form.txt.count == '' || $scope.form.txt.blur == '' || $scope.form.txt.z == '' ||
                $scope.form.txt.direction == '') return false;

            if($scope.form.back.c1 == '' || $scope.form.back.c2 == '' || $scope.form.back.c3 == '' || $scope.form.back.c4 == '' ||
                $scope.form.back.c5 == '' || $scope.form.back.g1 == '' || $scope.form.back.g2 == '' || $scope.form.back.g3 == '' || 
                $scope.form.back.g4 == '' || $scope.form.back.g5 == '' || $scope.form.back.g6 == '' || $scope.form.back.g7 == '' || 
                $scope.form.back.g8 == '' || $scope.form.back.direction == '') return false;

            if($scope.form.hue.c1 == '' || $scope.form.hue.c2 == '' || $scope.form.hue.c3 == '' || $scope.form.hue.c4 == '' 
                || $scope.form.hue.c5 == '' || $scope.form.hue.c6 == '' || $scope.form.hue.c7 == '' || $scope.form.hue.c8 == '' ||
                $scope.form.hue.c9 == '' || $scope.form.hue.c10 == '' || $scope.form.hue.g1 == '' || $scope.form.hue.g2 == '' || 
                $scope.form.hue.g3 == '' || $scope.form.hue.g4 == '' || $scope.form.hue.g5 == '' || $scope.form.hue.g6 == '' || 
                $scope.form.hue.g7 == '' || $scope.form.hue.g8 == '' || $scope.form.hue.g9 == '' || $scope.form.hue.g10 == '' ||
                $scope.form.hue.g11 == '' || $scope.form.hue.g12 == '' || $scope.form.hue.direction == '') return false;

            return true;
        
        }

        /**
        Post data to database
        */
        function submitForm(isFinalSubmit) {
            if(!isFormComplete()) {
                alert("Please fill out all entries.")
                return;
            }
            var formData = $resource('/submitForm');
            var rect = {area:$scope.form.rectangle.area, x:$scope.form.rectangle.x, y:$scope.form.rectangle.y,
                count:$scope.form.rectangle.count, blur:$scope.form.rectangle.blur, 
                z:$scope.form.rectangle.z, direction:$scope.form.rectangle.direction};

            var circle = {area:$scope.form.circle.area, x:$scope.form.circle.x, y:$scope.form.circle.y,
                count:$scope.form.circle.count, blur:$scope.form.circle.blur, 
                z:$scope.form.circle.z};

            var triangle = {area:$scope.form.tri.area, x:$scope.form.tri.x, y:$scope.form.tri.y,
                count:$scope.form.tri.count, blur:$scope.form.tri.blur, 
                z:$scope.form.tri.z, direction:$scope.form.tri.direction};

            var capsule = {area:$scope.form.cap.area, x:$scope.form.cap.x, y:$scope.form.cap.y,
                count:$scope.form.cap.count, blur:$scope.form.cap.blur, 
                z:$scope.form.cap.z, direction:$scope.form.cap.direction};

            var human_1 = {area:$scope.form.hum1.area, x:$scope.form.hum1.x, y:$scope.form.hum1.y,
                count:$scope.form.hum1.count, 
                z:$scope.form.hum1.z, direction:$scope.form.hum1.direction};

            var human_2 = {area:$scope.form.hum2.area, x:$scope.form.hum2.x, y:$scope.form.hum2.y,
                count:$scope.form.hum2.count,
                z:$scope.form.hum2.z, direction:$scope.form.hum2.direction};

            var text = {area:$scope.form.txt.area, x:$scope.form.txt.x, y:$scope.form.txt.y,
                count:$scope.form.txt.count, 
                z:$scope.form.txt.z, direction:$scope.form.txt.direction};

            var background = {c1:$scope.form.back.c1, c2:$scope.form.back.c2, c3:$scope.form.back.c3,
                c4:$scope.form.back.c4, c5:$scope.form.back.c5, g1:$scope.form.back.g1,
                g2:$scope.form.back.g2, g3:$scope.form.back.g3, g4:$scope.form.back.g4,
                g5:$scope.form.back.g5, g6:$scope.form.back.g6, g7:$scope.form.back.g7,
                g8:$scope.form.back.g8, direction:$scope.form.back.direction};

            var hue = {c1:$scope.form.hue.c1, c2:$scope.form.hue.c2, c3:$scope.form.hue.c3, c4:$scope.form.hue.c4,
                c5:$scope.form.hue.c5, c6:$scope.form.hue.c6, c7:$scope.form.hue.c7, c8:$scope.form.hue.c8,
                c9:$scope.form.hue.c9, c10:$scope.form.hue.c10, g1:$scope.form.hue.g1, g2:$scope.form.hue.g2,
                g3:$scope.form.hue.g3, g4:$scope.form.hue.g4, g5:$scope.form.hue.g5, g6:$scope.form.hue.g6,
                g7:$scope.form.hue.g7, g8:$scope.form.hue.g8, g9:$scope.form.hue.g9, g10:$scope.form.hue.g10, 
                g11:$scope.form.hue.g11, g12:$scope.form.hue.g12, direction:$scope.form.hue.direction};

            if(isFinalSubmit) {
                for(var i = 0; i < $scope.images.length; i++) {
                    if($scope.images[i].filename === currDisplayedImage) {
                        $scope.images[i].submit_status = isFinalSubmit;
                    }
                }
            }

            formData.save({_id:currDisplayedImage, submit_status:isFinalSubmit, image_rank:document.getElementById("image-rank-check").checked,
                rectangle:rect, circle:circle, triangle:triangle,
                capsule:capsule, human_1:human_1, human_2:human_2, txt:text, back:background,
                hue:hue},
                function data(res) {
                    if(res.status === 400) {
                        alert("error");
                    }
                }, function errorHandling(err) {
                    if(err) {
                        alert('Submit error: Please try again later.');
                    }
                });

        }

        $('#submit-form-button').click(function() {
            submitForm(true);
            document.getElementById("submit-success-label").style.visibility = "visible";
        });

        $scope.setSection = function(num) {
            sections[currSection].style.backgroundColor = '#c8daf7';
            currSection = num;
            sections[currSection].style.backgroundColor = '#70a1ef';
        }

        $('input[type="radio"]').click(function(){
            var $radio = $(this);

            // if this was previously checked
            if ($radio.data('waschecked') == true)
            {
                $radio.prop('checked', false);
                $radio.data('waschecked', false);
            }
            else
            {
                 $radio.prop('checked', true);
                 $radio.data('waschecked', true);
            }
        });

        $scope.setMode = function(num) {
            if(num != mode) {
                if(num == 0) {
                    document.getElementById('lasso-button').style.backgroundColor = '#a4bfea';
                    document.getElementById('point-button').style.backgroundColor = '#f9f9f9';
                    document.getElementById('point-controller').style.display = 'none';
                    document.getElementById('lasso-controller').style.display = 'block';
                } else {
                    document.getElementById('point-button').style.backgroundColor = '#a4bfea';
                    document.getElementById('lasso-button').style.backgroundColor = '#f9f9f9';
                    document.getElementById('lasso-controller').style.display = 'none';
                    document.getElementById('point-controller').style.display = 'block';
                }
                mode = num;
            }
        };
        
    }]);
