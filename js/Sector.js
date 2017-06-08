function Sector() {
    this.geometry = [];
}

Sector.prototype = {
    /**
     * @type {Point[]}
     */
    geometry: [],

    /**
     * получение центральной точки сектора
     *
     * @returns {Point}
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
