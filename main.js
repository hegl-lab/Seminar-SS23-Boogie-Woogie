//Copyright (C) <2013> <Loe Feijs and TU/e
var seed = -1; //choose any positive integer (-1 means random)
var speedy = false;
var rontgen = false;
var frozen = false;
var oldlook = true;
var boxing = false;
//boolean sketchFullScreen(){ return false;}

var victory;
var s; //seed
function setup() {
  //if (displayHeight >= 1080) size(1000,1000); else size(900,900);
  createCanvas(500, 500);
  s = int(random(10000000));
  if (seed > 0) s = seed;
  randomSeed(s);
  print("seed = ");
  print(s);
  //two-stage random generation supports replay
  victory = new Canvas(width / 2, height / 2);
  victory.setup();
  frameRate(60);
}

function draw() {
  if (!frozen) {
    victory.grow_steps(2);
    victory.draw(false);
  }
  if (rontgen) victory.rontgen();
}

/*function keyPressed(){ 
     if (key == 'b')
         boxing = ! boxing;
     if (key == 'c')
         victory.count();
     if (key == 'e')
         exit();
     if (key == 'f')
         frozen = !frozen;
     if (key == 'g'){
         victory.grow(1);
         victory.draw(false);
     }
     if (key == 'o'){
         oldlook = !oldlook;
     }
     if (key == 'p'){
        var file = "canvas" + Integer.toString(s);
        print("printing " + file + ".pdf .."); 
        beginRecord(PDF,file + ".pdf");
        victory.draw(true);
        endRecord();
        print("done");
     }
     if (key == 's')
         speedy = !speedy;
     if (key == 't')
         victory.tell();
     if (key == 'x'){
        rontgen = !rontgen;
        victory.draw();
     }
     if (key == 'z' || key == ' '){
         oldlook = false;
         setup();
     }
}*/
