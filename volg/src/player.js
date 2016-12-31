var playerFactory = {
	makePlayer: function(_x, _y, _sprite, _input, _key) {
		(_x == null) ? x = 0 : x = _x;
		(_y == null) ? y = 0 : y = _y;
		var sprite = game.add.sprite(x, y, 'player1');
		var player = {
			 sprite: sprite
			,input: null
			,speed: 0
			,speedMod: 0.05
			,isMoving: false
			,process: function(){

			}
		}
		player.input = playerFactory.makeInput(player, _key);
		return player;
	},
	makeInput: function(_player, _key) {
		var input = getKeyCombinations();
		input.up.onDown.add(function(){
			_player.sprite.body.velocity.y = -200;
		});
		input.up.onUp.add(function(){
			_player.sprite.body.velocity.y = 0;
		});
		input.down.onDown.add(function(){
		    _player.sprite.body.velocity.y = 200;
		});
		input.down.onUp.add(function(){
		    _player.sprite.body.velocity.y = 0;
		});
		input.left.onDown.add(function(){
			_player.sprite.body.velocity.x = -200;
		});
		input.left.onUp.add(function(){
			_player.sprite.body.velocity.x = 0;
		});
		input.right.onDown.add(function(){
			_player.sprite.body.velocity.x = 200;
		});
		input.right.onUp.add(function(){
			_player.sprite.body.velocity.x = 0;
		});
		return input;
	},
	getKeyCombinations: function(key) {
		switch(key) {
			case 'w':
				var input = game.input.keyboard.addKeys({
					 'up':		Phaser.KeyCode.W
					,'down':	Phaser.KeyCode.S
					,'left':	Phaser.KeyCode.A
					,'right':	Phaser.KeyCode.D
				});
				break;
			case 'e':
				var input = game.input.keyboard.addKeys({
					 'up':		Phaser.KeyCode.E
					,'down':	Phaser.KeyCode.D
					,'left':	Phaser.KeyCode.S
					,'right':	Phaser.KeyCode.F
				});
				break;
			case 'r':
				var input = game.input.keyboard.addKeys({
					 'up':		Phaser.KeyCode.R
					,'down':	Phaser.KeyCode.F
					,'left':	Phaser.KeyCode.D
					,'right':	Phaser.KeyCode.G
				});
				break;
		}
	}
}