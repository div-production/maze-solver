var Path = require('Path');

/**
 * @constructor
 */
function Router() {
    this.path = new Path();
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
            for (j = 0; j < wave.geometry.length; j++) {
                var point = wave.geometry[j];

                //window.ctx.fillRect(point.x, point.y, 1, 1);
            }

            if (this.counter % 10 == 0) {
                wave.savePathPoint();
            }
        }
        this.waves = newWaves;

        this.counter++;

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
