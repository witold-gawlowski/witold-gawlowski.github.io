
// function preload() {
//     game.load.spritesheet('dude', 'dude.png', 32, 48);
// }


function circle(t){
    t = t/1000;
    return[Math.sin(t)*gameWidth/2+screenWidth/2, Math.cos(t)*gameHeight/2+screenHeight/2];
}

function twoStep(t){
    return square(1000*Math.sin(t/300)+t);
}

function banishment(t){
    return [-100, -100];
}

function saw(t){
    var oldT = t;
    var period = 7000;
    t %= period;
     t /= period;
      t -=0.5;
      t *= 2;
      t = Math.abs(t);
      t*= 2;
      if(t>1)
          t = 1;
      if(t<-1)
          t = -1;
   t*=period;
    return t;
}

function circleStuttered(t){
    return circle(saw(t)+t);
}


function lissajous(t){
    t  = t/2000;
    return [Math.sin(1*t)*gameWidth/2+screenWidth/2, Math.cos(3*t)*gameHeight/2+screenHeight/2]
}

function square(t){
    var period = 2000;
    t%=4*period;
    var phase = t%period;
    phase/=period;
    phase-=0.5;
    phase*=2;
    
    var retX, retY;
    if(t<period){
        retX = phase;
        retY = 1;
    }
    else if(t<2*period){
        retX = 1;
        retY = -phase;
    }
    else if(t<3*period){
        retX = -phase;
        retY = -1;
    }
    else{
        retX = -1;
        retY = phase;
    }
    
    retX*=gameWidth/2;
    retX+=screenWidth/2;

    retY*=gameHeight/2;
    retY+=screenHeight/2;

    return[retX, retY];
}

function smooth(val){
    if(val<100)
        return val/1000;
    else 
        return 0.1;
}



// var NPCarray = [];
// function create() {
//     timer = game.time.create(false);
//     timer.start();

//     for (var i = 0; i < 1; i++){
//         NPCarray[i] = makeNPC(Math.random()*gameWidth, Math.random()*gameHeight, circleStuttered, 1500*i, 'dude');
//     }

// }


// function update() {
//     for (var i = 0; i < 1; i++){
//        updateNPC(NPCarray[i]);
//     }

// }

