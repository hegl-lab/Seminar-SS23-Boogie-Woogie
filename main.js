let frozen = false;
let isPlaying = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    randomSeed(int(random(10000000)));
    victory = new Canvas(windowWidth / 2, windowHeight / 2);
    victory.setup();
    frameRate(60);
    setupButtons();
}

function setupButtons() {
    button1 = createButton('Download');
    button1.position((windowWidth / 4), (windowHeight / 4) + 30);
    button1.mousePressed(downl);

    button2 = createButton(isPlaying ? 'Pause' : 'Play');
    button2.position(windowWidth / 4, windowHeight / 4);
    button2.mousePressed(togglePlayPause);
}

function draw() {
    if (!frozen && isPlaying) {
        victory.grow_steps(2);
        victory.draw();
    }
}

function downl() {
    save('vbw.png');
}

function togglePlayPause() {
    frozen = !frozen;
    isPlaying = !isPlaying; 

    button2.html(isPlaying ? 'Pause' : 'Play');
}
