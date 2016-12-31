function playersInit()
{
      var sprites1 = game.add.group();
      sprites1.enableBody = true;
      sprites1.physicsBodyType = Phaser.Physics.ARCADE;

      sprite1 = sprites1.create(50, 80, 'npc');
      sprite1.animations.add('walk');
      sprite1.animations.play('walk', 5, true);
      sprite1.body.collideWorldBounds = true;
      sprite1.x = 512;
      sprite1.y = 384;
      sprite1.anchor.setTo(0.5, 0.5);
      sprite1.maxHealth = 100;
      sprite1.health = 100;

      var sprites2 = game.add.group();
      sprites2.enableBody = true;
      sprites2.physicsBodyType = Phaser.Physics.ARCADE;

      sprite2 = sprites2.create(50, 80, 'npc2');
      sprite2.animations.add('walk');
      sprite2.animations.play('walk', 5, true);
      sprite2.body.collideWorldBounds = true;
      sprite2.x = 512;
      sprite2.y = 384;
      sprite2.anchor.setTo(0.5, 0.5);
      sprite2.maxHealth = 100;
      sprite2.health = 100;

      game.physics.enable(sprite1, Phaser.Physics.ARCADE);
      game.physics.enable(sprite2, Phaser.Physics.ARCADE);
}