game = new Game()
game.init();
ui = new UI()
ui.listPlanets();
ui.refresh()

game.colonize(0);

function randNum(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}