$(document).on('click', '', function(e){

});


$(document).on('click', "[name='shuttlingTo']", function(e){
	ui.shuttlingTo = e.target.id.split('-')[1];
});

$(document).on('click', '#back', function(e){
	ui.listPlanets();
});

$(document).on('click', '.planetLink', function(e){
	ui.viewPlanet(e.target.id.split('-')[1], true);
})

$(document).on('click', '.verb2', function(e){
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1], e.target.id.split('-')[2])
});
$(document).on('click', '.verbID', function(e){
	game[e.target.id.split('-')[0]](e.target.id.split('-')[1])
})


$(document).on('click', 'button', function(e){
	ui.refresh()
})
