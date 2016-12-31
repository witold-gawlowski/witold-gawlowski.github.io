
(function () {
    var viewFullScreen = document.getElementById("view-fullscreen");
    if (viewFullScreen) {
        viewFullScreen.addEventListener("click", function () {
            var docElm = document.documentElement;
            docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
        }, false);
    }

    var cancelFullScreen = document.getElementById("cancel-fullscreen");
    if (cancelFullScreen) {
        cancelFullScreen.addEventListener("click", function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }, false);
    }

})();

window.onload = function() {

    var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

    function preload () {

        game.stage.backgroundColor = '#262425';

        game.load.spritesheet('village', 'img/ziemia.jpg', 1024, 768, 2);
        game.load.spritesheet('chata1', 'img/domek1.png', 171, 184, 2);
        game.load.spritesheet('chata2', 'img/domek2.png', 174, 161, 2);
        game.load.spritesheet('kamien', 'img/kamien.png', 170, 64, 2);
        game.load.spritesheet('studnia', 'img/studnia.png', 98, 81, 2);
        game.load.spritesheet('fire', 'img/fire.png', 50, 50, 2);
        game.load.spritesheet('npc', 'img/npc.png', 50, 80, 16);
        game.load.spritesheet('npc2', 'img/npc2.png', 50, 80, 16);
        game.load.spritesheet('npc3', 'img/npc3.png', 50, 80, 16);
        game.load.audio('drums', 'src/drums.mp3');


        $('.intro').animate({
            opacity: 1
        }, 1000).promise().done(function(){
            $('.play').on('click touchstart', function(){
                if($(this).hasClass('restart')){
                    $('.player1Box, .player2Box').hide(1).find('> img').remove();
                    $('.intro').css('display', 'none');
                    // $('.fade').css('opacity', '1', 'display', 'block');
                    scoreText1.destroy();
                    scoreText2.destroy();
                    winText.destroy();
                    lostText.destroy();
                    scoreText1 = game.add.text(32, 32, 'Player 1: 0', { fontSize: '21px', fill: '#fff' });
                    scoreText2 = game.add.text(740, 32, 'Player 2: 0', { fontSize: '21px', fill: '#fff' });
                    score1 = 0;
                    score2 = 0;
                    newGame();
                } else {
                    $('.intro').animate({
                        opacity: 0
                    }, 500, function(){
                         $('.intro').css('display', 'none');
                    });
                    setTimeout(function(){
                        $('canvas').animate({
                            opacity: 1 
                        }, 500);
                    }, 500);
                    setTimeout(function(){
                        pause = false;
                    }, 1250);
                }
            });
        });

    }

    var sprites1;
    var sprite1;
    var sprites2;
    var sprite2;
    gameWidth = 600;
    gameHeight = 400;
    screenWidth = 1024;
    screenHeight = 768;
    positionRadius = 50;
    var speed = 200;
    var totalShifts = 40;
    var acceptedRadius = 50;
    // var playerSpeed = 200;
    var NPCprobability = 0.75;
    var placeShifts = [];
    var currentNPCs;
    var NPCscattering = 150;
    var currentShape = circle;
    var aims = [];
    var NPCarray = []
    var timer;
    var scatteringArray = [];
    var NPChp = [];
    var pause = true;
    var sprites;
    var turn;
    var score1 = 0;
    var scoreText1;
    var score2 = 0;
    var scoreText2;

    
    function random(seed) {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }



    function updateNPC(NPC){
        var pos;
        if(!NPC.dead)
            pos = currentShape(timer.ms+NPC.shift);
        else{
            pos = [];
            pos[0] = -100;
            pos[1] = -100;
        }
        var seed = NPC.number*100+Math.floor(timer.ms/6000)+1;
        var aimObject = game.add.sprite(pos[0]+NPCscattering*(random(seed)-0.5), pos[1]+NPCscattering*(random(seed+1)-0.5), 'npc');
        aimObject.visible = false;
        var distance = game.physics.arcade.distanceBetween(NPC, aimObject);

        //game.physics.arcade.moveToObject(NPC,aimObject , speed*Math.atan(distance/10));
       

        var vecTo = new Phaser.Point(aimObject.x, aimObject.y);
        var vecFrom = new Phaser.Point(NPC.x, NPC.y);
        var dir = Phaser.Point.subtract(vecTo,vecFrom);
        dir = dir.normalize();
        var xAxis = new Phaser.Point(1, 0);
        var angle = Phaser.Point.angle(xAxis, dir);
        angle = angle/Math.PI*360;
        console.log(angle);
        if(angle<22.5&&angle>-22.5)
            dir = new Phaser.Point(-1, 0);
        else if(angle>180-22.5&&angle<180)
            dir = new Phaser.Point(1, 0);
        else if(angle<-180+22.5&&angle>-180)
            dir =  new Phaser.Point(1, 0);
        else if(angle<45+22.5&&angle>22.5)
            dir = new Phaser.Point(-0.7, -0.7);
        else if(angle>45+22.5&&angle<90+22.5)
            dir = new Phaser.Point(0, -1);
        else if(angle>135-22.5&&angle<135+22.5)
            dir = new Phaser.Point(0.7, -0.7);
        else if(angle>-180+22.5&&angle<-90-22.5)
            dir = new Phaser.Point(0.7, 0.7);
        else if(angle>-90-22.5&&angle<-90+22.5)
            dir = new Phaser.Point(0, 1);
        else dir = new Phaser.Point(-0.7, 0.7);

        NPC.body.velocity.x = dir.x*speed*Math.atan(distance/10);
        NPC.body.velocity.y = dir.y*speed*Math.atan(distance/10);


        vecFrom = new Phaser.Point(NPC.x, NPC.y);
        var fire = new Phaser.Point(screenWidth/2+270, screenHeight/2-80);
        var dir = Phaser.Point.subtract(vecFrom, fire);
        var axis = new Phaser.Point(1,0);
        var angle2 = Phaser.Point.angle(axis, dir);
        angle2 = angle2/Math.PI*360;
        console.log(angle2);
        if(angle2<35&&angle2>-35)
            NPC.animations.play('walkW');
        if(angle2 >35&&angle2 <145)
            NPC.animations.play('walkN');
        if(angle2 >145 && angle2 <180)
            NPC.animations.play('walkE');
        if(angle2 >-180 && angle2 < -145)
            NPC.animations.play('walkE');
        if(angle2 < -35 && angle2 > -145)
            NPC.animations.play('walkS');

        aimObject.destroy();
    }

    function updateScattering(){
        for(var i=0; i<currentNPCs; i++){
            scatteringArray[i].x = Math.random()*250;
            scatteringArray[i].y = Math.random()*250;
        }
    }


    function makeNPC(posX, posY, formation, shift, spriteName, number){
        var NPC;
        NPC = sprites.create(posX, posY, spriteName);
        NPC.update = formation;
        NPC.shift = shift;
        NPC.number = number;
        game.physics.arcade.enable(NPC);
        game.physics.enable(NPC, Phaser.Physics.ARCADE);
        NPC.body.collideWorldBounds = true;
        NPC.body.bounce.setTo(1, 1);
        NPC.body.velocity.x = 100;
        NPC.body.velocity.y = 100;
        NPC.animations.add('walk', [0, 1], 10, true);
        NPC.inputEnabled = true;
        NPC.events.onInputDown.add(NPClistener, this);
        NPC.dead = false;
        NPC.animations.add('walkN', [0, 1,2,3], 10, true);
        NPC.animations.add('walkS', [4, 5,6,7], 10, true);
        NPC.animations.add('walkW', [8, 9,10,11], 10, true);
        NPC.animations.add('walkE', [12, 13,14,15], 10, true);
        return NPC;
    }

    function newGame(){

        resetNPCs();

        var spriteType;
        var r = Math.random();
        if(r<0.33)
            spriteType = 'npc2';
        else if(r<0.66)
            spriteType = 'npc';
        else 
            spriteType = 'npc3';
        sprite1.destroy();
        sprite1 =  sprites.create(50, 80, spriteType);
        sprite1.animations.add('walkN', [0, 1,2,3], 10, true);
        sprite1.animations.add('walkS', [4, 5,6,7], 10, true);
        sprite1.animations.add('walkW', [8, 9,10,11], 10, true);
        sprite1.animations.add('walkE', [12, 13,14,15], 10, true);
        r = Math.random();
        if(r<0.33)
            spriteType = 'npc2';
        else if(r<0.66)
            spriteType = 'npc';
        else 
            spriteType = 'npc3';
        sprite2.destroy();
        sprite2 =  sprites.create(50, 80, spriteType);

        sprite1.x = (Math.random()-0.5)*screenWidth+screenWidth/2;
        sprite1.y = (Math.random()-0.5)*screenHeight+screenHeight/2;
        sprite2.x = (Math.random()-0.5)*screenWidth+screenWidth/2;
        sprite2.y = (Math.random()-0.5)*screenHeight+screenHeight/2;
        sprite2.animations.add('walkN', [0, 1,2,3], 10, true);
        sprite2.animations.add('walkS', [4, 5,6,7], 10, true);
        sprite2.animations.add('walkW', [8, 9,10,11], 10, true);
        sprite2.animations.add('walkE', [12, 13,14,15], 10, true);


        var r = game.rnd.integerInRange(0, 3);
        if(r===0){
            currentShape = lissajous;
            NPCscattering = 150;
        }
        if(r===1){
            currentShape = square;
            NPCscattering = 150;
        }
        if(r===2){
            currentShape = circle;
            NPCscattering = 150;
        }
        if(r===3){
            currentShape = circle;
            NPCscattering = 40;
        }
        pause = false;
    }

    function player1Wins(){
        winText = game.add.text(32, 64, 'Player 1 WINS!', { fontSize: '21px', fill: '#fff' });
        lostText = game.add.text(740, 64, 'Player 2 LOST!', { fontSize: '21px', fill: '#fff' });
        pause = true;
        $('.intro').css('display', 'block').find('> img').css('display', 'none');
        $('.play').addClass('restart');
        $('.player1Box').prepend('<img src="img/win.jpg" alt="">');
        $('.player2Box').prepend('<img src="img/over.jpg" alt="">');
        $('.player1Box, .player2Box').css('display', 'block').animate({
            opacity: 1
        }, 500);
        setTimeout(function(){
            $('.play, .intro').animate({
                opacity: 1
            }, 300);
        }, 1000);
    }
    function player2Wins(){
        winText = game.add.text(740, 64, 'Player 2 WINS!', { fontSize: '21px', fill: '#fff' });
        lostText = game.add.text(32, 64, 'Player 1 LOST!', { fontSize: '21px', fill: '#fff' });
        pause = true;
        $('.intro').css('display', 'block').find('> img').css('display', 'none');
        $('.play').addClass('restart');
        $('.player2Box').prepend('<img src="img/win.jpg" alt="">');
        $('.player1Box').prepend('<img src="img/over.jpg" alt="">');
        $('.player1Box, .player2Box').css('display', 'block').animate({
            opacity: 1
        }, 500);
        setTimeout(function(){
            $('.play, .intro').animate({
                opacity: 1
            }, 300);
        }, 1000);
    }
    function NPClistener(){
        if(turn===1){
            score1++;
            scoreText1.text = 'Player 1: ' + score1;
        } else{
            score2++;
            scoreText2.text = 'Player 2: ' + score2;
        }
        if(score1 === 3){
            player1Wins();
        } else if(score2 === 3){
            player2Wins();
        } else{
            $('.fade').css('display', 'block').animate({
                opacity: 1
            }, 500);
            setTimeout(function(){
                $('.fade').animate({
                    opacity: 0
                }, 500);
                newGame();
                pause = true;
            }, 500);
            setTimeout(function(){
                $('.fade').css('display', 'none');
            }, 1000);
            setTimeout(function(){
                pause = false;
            }, 1250);
        }
        
    }
    function player1listener(){
        if(turn===1){
            score2++;
            scoreText2.text = 'Player 2: ' + score2;
        } else {
            score1++;
            scoreText1.text = 'Player 1: ' + score1;
        }
        if(score1 === 3){
            player1Wins();
        } else if(score2 === 3){
            player2Wins();
        } else{
            $('.fade').css('display', 'block').animate({
                opacity: 1
            }, 500);
            setTimeout(function(){
                $('.fade').animate({
                    opacity: 0
                }, 500);
                newGame();
                pause = true;
            }, 500);
            setTimeout(function(){
                $('.fade').css('display', 'none');
            }, 1000);
            setTimeout(function(){
                pause = false;
            }, 1250);
        }
        console.log('player1 clicked');
    }
    function player2listener(){
        if(turn===1){
            score2++;
            scoreText2.text = 'Player 2: ' + score2;
        } else {
            score1++;
            scoreText1.text = 'Player 1: ' + score1;
        }
        if(score1 === 3){
            player1Wins();
        } else if(score2 === 3){
            player2Wins();
        } else{
            $('.fade').css('display', 'block').animate({
                opacity: 1
            }, 500);
            setTimeout(function(){
                $('.fade').animate({
                    opacity: 0
                }, 500);
                newGame();
                pause = true;
            }, 500);
            setTimeout(function(){
                $('.fade').css('display', 'none');
            }, 1000);
            setTimeout(function(){
                pause = false;
            }, 1250);
        }
        console.log('player2 clicked');
    }

    function generateShifts(){
        var smallestDistance = Math.PI*2/totalShifts*1000;
        for(var i=0; i<totalShifts; i++){
            placeShifts[i] = smallestDistance*i;
        }
    }

    function resetNPCs(){

        for(var i= 0; i<currentNPCs; i++)
            if(NPCarray[i]!=null)
                    NPCarray[i].destroy();
        currentNPCs = 0;
        

        for (var i = 0; i < totalShifts; i++){

            var r = Math.random();
            if(r<NPCprobability){
                
                var randX = (Math.random()-0.5)*screenWidth+screenWidth/2;
                var randY = (Math.random()-0.5)*screenHeight+screenHeight/2;
                //console.log(randX);

                var spriteType;
                var r = Math.random();
                if(r<0.33)
                    spriteType = 'npc2';
                else if(r<0.66)
                    spriteType = 'npc';
                else 
                    spriteType = 'npc3';


                NPCarray[currentNPCs] = makeNPC(randX, randY, currentShape, placeShifts[i], spriteType, currentNPCs);
                //console.log(NPCarray[currentNPCs].body.x);
                NPCarray[currentNPCs].animations.play('walk');
                currentNPCs++;
            }
            
        }

        for (var i = 0; i < currentNPCs; i++){
            NPChp[i] = 300;
        }
    }

    function create () {

        timer = game.time.create(false);
        timer.start();
        
        game.physics.setBoundsToWorld();

        music = game.add.audio('drums');
        music.play();

        var ziemias = game.add.group();
        ziemia = ziemias.create(1024, 768, 'village');
        ziemia.animations.add('ziemia');
        ziemia.animations.play('ziemia', 5, true);
        ziemia.anchor.setTo(1, 1);

        var fires = game.add.group();
        fires.enableBody = true;
        fires.physicsBodyType = Phaser.Physics.ARCADE;
        fire = fires.create(50, 50, 'fire');
        fire.animations.add('fire');
        fire.animations.play('fire', 5, true);
        fire.x = 512;
        fire.y = 384;
        fire.anchor.setTo(0.5, 0.5);

        var chata1s = game.add.group();
        chata1s.enableBody = true;
        chata1s.physicsBodyType = Phaser.Physics.ARCADE;
        chata1 = chata1s.create(171, 184, 'chata1');
        chata1.animations.add('chata1');
        chata1.animations.play('chata1', 5, true);
        chata1.x = 30;
        chata1.y = 690;
        chata1.anchor.setTo(0, 1);

        var chata2s = game.add.group();
        chata2s.enableBody = true;
        chata2s.physicsBodyType = Phaser.Physics.ARCADE;
        chata2 = chata2s.create(174, 161, 'chata2');
        chata2.animations.add('chata2');
        chata2.animations.play('chata2', 5, true);
        chata2.x = 70;
        chata2.y = 30;
        chata2.anchor.setTo(0, 0);

        var studnias = game.add.group();
        studnias.enableBody = true;
        studnias.physicsBodyType = Phaser.Physics.ARCADE;
        studnia = studnias.create(98, 81, 'studnia');
        studnia.animations.add('studnia');
        studnia.animations.play('studnia', 5, true);
        studnia.x = 835;
        studnia.y = 345;
        studnia.anchor.setTo(0, 0);

        var kamiens = game.add.group();
        kamiens.enableBody = true;
        kamiens.physicsBodyType = Phaser.Physics.ARCADE;
        kamien = kamiens.create(170, 64, 'kamien');
        kamien.animations.add('kamien');
        kamien.animations.play('kamien', 5, true);
        kamien.x = 653;
        kamien.y = 497;
        kamien.anchor.setTo(0, 0);
        

        sprites = game.add.group();
        sprites.enableBody = true;
        sprites.physicsBodyType = Phaser.Physics.ARCADE;

        var spriteType;
        var r = Math.random();
        if(r<0.33)
            spriteType = 'npc2';
        else if(r<0.66)
            spriteType = 'npc';
        else 
            spriteType = 'npc3';


        sprite1 = sprites.create(50, 80, spriteType);
        sprite1.inputEnabled = true;
        sprite1.events.onInputDown.add(player1listener, this);
        
        sprite1.animations.add('walkN', [0, 1,2,3], 10, true);
        sprite1.animations.add('walkS', [4, 5,6,7], 10, true);
        sprite1.animations.add('walkW', [8, 9,10,11], 10, true);
        sprite1.animations.add('walkE', [12, 13,14,15], 10, true);

        sprite1.animations.play('walkN', 5, true);
        sprite1.body.collideWorldBounds = true;
        sprite1.x = (Math.random()-0.5)*screenWidth+screenWidth/2;
        sprite1.y = (Math.random()-0.5)*screenHeight+screenHeight/2;

        //sprite1.anchor.setTo(0.5, 0.5);
        sprite1.maxHealth = 50;
        sprite1.health = 100;

        
        var r = Math.random();
        if(r<0.33)
            spriteType = 'npc2';
        else if(r<0.66)
            spriteType = 'npc';
        else 
            spriteType = 'npc3';


        sprite2 = sprites.create(50, 80, spriteType);
        
        sprite2.events.onInputDown.add(player2listener, this);
        sprite2.inputEnabled = true;
        
        sprite2.animations.add('walkN', [0, 1,2,3], 10, true);
        sprite2.animations.add('walkS', [4, 5,6,7], 10, true);
        sprite2.animations.add('walkW', [8, 9,10,11], 10, true);
        sprite2.animations.add('walkE', [12, 13,14,15], 10, true);
        sprite2.animations.play('walkN', 5, true);
        sprite2.body.collideWorldBounds = true;
        sprite2.x = (Math.random()-0.5)*screenWidth+screenWidth/2;
        sprite2.y = (Math.random()-0.5)*screenHeight+screenHeight/2;
        //sprite2.anchor.setTo(0.5, 0.5);
        sprite2.maxHealth = 50;
        sprite2.health = 100;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.enable(sprite1, Phaser.Physics.ARCADE);
        game.physics.enable(sprite2, Phaser.Physics.ARCADE);

    	wKey = game.input.keyboard.addKey(Phaser.KeyCode.W);
    	sKey = game.input.keyboard.addKey(Phaser.KeyCode.S);
    	aKey = game.input.keyboard.addKey(Phaser.KeyCode.A);
    	dKey = game.input.keyboard.addKey(Phaser.KeyCode.D);
        pKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        UKey = game.input.keyboard.addKey(Phaser.KeyCode.UP);
        DKey = game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
        LKey = game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        RKey = game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        PKey = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);

        generateShifts();
        resetNPCs();

        //timer.stop();

        scoreText1 = game.add.text(32, 32, 'Player 1: 0', { fontSize: '21px', fill: '#fff' });
        scoreText2 = game.add.text(740, 32, 'Player 2: 0', { fontSize: '21px', fill: '#fff' });
    }



     function checkPlayerPosition(spr){
        for(var i=0; i< totalShifts; i++){
            var pos = {x: currentShape(timer.ms+placeShifts[i])[0], y: currentShape(timer.ms+placeShifts[i])[1]};
            var distance = (spr.x-pos.x)*(spr.x-pos.x)+(spr.y-pos.y)*(spr.y-pos.y);
            //console.log(distance);
            if(distance<positionRadius*positionRadius){
                return true;
            }
        }
        return false;
    }


     function updatePlayer(player){
            var vecFrom = new Phaser.Point(player.x, player.y);
            var fire = new Phaser.Point(screenWidth/2, screenHeight/2);
            dir = Phaser.Point.subtract(vecFrom, fire);
            //dir = dir.normalize();
            axis = new Phaser.Point(-1,0);
            var angle2 = Phaser.Point.angle(axis, dir);
            angle2 = angle2/Math.PI*360;
            if(angle2<35&&angle2>-35)
                player.animations.play('walkW');
            if(angle2 >35&&angle2 <145)
                player.animations.play('walkN');
            if(angle2 >145 && angle2 <180)
                player.animations.play('walkE');
            if(angle2 >-180 && angle2 < -145)
                player.animations.play('walkE');
            if(angle2 < -35 && angle2 > -145)
                player.animations.play('walkS');
    }

    function togglePause() {
        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
    }

    function update(){



        if(pause){
            
             for (var i = 0; i < currentNPCs; i++){
                NPCarray[i].body.velocity.x = 0;
                NPCarray[i].body.velocity.y = 0;
                sprite1.body.velocity.x = 0;
                sprite1.body.velocity.y = 0;
                sprite2.body.velocity.x = 0;
                sprite2.body.velocity.y = 0;
             }
             return;
        }

    	sprite1.body.velocity.x = 0;
		sprite1.body.velocity.y = 0;


        sprite2.body.velocity.x = 0;
        sprite2.body.velocity.y = 0;

        updatePlayer(sprite1);
        updatePlayer(sprite2);

		game.world.wrap(sprite1, 0, true);
        game.world.wrap(sprite2, 0, true);

        
        for (var i = 0; i < currentNPCs; i++){
            if(!checkPlayerPosition(NPCarray[i]))
                NPChp[i]--;
            if(NPChp[i]<0){
                //NPCarray[i].dead = true;
                //console.log("banished!");
            }
        }


        if(checkPlayerPosition(sprite1))
            console.log('in');

         for(var i=0; i< currentNPCs; i++){
                 updateNPC(NPCarray[i]);
        }

    	if (wKey.isDown){
            if(aKey.isDown){
                sprite1.body.velocity.y = -(speed/Math.sqrt(2));
                sprite1.body.velocity.x = -(speed/Math.sqrt(2));
            } 
            else if (dKey.isDown){
                sprite1.body.velocity.y = -(speed/Math.sqrt(2));
                sprite1.body.velocity.x = (speed/Math.sqrt(2));
            }
            else {
                sprite1.body.velocity.y = -(speed);
            }
        }
        else if (sKey.isDown){
            if(aKey.isDown){
                sprite1.body.velocity.y = (speed/Math.sqrt(2));
                sprite1.body.velocity.x = -(speed/Math.sqrt(2));
            } 
            else if (dKey.isDown){
                sprite1.body.velocity.y = (speed/Math.sqrt(2));
                sprite1.body.velocity.x = (speed/Math.sqrt(2));
            }
            else {
                sprite1.body.velocity.y = (speed);
            }
        }
        else if (aKey.isDown){
            if(wKey.isDown){
                sprite1.body.velocity.y = -(speed/Math.sqrt(2));
                sprite1.body.velocity.x = -(speed/Math.sqrt(2));
            } 
            else if (sKey.isDown){
                sprite1.body.velocity.y = (speed/Math.sqrt(2));
                sprite1.body.velocity.x = -(speed/Math.sqrt(2));
            }
            else {
                sprite1.body.velocity.x = -(speed);
            }
        }
        else if (dKey.isDown){
            if(wKey.isDown){
                sprite1.body.velocity.y = -(speed/Math.sqrt(2));
                sprite1.body.velocity.x = (speed/Math.sqrt(2));
            } 
            else if (sKey.isDown){
                sprite1.body.velocity.y = (speed/Math.sqrt(2));
                sprite1.body.velocity.x = (speed/Math.sqrt(2));
            }
            else {
                sprite1.body.velocity.x = (speed);
            }
        }

        if (pKey.isDown){
            pause = true;
            turn = 2;
        }

        if (UKey.isDown){
            if(LKey.isDown){
                sprite2.body.velocity.y = -(speed/Math.sqrt(2));
                sprite2.body.velocity.x = -(speed/Math.sqrt(2));
            }
            else if(RKey.isDown){
                sprite2.body.velocity.y = -(speed/Math.sqrt(2));
                sprite2.body.velocity.x = (speed/Math.sqrt(2));
            }
            else{
                sprite2.body.velocity.y = -(speed);
            }
        }
        else if (DKey.isDown){
            if(LKey.isDown){
                sprite2.body.velocity.y = (speed/Math.sqrt(2));
                sprite2.body.velocity.x = -(speed/Math.sqrt(2));
            }
            else if(RKey.isDown){
                sprite2.body.velocity.y = (speed/Math.sqrt(2));
                sprite2.body.velocity.x = (speed/Math.sqrt(2));
            }
            else{
                sprite2.body.velocity.y = (speed);
            }
        }
        else if (LKey.isDown){
            if(UKey.isDown){
                sprite2.body.velocity.y = -(speed/Math.sqrt(2));
                sprite2.body.velocity.x = -(speed/Math.sqrt(2));
            }
            else if(DKey.isDown){
                sprite2.body.velocity.y = (speed/Math.sqrt(2));
                sprite2.body.velocity.x = -(speed/Math.sqrt(2));
            }
            else{
                sprite2.body.velocity.x = -(speed);
            }
        }
        else if (RKey.isDown){
            if(UKey.isDown){
                sprite2.body.velocity.y = -(speed/Math.sqrt(2));
                sprite2.body.velocity.x = (speed/Math.sqrt(2));
            }
            else if(DKey.isDown){
                sprite2.body.velocity.y = (speed/Math.sqrt(2));
                sprite2.body.velocity.x = (speed/Math.sqrt(2));
            }
            else{
                sprite2.body.velocity.x = (speed);
            }
        }

        if (PKey.isDown){
            turn = 1;
            pause = true;
        }
        sprites.sort('y', Phaser.Group.SORT_ASCENDING);
        game.physics.arcade.collide(sprite1, sprite2, null, null, this);


    }

    function render () {

         // game.debug.inputInfo(32, 32);
        // game.debug.spriteInfo(sprite2, 32, 32);
        // game.debug.bodyInfo(sprite2, 32, 128);
        // game.debug.spriteInfo(sprite1, 32, 256);
        // game.debug.bodyInfo(sprite1, 32, 384);

    }

};