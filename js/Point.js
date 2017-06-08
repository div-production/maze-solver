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
