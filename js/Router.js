/**
 * @constructor
 */
function Router() {
    this.path = [];
    this.waves = [];
}

Router.prototype = {
    /**
     * @type {Wave[]}
     */
    waves: [],

    /**
     * @type {Array}
     */
    path: [],

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
     * продвижение края пути на одну единицу
     */
    step: function () {
        if (!this.waves.length) {
            return;
        }

        var newWaves = [];

        window.ctx.fillStyle = 'rgba(255,255,0,1)';
        for (var i = 0; i < this.waves.length; i++) {
            newWaves = newWaves.concat(this.waves[i].propagate());
            for (j = 0; j < this.waves[i].geometry.length; j++) {
                var point = this.waves[i].geometry[j];
                window.ctx.fillRect(point.x, point.y, 1, 1);
            }
        }
        this.waves = newWaves;

        /*window.ctx.fillStyle = 'rgba(255,255,0,1)';
        for (i = 0; i < this.wave.geometry.length; i++) {
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

        }*/
    }
};

module.exports = Router;
