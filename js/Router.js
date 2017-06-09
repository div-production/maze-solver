var Path = require('Path');

/**
 * @constructor
 */
function Router() {
    this.waves = [];
}

Router.prototype = {
    /**
     * @type {Wave[]}
     */
    waves: [],

    /**
     * счётчик, отвечает за сохранение точек в массив пути
     *
     * @type {number}
     */
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
     * продвижение края всех волн на одну единицу
     * возвращает объект волны, если выход найден
     *
     * @returns {Wave|null}
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

            if (this.counter % 10 == 0) {
                wave.savePathPoint();
            }
        }
        this.waves = newWaves;

        this.counter++;
    }
};

module.exports = Router;
