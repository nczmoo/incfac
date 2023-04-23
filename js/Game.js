class Game{
	config = new Config();
	gameLoopInterval = null;
	
	constructor(){		
		this.gameLoopInterval = setInterval(this.looping, 1000);
	}

	init(){
		this.config.planets.push(new Planet('iron_ore', 'copper_ore'));		
		this.config.planets.push(new Planet());
		
	}

	addMakers(id, recipe){
		if (this.config.planets[id].makers.assigned >=  this.config.planets[id].stuff.makers 
			|| this.canTheyMakeRecipe(id, recipe)){
			return;
		}
		this.config.planets[id].makers.assigned ++
		this.config.planets[id].makers[recipe] ++;		
		this.config.planets[id].making[recipe] ++; // eventually be able to auto-assign makers 
		ui.viewPlanet(id, true);
	}

	addMiners(id, resource){			
		if (this.config.planets[id].miners.assigned >=  this.config.planets[id].stuff.miners){
			return;
		}
		this.config.planets[id].miners.assigned ++;
		this.config.planets[id].miners[resource]++;		
		this.config.planets[id].production[resource] += this.config.planets[id].modifiers[resource];
		ui.viewPlanet(id, true);
	}

	addShuttles(id, name){
		console.log('add', id, name);
		if (this.config.planets[id].shuttling[name] 
			>= this.config.planets[id].stuff[name]){
			return;
		}
		this.config.planets[id].shuttling[name]++;		
		ui.viewPlanet(id, true);
	}

	addSmelters(id, resource){
		let smeltTo = this.config.smelted[this.config.smeltable.indexOf(resource)];		
		if (this.config.planets[id].smelters.assigned >=  this.config.planets[id].stuff.smelters 
			&& this.config.planets[id].stuff[resource] < 10){ 			
			return;
		}
		this.config.planets[id].smelters.assigned ++
		this.config.planets[id].smelters[resource]++;		
		this.config.planets[id].production[smeltTo]++;
		this.config.planets[id].production[resource] -= 10;
		ui.viewPlanet(id, true)
	}

	bankruptcy(id, resource){
		//bankrupt makers
		if (this.config.smeltable.includes(resource)){
			this.config.planets[id].smelters[resource] = 0;
		}
		
	}


	canTheyMakeRecipe(id, recipe){
		for (let ingredient in game.config.recipes[recipe]){
			let quantity = game.config.recipes[recipe][ingredient];
			if (game.config.planets[id].stuff[ingredient] < quantity){
				return false;
			}
		}
		return true;
	}

	colonize(id){
		this.config.planets[id].landed = true;
		$("#colonize-" + id).prop('disabled', true);
		ui.startTimer('landTimer-' + id, 0);
	}

	makeStuff(id, recipe){
		if (!this.canTheyMakeRecipe(id, recipe)){
			return;
		}
		this.config.planets[id].stuff[recipe]++;
		for (let ingredient in this.config.recipes[recipe]){
			let quantity = this.config.recipes[recipe][ingredient];
			this.config.planets[id].stuff[ingredient] -= quantity;
		}
		ui.viewPlanet(id, true);
	}

	noMiners(id, resource){
		
		if (this.config.planets[id].miners[resource]< 1){
			return;
		}
		this.config.planets[id].miners.assigned --;
		this.config.planets[id].miners[resource]--;
		this.config.planets[id].production[resource] -= this.config.planets[id].modifiers[resource];
		ui.viewPlanet(id, true);
	}

	noShuttles(id, name){
		if (this.config.planets[id].shuttling[name] < 1){
			return;
		}
		this.config.planets[id].shuttling[name]--;		
		ui.viewPlanet(id, true)

	}

	noSmelters(id, resource){		
		if (this.config.planets[id].smelters[resource]< 1){
			return;
		}

		let smeltTo = this.config.smelted[this.config.smeltable.indexOf(resource)];		

		this.config.planets[id].smelters.assigned --
		this.config.planets[id].smelters[resource]--;		
		this.config.planets[id].production[smeltTo]--;
		this.config.planets[id].production[resource] += 10;
		ui.viewPlanet(id, true)
	}
	
	sendShuttles(id){
		
		if (this.config.planets[id].stuff.shuttles < 1){

		}
		this.config.planets[id].stuff.shuttles --;
		for (let i in this.config.planets[id].shuttling){
			if (this.config.planets[id].shuttling[i] > 0){
				this.config.planets[ui.shuttlingTo].stuff[i] += this.config.planets[id].shuttling[i];
				this.config.planets[id].stuff[i] -= this.config.planets[id].shuttling[i];
				this.config.planets[id].shuttling[i] = 0;
			}
		}
		ui.shuttlingTo = null;
	}

	looping(){
		if (Math.floor((Date.now() - game.config.planets[game.config.planets.length - 1].discovered) / 60000) >= game.config.discoverAt ){
			game.config.discover();
			game.config.planets.push(new Planet());
		}
		for(let planetID in game.config.planets){
			let planet = game.config.planets[planetID];
			for (let resource in planet.production){
				let production = planet.production[resource];
				planet.stuff[resource] += production;
				if (planet.stuff[resource] < 0){
					planet.stuff[resource] -= production;
					this.bankruptcy(resource);
				}
				if (ui.activePlanet == planetID){
					ui.viewPlanet(planetID, false);
				}
			}
		}
	}
}


