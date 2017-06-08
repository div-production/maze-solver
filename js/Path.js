function Path (parent) {
    this.parent = parent;
    this.points = [];
}

Path.prototype = {
    parent: null,
    points: [],

    addPoint: function (point) {
        this.points.push(point);
    },

    getPoints: function () {
        if (this.parent) {
            return this.parent.getPoints().concat(this.points);
        } else {
            return this.points;
        }
    }
};

module.exports = Path;
