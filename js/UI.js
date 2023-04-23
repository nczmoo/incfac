class UI{
	activePlanet = null;
	activeWindow = 'planets';
	shuttlingTo = null;
	timerIntervals = {};
	time = {};
	constructor(){

	}
	refresh(){
		$(".window").addClass('d-none');
		$("#" + this.activeWindow).removeClass('d-none');
		for (let id in this.time){
			$("#" + id).html(this.time[id]);
		}
	}

	fetchPlanetLink(id){
		return "<button id='planetLink-" + id + "' class='btn btn-link planetLink'>[ view ]</button>";
	}


	formatProduction(n){
		if (n > 0){
			return "<span class='text-success'>+" + n + "</span>";
		} else if (n < 0){
			return "<span class='text-danger'>-" + n + "</span>";
		}
		return n;
	}

	listPlanetResources(id){
		let txt = '';
		let planet = game.config.planets[id];
		for (let i in planet.modifiers){			
			let txtClass = '';			
			if (i == planet.primary){
				txtClass = " fw-bold text-decoration-underline";
			} else if (i == planet.secondary){
				txtClass = " fw-bold ";
			}
			txt += "<span class='" + txtClass + "'>" + i + "</span>: " + planet.modifiers[i] + " ";
		}
		return txt;
	}

	listPlanets(){
		this.activeWindow = 'planets';
		let txt = '';
		for (let i in game.config.planets){
			let disabledClass = '';
			let landTimer = "<span id='landTimer-" + i + "'></span>";
			let planetName = "Planet #" + (Number(i) + 1) ;
			if (game.config.planets[i].landed){
				disabledClass = ' disabled ';
				landTimer = this.fetchPlanetLink(i);
			}
			txt += "<div>"
				+ planetName
				+ "<button " + disabledClass 
				+ " id='colonize-" + i + "' class='verbID ms-3 me-3'>colony ship</button>"
				+ landTimer
				+ "<div class='ms-3 planetModifiers-" + i + "'>"				
				+ this.listPlanetResources(i)
				+ "</div>"
				+ "</div>"
		}
		$("#planets").html(txt);
		
	}

	listRecipeIngredients(id, recipe){
		let txt = "<div class='ms-3'>";
		for (let ingredient in game.config.recipes[recipe]){
			let quantity = game.config.recipes[recipe][ingredient];
			let txtClass = ' text-danger ';
			if (game.config.planets[id].stuff[ingredient] >= quantity){
				txtClass = ' text-success ';
			}	
			txt += "<span class='" + txtClass + " me-3'>"
				+ quantity.toLocaleString() + " " + ingredient
				+ "</span>"
		}
		txt += "</div>";
		return txt;
	}

	populateMakers (id){
		let txt = "<div class='fw-bold'>makers: " 
			+ game.config.planets[id].makers.assigned + "/" 
			+ game.config.planets[id].stuff.makers 
			+ "</div>";
		for (let recipe in game.config.recipes){
			let disabledClass = ' disabled ';
			if (game.canTheyMakeRecipe(id, recipe)){
				disabledClass = ' ';
				
			}
			txt += "<div class='ms-3'>"
				+ recipe 
				+ "<button id='makeStuff-" + id + "-" + recipe + "' class='make btn btn-outline-dark ms-3 verb2' " 
				+ disabledClass + ">make</button>"
				+ this.listRecipeIngredients(id, recipe)
				+ "</div>";
		}
		$("#makers").html(txt);
	}
	
	populateMiners(id){
		let txt = "<div class='fw-bold mt-3'> miners: " 
			+  game.config.planets[id].miners.assigned 
			+ "/" + game.config.planets[id].stuff.miners
			+ "</div>";
		let addMiners =  '';
		
		if (game.config.planets[id].miners.assigned  >= game.config.planets[id].stuff['miners']){
			addMiners = ' disabled ';
		}
		for (let resource of game.config.mineable){
			
			let noMiners = '';
			if (game.config.planets[id].miners[resource] < 1){
				noMiners = ' disabled ';
			}
			
			txt += "<div class='ms-3'>" 
				+ "<button id='noMiners-" + id + "-" + resource + "' class='noMiners verb2 btn btn-outline-dark' " + noMiners + "> - </button> "
				+ "<button id='addMiners-" + id + "-" + resource + "' " + addMiners + " class='addMiners verb2 btn btn-outline-dark me-3' > + </button>"
				+ game.config.planets[id].miners[resource] + " " + resource + " miners"
				+ "</div>";
		}
		$("#miners").html(txt);
	}

	populateResources(id){
		let txt = "<div class='fw-bold mt-3'>resources</div>";
		for(let resource of game.config.resources){
			txt += "<div class='ms-3'>"
				+ resource + ": <span class='resource " + resource + "' >" + game.config.planets[id].stuff[resource] + "</span>"
				+ " (" + this.formatProduction(game.config.planets[id].production[resource]) + ")</div>"
		}
		$("#resources").html(txt);

	}

	populateShuttles(id){
		let txt = "<div class='fw-bold mt-3'>shuttles: " + game.config.planets[id].stuff.shuttles+ "</div>";
		for (let i in game.config.planets[id].stuff){
			let addShuttles = '', noShuttles = '';
			if (game.config.planets[id].shuttling[i] >= game.config.planets[id].stuff[i]){
				addShuttles = ' disabled ';
			}
			if (game.config.planets[id].shuttling[i] < 1){
				noShuttles = ' disabled ';
			}
			
			if (i == 'shuttles' || game.config.planets[id].stuff[i] < 1) {
				continue;
			}
			txt += "<div class='ms-3 mt-3'>"  
				+ "<button id='noShuttles-" + id + "-" + i + "' class='btn btn-outline-danger verb2'" + noShuttles + ">-</button>"
				+ "<button id='addShuttles-" + id + "-" + i + "' class='btn btn-outline-success me-3 verb2'" + addShuttles + ">+</button>"
				+ i + ": " + game.config.planets[id].stuff[i].toLocaleString() 
				+ " [" + game.config.planets[id].shuttling[i] + " being sent]"
				+ "</div>";
		}
		txt += "<div class='ms-3 mt-3'>"
			+ "<button id='sendShuttles-" + id + "' class='btn btn-outline-dark verbID'>send</button>"
			+ "<span id='shuttlePlanets'></span></div>";
		$("#shuttles").html(txt);

	}

	populateSmelters(id){		
		let txt = "<div class='fw-bold mt-3'>smelters: " 
			+  game.config.planets[id].smelters.assigned + "/" + game.config.planets[id].stuff.smelters 
			+ "</div>";
		for (let i in game.config.smeltable){
			let resource = game.config.smeltable[i];
			let smeltTo = game.config.smelted[i];
			let addSmelters =  '';
			let noSmelters = '';
			if (game.config.planets[id].smelters.assigned >= game.config.planets[id].stuff.smelters 
				|| game.config.planets[id].stuff[resource] < 10){
				addSmelters = ' disabled ';
			}		
			if (game.config.planets[id].smelters[resource] < 1){
				noSmelters = ' disabled ';
			}
			txt += "<div class='ms-3'>" 
				+ "<button id='noSmelters-" + id + "-" + resource + "' class='noSmelters verb2 btn btn-outline-dark' " + noSmelters + "> - </button>"
				+ "<button id='addSmelters-" + id + "-" + resource + "' " + addSmelters + " class='addSmelters verb2 btn btn-outline-dark me-3' > + </button>"
				+ game.config.planets[id].smelters[resource] +  " " + resource + " -> " + smeltTo + " smelters" 
				+ "</div>";				
		}
		$("#smelters").html(txt);
		
	}

	startTimer(id, seconds){		
		console.log('start');
		this.time[id] = seconds;
		ui.timerIntervals[id] = setInterval(
			function(){				
				ui.time[id]--;		
				ui.refresh();
				if(ui.time[id] < 1){
					clearInterval(ui.timerIntervals[id]);
					ui.timerIntervals[id] = null;
					$("#" + id).html(ui.fetchPlanetLink(id.split('-')[1]));
				}
			}
			, 1000
		);
		
	}

	status(txt){
		$("#status").html(txt);
	}

	viewPlanet(id, activePress){
		ui.activePlanet = id;
		if (activePress){
			this.activeWindow = 'planet';
		}
		$("#planetName").html(Number(id) + 1);		
		
		this.populateMakers(id);
		this.populateMiners(id);
		this.populateShuttles(id);
		this.populateSmelters(id);
		this.populateResources(id);
		$("#planetModifiers").html(this.listPlanetResources(id));		
		let txt = '';
		for (let i = 0; i < game.config.planets.length; i++){
			
			let checkedTxt = ' ', labelTxt = "Planet #" + (Number(i) + 1);
			if (i == id || !game.config.planets[i].landed){
				checkedTxt = ' disabled ';
				labelTxt = "<del>Planet #" + (Number(i) + 1) + "</del>";
			} else if (this.shuttlingTo == i || (this.shuttlingTo == null && i == 0)){
				checkedTxt = ' checked ';
				if (this.shuttlingTo == null){
					this.shuttlingTo = 0;
				}
			}

			txt += "<input type='radio' name='shuttlingTo' id='shuttlingTo-" + i + "'" + checkedTxt + " class='ms-3'>" + labelTxt;
		}
		$("#shuttlePlanets").html(txt);
		if (this.shuttlingTo == null){
			$("#sendShuttles-" + id).prop('disabled', true);
		}
	}
}
