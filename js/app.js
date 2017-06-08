var Maze = require('Maze'),
    Point = require('Point');

function init() {
    var canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d'),
        image = document.createElement('img');

    image.onload = function () {
        canvas.width = this.width;
        canvas.height = this.height;

        ctx.drawImage(this, 0, 0);

        var maze = new Maze(canvas),
            start = new Point(45, 190);

        maze.solve(start);
    };
    image.src = './maze.jpg';
}

window.addEventListener('load', init);
