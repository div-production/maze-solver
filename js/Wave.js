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

        var newWave = new Wave(matrix);
        newWave.geometry = newPoints;

        return [newWave];
    },

    /**
     * получение секторов волны
     *
     * @returns {Sector[]}
     */
    getSectors: function () {
        if (this.geometry.length == 0) {
            return [];
        }

        var sectors = [],
            currentSector = new Sector(),
            point = this.geometry[0],
            nextPoint,
            distance;
        //console.log('---');
        //console.log(this.geometry);
        for (var i = 1; i < this.geometry.length; i++) {
            nextPoint = this.geometry[i];
            distance = point.getDistance(nextPoint);
            //console.log(point, nextPoint, distance);
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
    }
};

module.exports = Wave;
