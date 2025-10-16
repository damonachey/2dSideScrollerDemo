var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var lastTime = 0;

function update(deltaTime) {
    // Game logic updates go here
    state.update(deltaTime);
    world.update(deltaTime);
    statistics.update(deltaTime);
}

function render(deltaTime) {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rendering code goes here
    world.render(ctx, canvas, deltaTime); // Render world objects
    player.render(ctx, canvas, deltaTime); // Render player
    grid.render(ctx, canvas, deltaTime); // Render grid overlay
    statistics.render(ctx, canvas, deltaTime); // Render statistics
    help.render(ctx, canvas, deltaTime); // Render help overlay (on top)
}

function gameLoop(currentTime) {
    var deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    render(deltaTime);
    requestAnimationFrame(gameLoop);
}

// Wait for world to load before starting the game loop
world.loadMap().then(function() {
    console.log('World loaded, starting game loop');
    requestAnimationFrame(gameLoop);
}).catch(function(error) {
    console.error('Failed to load world:', error);
});
