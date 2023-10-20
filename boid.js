function findNeighbors(boid) {
  const col = Math.floor(boid.position.x / gridSize);
  const row = Math.floor(boid.position.y / gridSize);
  const neighbors = [];
  let colDiff
  for (let i = col - 1; i <= col + 1; i++) {
    for (let j = row - 1; j <= row + 1; j++) {
      if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
        const cell = grid[i][j];
        for (let other of cell) {
          const distance = p5.Vector.dist(boid.position, other.position);
          if(racism){
            colDiff = abs(hue(boid.col) - hue(other.col));
          }else{
            colDiff = 0
          }
          //const hueDiff = abs(hue(boid.col) - hue(other.col));
          if (neighbors.length < boid.maxNeighbors &&
              other !== boid &&
              distance < radius &&
              colDiff < 15
          ) {
            neighbors.push(other);
          }
        }
      }
    }
  }
  return neighbors;
}
// function findNeighbors(boid) {
//   const col = Math.floor(boid.position.x / gridSize);
//   const row = Math.floor(boid.position.y / gridSize);
//   const neighbors = [];
//   for (let i = col - 1; i <= col + 1; i++) {
//     for (let j = row - 1; j <= row + 1; j++) {
//       if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
//         const cell = grid[i][j];
//         for (let other of cell) {
//           const distance = p5.Vector.dist(boid.position, other.position);
//           if (
//             neighbors.length < boid.maxNeighbors &&
//             other !== boid &&
//             distance < radius
//           ) {
//             neighbors.push(other);
//           }
//         }
//       }
//     }
//   }
//   return neighbors;
// }

class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.r = int(random(4, 8));
    this.maxForce = map(this.r, 4, 8, 0.5, 0.25);
    this.maxSpeed = map(this.r, 4, 8, 8, 5); //random(5,10);
    this.col = color(int(random(0, 360)), 100, 100);
    this.alignRadius = 30;
    this.seperationRadius = 20;
    this.cohesionRadius = 50;
    this.perceptionRadius = 100;
    this.rowID = -1;
    this.colID = -1;
    this.randomness = 1;
    this.maxNeighbors = 25;
  }
  avoidEdge() {
    let desired = null;
    const margin = 50;

    if (this.position.x < margin) {
      desired = createVector(this.maxSpeed, this.velocity.y);
    } else if (this.position.x > width - margin) {
      desired = createVector(-this.maxSpeed, this.velocity.y);
    }

    if (this.position.y < margin) {
      desired = createVector(this.velocity.x, this.maxSpeed);
    } else if (this.position.y > height - margin) {
      desired = createVector(this.velocity.x, -this.maxSpeed);
    }

    if (desired !== null) {
      desired.setMag(this.maxSpeed);
      const steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  edges(present) {
    if (!present) {
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    } else {
      this.avoidEdge();
    }
  }
  targetSeek(target) {
    const desired = p5.Vector.sub(target, this.position);
    const d = desired.mag();
    if (d > 0) {
      desired.setMag(this.maxSpeed);
      const steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  targetAvoid(target, minDistance) {
    const desired = p5.Vector.sub(this.position, target);
    const d = desired.mag();
    if (d < minDistance) {
      desired.setMag(this.maxSpeed);
      const steering = p5.Vector.sub(desired, this.velocity);
      steering.limit(this.maxForce);
      this.acceleration.add(steering);
    }
  }

  align(boids) {
    //let alignRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.alignRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    //let seperationRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.seperationRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    //let cohesionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.cohesionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.acceleration.add(
      random(-this.randomness, this.randomness),
      random(-this.randomness, this.randomness)
    );
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.colId = floor(this.position.x / gridSize);
    this.rowID = floor(this.position.y / gridSize);
  }

  getAverageColor(boids) {
    let totalH = 0;
    let totalWeight = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < this.perceptionRadius) {
        let c = other.col;
        let h = hue(c);
        let weight = 2 / (d * d); // calculate the weight based on the distance
        totalH += h * weight;
        totalWeight += weight;
      }
    }
    if (totalWeight > 0) {
      let avgH = totalH / totalWeight; // calculate the weighted average hue
      return color(avgH, 255, 255);
    } else {
      return this.col;
    }
  }

  show() {
    let angle = this.velocity.heading() + radians(90);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    //fill(this.color);
    if (arguments.length != 0) fill(this.getAverageColor(arguments[0]));
    else fill(this.col);
    stroke(0);
    triangle();
    beginShape();
    vertex(0, -this.r);
    vertex(-this.r, this.r);
    vertex(0, this.r * 0.6);
    vertex(this.r, this.r);
    endShape(CLOSE);
    pop();
  }

  showPerception() {
    push();
    translate(this.position.x, this.position.y);
    noFill();
    stroke(25);
    ellipse(0, 0, this.perceptionRadius * 2);
    pop();
  }
}
