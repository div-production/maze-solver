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
     * получение секторов волны
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

    getCenter: function () {
        var length = this.geometry.length;
        if (!length) {
            return null;
        }

        var centerKey = Math.floor(length / 2);
        return this.geometry[centerKey];
    },

    create: function (geometry) {
        var wave = new Wave(this.matrix);
        wave.geometry = geometry;
        wave.path = this.path;
        return wave;
    },

    savePathPoint: function () {
        var center = this.getCenter();
        this.path.addPoint(center);
    }
};

module.exports = Wave;
