const Settings = require("./settings").Settings;

class Orb{
    constructor(){
        this.color = getRandomColor();
        this.x = Math.floor(Math.random() * Settings.WORLDWIDTH);
        this.y = Math.floor(Math.random() * Settings.WORLDHEIGHT);
        this.radius = Settings.GENERICORBSIZE;
    }

}

const getRandomColor = () =>{

    const r = Math.floor((Math.random() * 200) + 50);
    const g = Math.floor((Math.random() * 200) + 50);
    const b = Math.floor((Math.random() * 200) + 50);

    return `rgb(${r}, ${g}, ${b})`;
}
module.exports = Orb;