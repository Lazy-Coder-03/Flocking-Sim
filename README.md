# Flocking Simulation

This is a simple flocking simulation implemented in JavaScript using the p5.js library. In this simulation, a group of autonomous agents, or "boids," exhibit flocking behavior, which includes alignment, cohesion, and separation, to navigate through the space.

## Features
- Flock of autonomous boids.
- Adjustable alignment, cohesion, and separation parameters.
- Toggle the simulation to pause/play.
- Toggle racism feature on/off.
- Visual representation of a grid (optional).
- Debug mode to visualize neighbor connections (optional).

## Getting Started

1. Clone the repository or download the code to your local machine.

2. Open the `index.html` file in a modern web browser that supports p5.js.

3. Interact with the simulation using the provided controls:
   - Use the sliders to adjust alignment, cohesion, and separation parameters.
   - Click the "Play" button to start or pause the simulation.
   - Click the "Toggle Racism" button to enable or disable racism in the simulation.
   - Toggle the grid and neighbor debug mode (if needed).

## Code Structure

- `flock` array: Stores boid objects.
- `grid` array: Represents a grid for optimizing neighbor search.
- `population`: Number of boids in the flock.
- `gridSize`: Size of the grid cells.
- `radius`: Radius for neighbor detection.
- `neighborDebug`: Toggle to enable neighbor debug mode.
- `showGrid`: Toggle to display the grid.
- `isPlaying`: Toggle to pause/play the simulation.
- `racism`: Toggle to enable or disable racism in the simulation.
- `target`: The central target point for the boids.
- `setup()`: Initializes the canvas and user interface.
- `draw()`: Main simulation loop for updating and rendering boids.
- `toggleAnimation()`: Function to toggle simulation pause/play.
- `enDesRacism()`: Function to toggle racism in the simulation.

## Dependencies

- [p5.js](https://p5js.org/): JavaScript library for creative coding.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- [Lazy-Coder-03](https://github.com/Lazy-Coder-03)

Feel free to customize this README with more details about your project. Enjoy experimenting with and exploring the flocking behavior of these boids!
