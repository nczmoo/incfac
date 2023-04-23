class Config {
    discoverAt = null;
    minDiscoveryTime = 1;
    maxDiscoveryTime = 5;
    planets = [];
	mineable = [
        'coal',
        'copper_ore',
        'iron_ore',
        'neurotium',
        'silica',
        'uranium',
    ];
    recipes = {
        makers: {
            copper_plates: 100,
            iron_plates: 1000,
        },
        miners: {
            copper_plates: 1,
            iron_plates: 10,
        },
        shuttles: {
            copper_plates: 100,
            iron_plates: 1000,
            steel_plates: 100,
        },
        smelters: {
            copper_plates: 10,
            iron_plates: 100,
        },
    
    }
    resources = [];  // the stuff used to make stuff;
    smeltable = [
        'copper_ore', 'iron_ore', 'iron_plates'
    ];
    smelted = [
        'copper_plates', 'iron_plates', 'steel_plates'
    ];
    constructor(){
        this.discover();
    }

    discover(){
        console.log('discover');
        this.minDiscoveryTime = this.maxDiscoveryTime;
        this.maxDiscoveryTime *= 2;
        this.discoverAt = randNum(this.minDiscoveryTime, this.maxDiscoveryTime);
    }
}