var background_music;
var death_sound;
var damage_sound;

var time;
var display;
var gameOver = 0;

var planet;
var planet2;
var star;
var moon;

var planet_graphics;
var planet2_graphics;
var star_graphics;
var moon_graphics;

var masses;

function setAdvancedCollision(collision){
	collision.layer.data.forEach(function(i){
		i.forEach(function(entry){
			entry.setCollision(entry.properties.collideLeft==='true', entry.properties.collideRight==='true', entry.properties.collideUp==='true', entry.properties.collideDown==='true');
		});
	});
}

function findObjectsByType(type, map, layer) {
	var result = new Array();
	map.objects[layer].forEach(function(element){
		if(element.properties.type === type){
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

function createFromTiledObject(element, group){
	var sprite = group.create(element.x, element.y, element.properties.sprite);
	Object.keys(element.properties).forEach(function(key){
		sprite[key] = element.properties[key];
	});
	sprite.height = element.height;
	sprite.width = element.width;
}

	/* 
	 * "type" is a string that contains the properties.##type to be searched for, state should receive "this"
	 * Function returns the newly populated group.
	 */
function populateGroup(type, state){
	var thisGroup = state.add.group();
	thisGroup.enableBody = true;

	var result = findObjectsByType(type, map, 'Objects');
	result.forEach(function(element){
		createFromTiledObject(element, thisGroup);
	}, this);
	return thisGroup;
}


function killPlayer(player, death){
	console.log("dead");
	background_music.stop();
	player.kill();
	death_sound.play();
	death_sound.onStop.add(restart_level,this);

//	restart_level();
}

function restart_level(){
	map.destroy();
	this.world.setBounds(0,0,0,0);
	this.state.restart();
}

function createTemp(game){
	game.stage.backgroundColor = '#000000';
//	fringeLayer = map.createLayer('background');
//	collisionLayer = map.createLayer('collision');

//	fringeLayer.resizeWorld();
//	collisionLayer.visible = false;

//	game.physics.arcade.enable(collisionLayer);
//	map.setCollisionByExclusion([],true,collisionLayer);
	background_music = game.add.audio('mars');
	background_music.play('',0,1,true,true);

//	game.physics.startSystem(Phaser.Physics.NINJA);
	star = game.add.sprite(400,300);
	star.radius = 75;

	planet = game.add.sprite(600,500);
	planet.radius = 10;

	planet2 = game.add.sprite(500,300);
	planet2.radius = 8;

	moon = game.add.sprite(612,500);
	moon.radius = 2;

	game.physics.arcade.enable(star);
	game.physics.arcade.enable(planet);
	game.physics.arcade.enable(planet2);
	game.physics.arcade.enable(moon);
//	game.physics.ninja.enableCircle(star, 100);

	star.body.mass = 4 * star.radius * star.radius * star.radius;
	planet.body.mass = 4 * planet.radius * planet.radius * planet.radius;
	planet2.body.mass = 4 * planet2.radius * planet2.radius * planet2.radius;
	moon.body.mass = 4 * moon.radius * moon.radius * moon.radius;

	star_graphics = game.add.graphics(star.x,star.y);
	star_graphics.lineStyle(0);
	star_graphics.beginFill(0xF0FF0F, 1.0);
	star_graphics.drawCircle(0, 0, star.radius);
	star_graphics.endFill();

	planet_graphics = game.add.graphics(planet.x, planet.y);
	planet_graphics.lineStyle(0);
	planet_graphics.beginFill(0xFF0F0F, 1.0);
	planet_graphics.drawCircle(0, 0, planet.radius);
	planet_graphics.endFill();

	planet2_graphics = game.add.graphics(planet2.x, planet2.y);
	planet2_graphics.lineStyle(0);
	planet2_graphics.beginFill(0xF000FF, 1.0);
	planet2_graphics.drawCircle(0, 0, planet2.radius);
	planet2_graphics.endFill();
	
	moon_graphics = game.add.graphics(moon.x, moon.y);
	moon_graphics.lineStyle(0);
	moon_graphics.beginFill(0xFFFFFF, 1.0);
	moon_graphics.drawCircle(0, 0, moon.radius);
	moon_graphics.endFill();

	planet.body.velocity.x = 80;
	planet.body.velocity.y = -80;

	planet2.body.velocity.x = 0;
	planet2.body.velocity.y = -90;

	moon.body.velocity.x = planet.body.velocity.x;
	moon.body.velocity.y = planet.body.velocity.y - 9;

	planet.force = {};
	star.force = {};
	planet2.force = {};
	moon.force = {};

	masses = new Array();
	masses.push(star);
	masses.push(planet);
	masses.push(planet2);
	masses.push(moon);
}

function getPolarDifference(object1, object2){
	var displacement = {};
	var ret = {};
	displacement.x = object2.x - object1.x;
	displacement.y = object1.y - object2.y; //game world exists in quadrant 4
	displacement.abs = Math.sqrt((displacement.x*displacement.x)+(displacement.y*displacement.y));
	ret.displacement = displacement.abs;
	ret.angle = Math.atan2((displacement.y),(displacement.x));
	return ret;
}

function updateTemp(game){
//	game.physics.arcade.collide(player, collisionLayer);
//	game.physics.arcade.overlap(player, projectiles, killPlayer, null, game);
//	game.physics.arcade.overlap(kittens, greenAliens, hurtAlien, null, game);
//	game.physics.arcade.overlap(kittens, blueAliens, hurtAlien, null, game);
//	game.physics.arcade.overlap(kittens, pinkAliens, hurtAlien, null, game);
//	updatePlayer(game);
//	updateAliens(game);

	planet_graphics.x = planet.x;
	planet_graphics.y = planet.y;
	star_graphics.x = star.x;
	star_graphics.y = star.y;
	planet2_graphics.x = planet2.x;
	planet2_graphics.y = planet2.y;
	moon_graphics.x = moon.x;
	moon_graphics.y = moon.y;

	planet.force.x = 0;
	planet.force.y = 0;
	star.force.x = 0;
	star.force.y = 0;
	planet2.force.x = 0;
	planet2.force.y = 0;
	moon.force.x = 0;
	moon.force.y = 0;

	gravity(masses);
//	gravitation(star, planet);
	planet.body.acceleration.x = planet.force.x/planet.body.mass;
	planet.body.acceleration.y = planet.force.y/planet.body.mass;
	star.body.acceleration.x = star.force.x/star.body.mass;
	star.body.acceleration.y = star.force.y/star.body.mass;
	planet2.body.acceleration.x = planet2.force.x/planet2.body.mass;
	planet2.body.acceleration.y = planet2.force.y/planet2.body.mass;
	moon.body.acceleration.x = moon.force.x/moon.body.mass;
	moon.body.acceleration.y = moon.force.y/moon.body.mass;
}

function gravity(masses){
	var i;
	var j;
	for(i=0; i<masses.length; i++){
		for(j=i+1; j<masses.length; j++){
			gravitation(masses[i],masses[j]);
		}
	}
}
function gravitation(mass1, mass2){
	var pol = getPolarDifference(mass1, mass2);

	var G = 0.01;
	var force = G * (mass1.body.mass * mass2.body.mass)/(pol.displacement)
	mass1.force.x += Math.cos(pol.angle) * force;
	mass1.force.y += -Math.sin(pol.angle) * force;
	mass2.force.x += -Math.cos(pol.angle) * force;
	mass2.force.y += Math.sin(pol.angle) * force;
//	mass1.body.acceleration.x = Math.cos(pol.angle) * (force/mass1.body.mass);
//	mass1.body.acceleration.y = -Math.sin(pol.angle) * (force/mass1.body.mass);
//	mass2.body.acceleration.x = -Math.cos(pol.angle) * (force/mass2.body.mass);
//	mass2.body.acceleration.y = Math.sin(pol.angle) * (force/mass2.body.mass);
}

function renderTemp(game){

}
