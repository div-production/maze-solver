var Point = require('Point');

/**
 * @param {Array[]} data
 * @constructor
 */
function Matrix(data) {
    this.data = data;

    var lastRow = data[data.length - 1];
    this.max = lastRow[lastRow.length - 1];
}

Matrix.prototype = {
    /**
     * @type {Array[]}
     */
    data: [],

    width: null,

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
