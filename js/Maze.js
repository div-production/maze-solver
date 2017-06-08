var Router = require('Router'),
    Wave = require('Wave'),
    Matrix = require('Matrix'),
    Path = require('Path');

/**
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
function Maze(canvas) {
    this.ctx = canvas.getContext('2d');
    var imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.matrix = this._createMatrix(imageData);
    window.ctx = this.ctx;
}

Maze.prototype = {
    /**
     * @type {HTMLCanvasElement}
     */
    canvas: null,

    /**
     * @type {CanvasRenderingContext2D}
     */
    ctx: null,

    /**
     * @type {Matrix}
     */
    matrix: null,

    /**
     * @type {Point}
     */
    startPoint: null,

    /**
     * создние матрицы из данных изображения
     *
     * @param imageData
     * @returns {*}
     * @private
     */
    _createMatrix: function (imageData) {
        var data = imageData.data,
            result = [],
            row,
            width = imageData.width,
            pixel,
            pixelNum;

        for (var i = 0; i < data.length; i += 4) {
            pixel = {
                r: data[i],
                g: data[i + 1],
                b: data[i + 2]
            };
            pixelNum = i / 4;

            if (pixelNum % width == 0) {
                row = [];
                result.push(row);
            }

            if (Math.min(pixel.r, pixel.g, pixel.b) > 50) {
                row.push(0);
            } else {
                row.push(1);
            }
        }

        var matrix = new Matrix(result);
        matrix.width = imageData.width;
        matrix.height = imageData.height;

        return matrix;
    },

    /**
     * @param {Point} start
     */
    solve: function (start) {
        this.startPoint = start;

        var route = new Router(),
            wave = new Wave(this.matrix),
            winner;

        wave.geometry = [start];
        wave.path = new Path();
        wave.path.addPoint(start);

        route.setWave(wave);

        for (var i = 0; i < 100000; i++) {
            winner = route.step();
            if (winner) {
                var points = winner.path.getPoints();
                this.drawPath(points);
                break;
            }
        }
        /*setInterval(function () {
            route.step();
        }, 50);*/
        /*window.addEventListener('click', function () {
            route.step();
        });*/
    },


    drawPath: function (points) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            ctx.lineTo(point.x, point.y);
            //window.ctx.fillRect(point.x, point.y, 1, 1);
        }
        ctx.stroke();
    }
};

module.exports = Maze;
