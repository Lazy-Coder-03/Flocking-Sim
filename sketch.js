const flock = [];
const grid = [];
const population = 800;
const gridSize = 50;
const radius = 50;
var neighborDebug = false;
var showGrid = true;
var isPlaying = true;
var racism = true;
var target;
var canvas;

function setup() {
  c1 = createCanvas(800, 600);
  c1.parent("canvas-container"); // Parent the canvas to the container
  colorMode(HSB);
  target = createVector(width / 2, height / 2);
  
  alignSlider = select('#alignSlider');
  cohesionSlider = select('#cohesionSlider');
  separationSlider = select('#separationSlider');
  playButton = select('#playButton');
  toggleRacism = select('#toggleRacism');
  
  for (let i = 0; i < population; i++) {
    flock.push(new Boid());
  }

  const numCols = Math.ceil(width / gridSize);
  const numRows = Math.ceil(height / gridSize);

  for (let col = 0; col < numCols; col++) {
    grid[col] = [];
    for (let row = 0; row < numRows; row++) {
      grid[col][row] = [];
    }
  }

  // Set initial values for the sliders
  alignSlider.value(1.5);
  cohesionSlider.value(1);
  separationSlider.value(2);

  toggleRacism.mousePressed(enDesRacism);
  playButton.mousePressed(toggleAnimation);
}

function draw() {
  background(0);

  target.x = width / 2;
  target.y = height / 2;

  if (showGrid) {
    for (let i = 0; i < width; i = i + gridSize) {
      for (let j = 0; j < height; j = j + gridSize) {
        noFill();
        stroke(20);
        rect(i, j, gridSize, gridSize);
      }
    }
  }

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      grid[col][row] = [];
    }
  }

  for (let boid of flock) {
    const col = Math.floor(boid.position.x / gridSize);
    const row = Math.floor(boid.position.y / gridSize);

    if (grid[col] && grid[col][row]) {
      grid[col][row].push(boid);
    }
  }

  if (neighborDebug) {
    for (let i = 0; i < flock.length; i++) {
      let n = findNeighbors(flock[i]);
      for (let b of n) {
        stroke(50);
        line(
          b.position.x,
          b.position.y,
          flock[i].position.x,
          flock[i].position.y
        );
      }
    }
  }

  for (let boid of flock) {
    let nei = findNeighbors(boid);
    boid.edges(true);
    boid.flock(nei);
    boid.update();
    boid.show();
  }

  fill(200);
  text(`Racism: ` + racism, 50, 50);
}

function toggleAnimation() {
  isPlaying = !isPlaying;
  const playButton = select('#playButton');
  if (isPlaying) {
    playButton.html("Pause");
    loop();
  } else {
    playButton.html("Play");
    noLoop();
  }
}

function enDesRacism() {
  racism = !racism;
}
