function MissingTile(x, y, missingName) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.missingName = missingName || 'Unknown';
    this.traversable = false;
    
    this.update = function(deltaTime) {
        // No update logic needed for missing tiles
    };
    
    this.render = function(ctx, canvas, deltaTime) {
        // Convert world coordinates to screen coordinates
        var screenX = (canvas.width / 2) - state.player.x + this.x;
        var screenY = (canvas.height / 2) + state.player.y - this.y - this.height;
        
        // Only render if visible on screen
        if (screenX + this.width < 0 || screenX > canvas.width || 
            screenY + this.height < 0 || screenY > canvas.height) {
            return;
        }
        
        // Draw magenta square for missing tiles
        ctx.fillStyle = 'magenta';
        ctx.fillRect(screenX, screenY, this.width, this.height);
               
        // Draw bounding box if enabled
        if (showBoundingBoxes) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    };
}