const Settings = require('./settings').Settings;
// player data for themselves

class PlayerConfig{

    constructor(){
        this.xVector = 0;
        this.yVector = 0;
        this.speed = Settings.DEFAULTSPEED;
        this.zoom = Settings.DEFAULTZOOM;
    }
}

module.exports = PlayerConfig;