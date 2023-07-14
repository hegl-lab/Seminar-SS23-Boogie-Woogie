let frozen = false; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    randomSeed(int(random(10000000)));
    victory = new Canvas(windowWidth / 2, windowHeight / 2);
    victory.setup();
    frameRate(60);
    button1 = createButton('Download');
    button1.position(windowWidth / 4, windowHeight / 4);
    button1.mousePressed(downl);
    button2 = createButton('Pause');
    button2.position((windowWidth / 4)+10, (windowHeight / 4)+30);
    button2.mousePressed(freeze);
}

function draw() {
    if (!frozen){
        victory.grow_steps(2);
        victory.draw();
    }
}

function downl(){
    save('vbw.png');
}

function freeze(){
    frozen=!frozen;
}