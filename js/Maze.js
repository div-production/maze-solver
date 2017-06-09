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
            pixelNum,
            diff = 0;

        var rowId = 0 , colId = 0;

        var color = this.getAverageColor(imageData.data);

        //this.ctx.fillStyle = 'rgba(255,255,0,0.5)';

        for (var i = 0; i < data.length; i += 4) {
            pixel = {
                r: data[i],
                g: data[i + 1],
                b: data[i + 2]
            };
            pixelNum = i / 4;

            if (pixelNum % width == 0) {
                row = [];
                rowId = result.push(row);
            }

            diff = Math.abs(pixel.r - color.r) + Math.abs(pixel.g - color.g) + Math.abs(pixel.b - color.b);

            if (diff < 45) {
                colId = row.push(0);

            } else {
                colId = row.push(1);
                //this.ctx.fillRect(colId, rowId, 1, 1);
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

        ctx.beginPath();
        ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        var route = new Router(),
            wave = new Wave(this.matrix),
            winner;

        wave.geometry = [start];
        wave.path = new Path();
        wave.path.addPoint(start);

        route.setWave(wave);

        for (var i = 0; i < this.matrix.getLength(); i++) {
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
        ctx.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            ctx.lineTo(point.x, point.y);
            //window.ctx.fillRect(point.x, point.y, 1, 1);
        }
        ctx.stroke();
    },

    getAverageColor: function (data) {
        var color = {
            r: 0,
            g: 0,
            b: 0
        };
        var count = 0;
        for (var i = 0; i < data.length; i += 4) {
            count++;

            color.r += data[i];
            color.g += data[i + 1];
            color.b += data[i + 2];

            pixelNum = i / 4;
        }

        color.r /= count;
        color.g /= count;
        color.b /= count;

        return color;
    }
};

module.exports = Maze;
