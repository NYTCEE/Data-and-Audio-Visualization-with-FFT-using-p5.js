let size = 15;
let num = 10;
let grid = [];
let min = 150;
let hue = 0;
let song;
let fft;
let spectrum = [];
let distFromCenter = [];

function preload() {
  song = loadSound("RachmaninovPreludeinCSharpMinor.mp3");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  song.play();
  fft = new p5.FFT();

  for (let i=0; i<num; i++) {
    grid[i] = [];
    for (let j=0; j<num; j++) {
      grid[i][j] = [];
      for (let k=0; k<num; k++) {
        grid[i][j][k] = floor(random(2));
        let offset = size/2 - num/2*size;
        let x = i*size + offset;
        let y = j*size + offset;
        let z = k*size + offset;
        let distance = dist(x, y, z, 0, 0, 0);
        distFromCenter.push({i, j, k, distance});
      }
    }
  }
  distFromCenter.sort(compareDistances);
}

function startMusic() {
  song.play();
}

function compareDistances(a, b) {
  return a.distance - b.distance;
}

function draw() {
  
  orbitControl();
  spectrum = fft.analyze();
  let vol = fft.getEnergy(20, 140);
  console.log("Current volume:", vol); 
  let totalCubes = num*num*num;
  
  for (let i=0; i<totalCubes; i++) {
    let pos = distFromCenter[i];
    let c = map(spectrum[i], 0, 255, min, 255);
    grid[pos.i][pos.j][pos.k] = c;
  }

  let offset = size/2 -num/2 * size
  let spacing = size;
  translate(offset, offset, offset);
  noFill();
  colorMode(HSB, 360, 100, 100, 255);
  background(0, 0, 100);

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      for (let k = 0; k < num; k++) {
        if (grid[i][j][k] > min) {
          fill(hue, 50, 50, 150);
          if (vol > 150) {
            stroke(hue, 100, 20, 50);
          } 
          else {
            stroke(0, 10);
          } 
        } 
        else {
          noFill();
        }
        push();
        translate(i * spacing, j * spacing, k * spacing);
        box(size - size/4);
        pop();
      }
    }
  }
  hue = (hue + 1) % 360; 
}

