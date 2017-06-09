(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Maze = require('Maze'),
    Point = require('Point');

var start = new Point(300, 200);

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        video = document.getElementById('video'),
        width,
        height;

    window.addEventListener('click', function (e) {
        start.x = e.clientX;
        start.y = e.clientY;
    });

    video.addEventListener('play', function () {
        width = canvas.width = window.innerWidth;
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

},{"Maze":3,"Point":5}],2:[function(require,module,exports){
var Point = require('Point');

/**
 * @param {Array[]} data
 * @constructor
 */
function Matrix(data) {
    this.data = data;
    this.width = data[0].length;
    this.height = data.length;
}

Matrix.prototype = {
    /**
     * @type {Array[]}
     */
    data: [],

    /**
     * @type (Number) ширина матрицы
     */
    width: null,

    /**
     * @type {Number} высота матрицы
     */
    height: null,

    /**
     * получение числа элементов матрицы
     *
     * @returns {number}
     */
    getLength: function () {
        return this.data.length * this.data[0].length;
    },

    /**
     * получение значения элемента матрицы
     *
     * @param {number} x
     * @param {number} y
     * @returns {*}
     */
    getItem: function (x, y) {
        if (this.data[y] && this.data[y][x] !== undefined) {
            return this.data[y][x];
        }
    },

    /**
     * установка значения элемента матрицы по координатам переданной точки
     *
     * @param {Point} point
     * @param value
     */
    setPoint: function (point, value) {
        if (this.data[point.y] && this.data[point.y][point.x] !== undefined) {
            this.data[point.y][point.x] = value;
        }
    }
};

module.exports = Matrix;

},{"Point":5}],3:[function(require,module,exports){
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
            diff = 0,
            avgColor = this.getAverageColor(imageData.data);

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

            diff = Math.abs(pixel.r - avgColor.r) + Math.abs(pixel.g - avgColor.g) + Math.abs(pixel.b - avgColor.b);

            if (diff < 80) {
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
     * нахождение выхода из лабиринта
     *
     * @param {Point} start
     */
    solve: function (start) {
        var route = new Router(),
            wave = new Wave(this.matrix),
            winner;

        this.drawStart(start);

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
    },

    /**
     * отрисовка пути по точкам
     *
     * @param {Point[]} points
     */
    drawPath: function (points) {
        var point;

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.stroke();
    },

    /**
     * отрисовка начальной точки
     *
     * @param {Point} point
     */
    drawStart: function (point) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'green';
        this.ctx.fill();
    },

    /**
     * получение усреднённого цвета для картинки
     *
     * @param {Uint8ClampedArray} data
     * @returns {{r: number, g: number, b: number}}
     */
    getAverageColor: function (data) {
        var color = {
                r: 0,
                g: 0,
                b: 0
            },
            count = 0;

        for (var i = 0; i < data.length; i += 4) {
            count++;

            color.r += data[i];
            color.g += data[i + 1];
            color.b += data[i + 2];
        }

        color.r /= count;
        color.g /= count;
        color.b /= count;

        return color;
    }
};

module.exports = Maze;

},{"Matrix":2,"Path":4,"Router":6,"Wave":8}],4:[function(require,module,exports){
/**
 * @param {Path} parent
 * @constructor
 */
function Path(parent) {
    this.parent = parent;
    this.points = [];
}

Path.prototype = {
    /**
     * @type {Path}
     */
    parent: null,

    /**
     * @type {Point[]}
     */
    points: [],

    /**
     * добавление точки в путь
     *
     * @param {Point} point
     */
    addPoint: function (point) {
        this.points.push(point);
    },

    /**
     * получение массива всех точек (включая родительские пути)
     *
     * @returns {Point[]}
     */
    getPoints: function () {
        if (this.parent) {
            return this.parent.getPoints().concat(this.points);
        } else {
            return this.points;
        }
    }
};

module.exports = Path;

},{}],5:[function(require,module,exports){
/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype = {
    /**
     * @type {number|null}
     */
    x: null,

    /**
     * @type {number|null}
     */
    y: null,

    /**
     * получение расстояния до другой точки
     *
     * @param {Point} point
     * @param {bool} [real] если установлен в true, то вычисляется реальное расстояние между точками (по теореме Пифагора)
     * если false, то вычисляется максимальное расстояние по x и y
     * @returns {number}
     */
    getDistance: function (point, real) {
        var x = Math.abs(this.x - point.x),
            y = Math.abs(this.y - point.y);

        if (real) {
            return Math.sqrt(x * x + y * y);
        } else {
            return Math.max(x, y);
        }
    }
};

module.exports = Point;

},{}],6:[function(require,module,exports){
var Path = require('Path');

/**
 * @constructor
 */
function Router() {
    this.waves = [];
}

Router.prototype = {
    /**
     * @type {Wave[]}
     */
    waves: [],

    /**
     * счётчик, отвечает за сохранение точек в массив пути
     *
     * @type {number}
     */
    counter: 0,

    /**
     * установка края пути
     *
     * @param {Wave} wave
     */
    setWave: function (wave) {
        this.waves.push(wave);
    },

    /**
     * продвижение края всех волн на одну единицу
     * возвращает объект волны, если выход найден
     *
     * @returns {Wave|null}
     */
    step: function () {
        if (!this.waves.length) {
            return;
        }

        var newWaves = [],
            wave,
            childWaves;

        for (var i = 0; i < this.waves.length; i++) {

            wave = this.waves[i];
            childWaves = wave.propagate();

            if (childWaves === true) {
                return wave;
            }
            if (childWaves.length > 1) {
                for (j = 0; j < childWaves.length; j++) {
                    childWaves[j].path = new Path(childWaves[j].path);
                }
            }
            newWaves = newWaves.concat(childWaves);

            if (this.counter % 10 == 0) {
                wave.savePathPoint();
            }
        }
        this.waves = newWaves;

        this.counter++;
    }
};

module.exports = Router;

},{"Path":4}],7:[function(require,module,exports){
function Sector() {
    this.geometry = [];
}

Sector.prototype = {
    /**
     * @type {Point[]}
     */
    geometry: [],

    /**
     * добавление точки к сектору
     *
     * @param {Point} point
     */
    addPoint: function (point) {
        this.geometry.push(point);
    },

    /**
     * получение числа точек в секторе
     *
     * @returns {number}
     */
    getLength: function () {
        return this.geometry.length;
    },

    /**
     * получение первой точки сектора (по часовой стрелке)
     *
     * @returns {Point}
     */
    getFirstPoint: function () {
        if (this.geometry[0]) {
            return this.geometry[0];
        }
    },

    /**
     * получение последней точки сектора (по часовой стрелке)
     *
     * @returns {Point}
     */
    getLastPoint: function () {
        var length = this.geometry.length;
        if (this.geometry[length - 1]) {
            return this.geometry[length - 1];
        }
    },

    /**
     * объединение двух секторов
     *
     * @param {Sector} sector добавляется в конец текущего сектора
     */
    merge: function (sector) {
        this.geometry = this.geometry.concat(sector.geometry);
    }
};

module.exports = Sector;

},{}],8:[function(require,module,exports){
var Point = require('Point'),
    Sector = require('Sector');

/**
 * @param {Matrix} matrix
 * @constructor
 */
function Wave(matrix) {
    this.geometry = [];
    this.matrix = matrix;
}

Wave.prototype = {
    /**
     * @type {Point[]}
     */
    geometry: [],

    /**
     * @type {Matrix}
     */
    matrix: null,

    /**
     * @type {Wave}
     */
    parent: null,

    /**
     * @type {Path}
     */
    path: null,

    /**
     * продвижение волны на одну единицу
     * @returns {Wave[]}
     */
    propagate: function () {
        var newPoints = [],
            point,
            newPoint,
            matrix = this.matrix,
            top, left, bottom, right;

        for (var i = 0; i < this.geometry.length; i++) {
            point = this.geometry[i];
            top = left = right = bottom = undefined;
            matrix.setPoint(point, 2);

            if (point.x == 1 || point.x == matrix.width - 1 || point.y == 1 || point.y == matrix.height - 1) {
                return true;
            }

            if (matrix.getItem(point.x, point.y - 1) === 0) {
                top = new Point(point.x, point.y - 1);
            }

            if (matrix.getItem(point.x + 1, point.y) === 0) {
                right = new Point(point.x + 1, point.y);
            }

            if (matrix.getItem(point.x, point.y + 1) === 0) {
                bottom = new Point(point.x, point.y + 1);
            }

            if (matrix.getItem(point.x - 1, point.y) === 0) {
                left = new Point(point.x - 1, point.y);
            }

            // top
            if (top && !left) {
                newPoints.push(top);
                matrix.setPoint(top, 2);
            }

            // right-top
            if (matrix.getItem(point.x + 1, point.y - 1) === 0 && right && top) {
                newPoint = new Point(point.x + 1, point.y - 1);
                newPoints.push(newPoint);
                matrix.setPoint(newPoint, 2);
            }

            // right
            if (right) {
                newPoints.push(right);
                matrix.setPoint(right, 2);
            }

            // right-bottom
            if (matrix.getItem(point.x + 1, point.y + 1) === 0 && right && bottom) {
                newPoint = new Point(point.x + 1, point.y + 1);
                newPoints.push(newPoint);
                matrix.setPoint(newPoint, 2);
            }

            // bottom
            if (bottom) {
                newPoints.push(bottom);
                matrix.setPoint(bottom, 2);
            }

            // left-bottom
            if (matrix.getItem(point.x - 1, point.y + 1) === 0 && left && bottom) {
                newPoint = new Point(point.x - 1, point.y + 1);
                newPoints.push(newPoint);
                matrix.setPoint(newPoint, 2);
            }

            // left
            if (left) {
                newPoints.push(left);
                matrix.setPoint(left, 2);
            }

            // left-top
            if (matrix.getItem(point.x - 1, point.y - 1) === 0 && left && top) {
                newPoint = new Point(point.x - 1, point.y - 1);
                newPoints.push(newPoint);
                matrix.setPoint(newPoint, 2);
            }

            if (top && left) {
                newPoints.push(top);
                matrix.setPoint(top, 2);
            }
        }

        var sectors = this.splitGeometry(newPoints),
            result = [],
            newWave;

        for (i = 0; i < sectors.length; i++) {
            newWave = this.create(sectors[i].geometry);
            result.push(newWave);
        }

        return result;
    },

    /**
     * поиск секторов в волне (если произошло деление)
     *
     * @param {Point[]} geometry
     * @returns {Sector[]}
     */
    splitGeometry: function (geometry) {
        if (geometry.length == 0) {
            return [];
        }

        var sectors = [],
            currentSector = new Sector(),
            point = geometry[0],
            nextPoint,
            distance;

        currentSector.addPoint(point);

        for (var i = 1; i < geometry.length; i++) {
            nextPoint = geometry[i];
            distance = point.getDistance(nextPoint);
            if (distance == 1) {
                currentSector.addPoint(nextPoint);
            } else {
                sectors.push(currentSector);
                currentSector = new Sector();
            }
            point = nextPoint;
        }

        if (currentSector.getLength()) {
            var firstSector = sectors[0];
            if (firstSector && firstSector != currentSector) {
                var firstPoint = firstSector.getFirstPoint(),
                    lastPoint = currentSector.getLastPoint();

                if (firstPoint && lastPoint && firstPoint.getDistance(lastPoint) == 1) {
                    currentSector.merge(firstSector);
                } else {
                    sectors.push(currentSector);
                }
            } else {
                sectors.push(currentSector);
            }
        }

        return sectors;
    },

    /**
     * получение центра волны
     *
     * @returns {Point|null}
     */
    getCenter: function () {
        var length = this.geometry.length;
        if (!length) {
            return null;
        }

        var centerKey = Math.floor(length / 2);
        return this.geometry[centerKey];
    },

    /**
     * создание дочерней волны
     *
     * @param {Point[]} geometry
     * @returns {Wave}
     */
    create: function (geometry) {
        var wave = new Wave(this.matrix);
        wave.geometry = geometry;
        wave.path = this.path;
        return wave;
    },

    /**
     * сохранение центра текущеё волны в массив точек пути
     */
    savePathPoint: function () {
        var center = this.getCenter();
        this.path.addPoint(center);
    }
};

module.exports = Wave;

},{"Point":5,"Sector":7}]},{},[1])
//# sourceMappingURL=app.js.map