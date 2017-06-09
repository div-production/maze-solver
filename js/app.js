var Maze = require('Maze'),
    Point = require('Point');

var start = new Point(300, 200);

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        video = document.getElementById('video'),
        width,
        height;

    window.addEventListener('click' ,function (e) {
        start.x = e.clientX;
        start.y = e.clientY;
    });

    video.addEventListener('play', function () {
        width = canvas.width= window.innerWidth;
        height = canvas.height = window.innerHeight;
        draw();
    }, false);

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then(function (stream) {
        video.srcObject = stream;
        video.play();
    });

    function draw() {
        if (video.paused || video.ended) {
            return false;
        }
        ctx.drawImage(video, 0, 0, width, height);

        var maze = new Maze(canvas);
        maze.solve(start);

        setTimeout(draw, 20);
    }
}, false);


