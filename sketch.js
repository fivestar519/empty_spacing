// Copyright (c) <2023>, <Ng Sing Yiu>
// All rights reserved.

//variable
let tThunderX = 0;
let tThunderY = 0;
let tPlanetX = 0;
let tBlindX = 0;

//mouse varible
let mouseNum = 0;
let mousePlanetX = 0;
let mousePlanetR = 0;
let mousePlanetG = 30;
let mousePlanetB = 200;
let mouseRC = 1;
let blindPos = 11;

let lineYA =0;
let lineYB =0;

//class array
let meteorNum = 50;
let meteors = [];
let opticalNum = 25;
let opticals = [];

//preload
function preload() {
  img1 = loadImage("image/front_ground_18.png");
  song = loadSound("song/4_lofi_pop_02.mp3");
  font1 = loadFont("font/Arcade Classic.ttf");
}

function setup() {
  createCanvas(1280, 720);
 pixelDensity(0.75);
  
  //class set up
  for (let l = 0; l < meteorNum; l++) {
    meteors[l] = new meteor();
  }
  for (let i = 0; i < opticalNum; i++) {
    opticals[i] = new optical();
  }
}

function draw() {
 // song.loop();
  frameRate(22);

  if (mouseRC == 0) {
    fill(255);
    rect(0, 0, width, height);

    fill(0);
    text("This is also a practice for prohibiting", 20, height / 2 - 30);
    text("right click save and screen cap. . . . . .", 23.5, height / 2);
    text("Please left click to go back, enjoy : )", 23.5, height / 2 + 30);
  }

  if (mouseRC == 1) {
    // bg for fade out
    noStroke();
    fill(0, 25);
    rect(0, 0, width, height);

    //class draw
    for (let l = 0; l < meteorNum; l++) {
      meteors[l].meteorUpdate();
      meteors[l].meteorDisplay();
    }
    for (let i = 0; i < opticalNum; i++) {
      opticals[i].opticalUpdate();
      opticals[i].opticalDisplay();
    }

    // thunder wave - main
    for (let i = 0; i < width; i++) {
      stroke(255, noise(tPlanetX) * 255 + 130, 0);
      ellipse(i, noise(tThunderX, tThunderY) * 50 + 300, 0.2, 0.2);

      tThunderX += 0.01;
    }
    tThunderY += 0.003;

    // main planet
    noStroke();
    fill(255, noise(tPlanetX) * 255 + 130, 0);
    ellipse(width / 2, 320, 400, 400);

    // main planet ring
    noFill();
    stroke(255, noise(tPlanetX) * 255 + 130, 0);
    ellipse(
      width / 2,
      320,
      noise(tPlanetX) * 70 + 420,
      noise(tPlanetX) * 70 + 420
    );

    tPlanetX += 0.05;

    // mouse clicked => dark planet come out
    if (mouseNum >= 1) {
      // dark planet
      fill(mousePlanetR, mousePlanetG, mousePlanetB); // fill(0, 30, 200);
      noStroke();
      ellipse(mousePlanetX - 200, 320, 400, 400);
      mousePlanetX += 1.6; //0.8;

      if (mouseNum >= 2 && mouseIsPressed) {
        mousePlanetR = random(0, 150);
        mousePlanetG = random(0, 150);
        mousePlanetB = random(100, 255);
      }

      // turn mouseNum to 0
      if (mousePlanetX > width + 400) {
        mousePlanetX = 0;
        mouseNum = 0;
        mousePlanetR = 0;
        mousePlanetG = 30;
        mousePlanetB = 200;
      }
    }

    // Blind Pattern
    tBlindY = 0;

    for (let y = height; y > 0; y -= 15) {
      tBlindX = 0;

      for (let x = 0; x < width; x++) {
        let cR = noise(tBlindY, map(mouseY + 100, 0, width, 0, 5)) * 155;
        let cG = noise(tBlindY, tBlindX) * 55;
        let cB = noise(tBlindY, tBlindX) * 255;

        fill(cR, cG, cB);
        noStroke();
        rect(x, y, 2, y / 60 - blindPos);
        // y/42-18

        tBlindX += 0.002;
      }
      tBlindY += 0.1;
    }

    //img
    image(img1, 0, 0, 1280, 720);

    
      // window highlight
  stroke(234, 146, 255 );
  line (244, ((noise(lineYA)*12)+200), 244, ((noise(lineYB)*16)+299) );  
  line (244, ((noise(lineYB)*16)+338), 244, ((noise(lineYA)*12)+533) );

  line (1035, ((noise(lineYB)*16)+89), 1035, ((noise(lineYA)*12)+122) );
  line (1035, ((noise(lineYA)*12)+144), 1035, ((noise(lineYB)*16)+327) );

lineYA += 0.045 ;
lineYB += 0.055 ;
    
 
    //text
    noStroke();
    textSize(25);
    textFont(font1);
    fill(80, 24, 234, 191);
    text("Mouse Interactivity", 9.5, 685);
  } //14, 695.5
}

// bg optical particle
class optical {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.nextX = random(width);
    this.nextY = random(height);

    this.d = dist(this.x, this.y, this.nextX, this.nextY);

    this.ramSpeed = random(0.001, 0.008);
    this.ramSize = random(80, 160);
  }

  opticalUpdate() {
    this.x = lerp(this.x, this.nextX, this.ramSpeed);
    this.y = lerp(this.y, this.nextY, this.ramSpeed);
    this.d = dist(this.x, this.y, this.nextX, this.nextY);

    this.x += this.ramSpeed;
    this.y += this.ramSpeed / 2;

    if (this.x > width + 160 || this.y > height + 160) {
      this.x = random(width);
      this.y = random(height);
      this.nextX = random(width);
      this.nextY = random(height);

      this.ramSize = random(80, 160);
    }
  }

  opticalDisplay() {
    fill(0, 0, 255, random(5, 8));
    ellipse(this.x, this.y, this.ramSize);
  }
}

// bg meteor particle
class meteor {
  constructor() {
    this.x = 0; //random(width);
    this.y = random(height);
    this.nextX = width + 300;
    this.nextY = this.y;

    this.d = dist(this.x, this.y, this.nextX, this.nextY);

    this.ramSize = random(0.2, 8);
    this.ramSpeed = random(0.0001, 0.005);
  }

  meteorUpdate() {
    this.x = lerp(this.x, this.nextX, this.ramSpeed);
    this.d = dist(this.x, this.y, this.nextX, this.nextY);

    this.x += this.ramSpeed;

    if (this.x > width) {
      this.x = 0;
      this.y = random(height);
      this.nextX = width + 300;
      this.nextY = this.y;

      this.ramSize = random(0.2, 8);
    }
  }

  meteorDisplay() {
    noStroke();
    fill(random(155, 255), 0, random(0, 255), this.d);
    circle(this.x, this.y, this.ramSize);
  }
}

function keyPressed() {
  if (keyPressed) {
    mouseRC = 0;
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    mouseRC = 0;
  }
  if (mouseButton === LEFT) {
    mouseRC = 1;
    mouseNum += 1;
  }
}

function mouseWheel(event) {
  if (event.delta > 11) {
    event.delta = 11;
  }
  if (event.delta < 0) {
    event.delta = 0;
  }

  blindPos = map(event.delta, 0, 11, 0, 11);
}
