/**
 * @param {Path} parent
 * @constructor
 */
function Path (parent) {
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
