class Planet{
    discovered = null;
    landed = false;
    modifiers = [];
    primary = null;
    secondary = null;
    makers = {assigned: 0, };
    making = {};
    miners = {assigned: 0, };
    production = {};
    shuttling = {};
    smelters = {assigned: 0, };
    stuff =  {
        shuttles: 1, 
        smelters: 1,
        miners: 1,
        makers: 1,
    }

	constructor(primary, secondary){
        this.discovered = Date.now();
        this.primary = primary;
        this.secondary = secondary;
        if (primary == null){
            this.primary = game.config.mineable[randNum(0, game.config.mineable.length - 1)];
        }
        if (secondary == null){        
            while(this.secondary == null || this.secondary == this.primary){    
                    this.secondary = game.config.mineable[randNum(0, game.config.mineable.length - 1)];            
            }
        }
        for (let resource of game.config.mineable){            
            this.modifiers[resource] = randNum(1, 50) / 100 ;
            this.miners[resource] = 0;
            if (!game.config.resources.includes(resource)){
                game.config.resources.push(resource);
            }
        }

        this.modifiers[this.primary] = randNum(10, 20);
        this.modifiers[this.secondary] = randNum(4, 9);
        for (let resource of game.config.smelted){
            if (!game.config.resources.includes(resource)){
                game.config.resources.push(resource);
            }
        }

        for (let resource of game.config.resources) {            
            this.production[resource] = 0;            
            this.stuff[resource] = 0;            
            if (game.config.smeltable.includes(resource)){
                this.smelters[resource] = 0;
            }
        }
        game.config.resources.sort();
        let names = Object.keys(this.stuff);
        let newStuff = {};
        //console.log(names);
        names.sort();
        for (let name of names){
            newStuff[name] = this.stuff[name];
        }
        this.stuff = newStuff;  
        for (let i in this.stuff){
            this.shuttling[i] = 0;
        }
        for (let recipe in game.config.recipes){
            this.making[recipe] = 0;
        }
        
	}
    
}
