var Maze = require('Maze'),
    Point = require('Point');

var start = new Point(300, 200);

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function () {

    // Grab elements, create settings, etc.
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        video = document.getElementById('video'),
        videoObj = {'video': true},
        back = document.createElement('canvas'),
        backContext = back.getContext('2d'),
        errBack = function (error) {
            console.log('Video capture error: ', error.code);
        },
        w, h;

    window.addEventListener('click' ,function (e) {
        start = new Point(e.clientX, e.clientY);
    });

    video.addEventListener('play', function () {
        alert();
        w = canvas.width = back.width = backContext.width = window.innerWidth;
        h = canvas.height = back.height = backContext.height = window.innerHeight;
        draw(video, canvas, context, backContext, w, h);
    }, false);

    // Put video listeners into place
    /*if (navigator.getUserMedia) { // Standard

        navigator.getUserMedia(videoObj, function (stream) {
            video.srcObject = stream;
            video.play();
            console.log(stream);
        }, errBack);
    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed

        navigator.webkitGetUserMedia(videoObj, function (stream) {
            video.srcObject = window.webkitURL.createObjectURL(stream);
            video.play();

        }, errBack);
    }
    else if (navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia(videoObj, function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }*/

    function getUserMedia(config, success, error) {

        try {
            (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia).call(navigator, config, success, error);
        } catch (e) {
            alert(e);
        }


    }
    var mediaStream;

    var config = {
        audio: false,
        video: true
    };
    getUserMedia(config, function (stream) {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        video.play();
        mediaStream = stream;

    }, function (err) {
        alert('err');
        switch(err.name) {
            case 'PermissionDeniedError':
            case 'NotAllowedError':
            case 'SecurityError':
                manager.showError('Please allow access to your camera');
                break;
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                manager.showError('There is no connected camera');
                break;
            default:
                manager.showError('There is no connected camera');
        }
    });
}, false);

function draw(v, canvas, ctx, bc, w, h) {
    if (v.paused || v.ended)    return false;
    // First, draw it into the backing canvas
    bc.drawImage(v, 0, 0, w, h);
    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0, 0, w, h);
    var data = idata.data;
    ctx.putImageData(idata, 0, 0);
    // Loop through the pixels, turning them grayscale
    var maze = new Maze(canvas);

    maze.solve(start);
    //idata.data = data;
    // Draw the pixels onto the visible canvas

    // Start over!

    setTimeout(draw, 20, v, canvas, ctx, bc, w, h);
}


