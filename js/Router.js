/**
 * @param parent
 * @constructor
 */
function Router(parent) {
    this.path = [];
}

Router.prototype = {
    /**
     * @type {Wave}
     */
    wave: null,

    /**
     * @type {Array}
     */
    path: [],

    /**
     * установка края пути
     *
     * @param {Wave} wave
     */
    setWave: function (wave) {
        this.wave = wave;
    },

    /**
     * продвижение края пути на одну единицу
     */
    step: function () {
        if (!this.wave) {
            return;
        }

        var newWaves = this.wave.propagate();
        this.wave = newWaves[0];

        window.ctx.fillStyle = 'rgba(255,255,0,1)';
        for (var i = 0; i < this.wave.geometry.length; i++) {
            var point = this.wave.geometry[i];
            window.ctx.fillRect(point.x, point.y, 1, 1);
        }

        window.ctx.fillStyle = 'rgba(255,0,0,1)';
        var sectors = this.wave.getSectors();
        console.log(sectors.length);
        for (i = 0; i < sectors.length; i++) {
            var center = sectors[i].getCenter();
            if (center) {
                window.ctx.fillRect(center.x, center.y, 1, 1);
            }

        }
    }
};

module.exports = Router;
