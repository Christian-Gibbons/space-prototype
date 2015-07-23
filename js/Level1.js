BasicGame.Level1 = function (game) {

};

	var map;
	var fringeLayer;
	var collisionLayer;

	var death;

BasicGame.Level1.prototype = {
	create: function () {
//		this.stage.backgroundColor = '#000000';
//		map = this.add.tilemap('soviet');
//		map.addTilesetImage('Post Soviet', 'tiles');
//		createAction(this);
		createTemp(this); //temporary name for this create function until I think of something better.
	},
	update: function () {
		updateTemp(this); //temporary name for this update function until I think of something better.		

	},
	quitGame: function (pointer) {
		// Here you should destroy anything you no longer need.
		// Stop music, delete sprites, purge caches, free resources, all that good stuff.
		// Then let's go back to the main menu.
	this.state.start('MainMenu');
	},

	render: function () {
        renderTemp(this); //temporary name for this render function until I think of something better.
	}
};
