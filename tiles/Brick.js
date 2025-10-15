function Brick(x, y) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.traversable = false;

    this.update = function(deltaTime) {
        // No update logic needed for static bricks
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

        // Draw brick background
        ctx.fillStyle = '#8B4513'; // Brown color
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // Draw mortar lines to make it look like a brick
        ctx.strokeStyle = '#654321'; // Darker brown for mortar
        ctx.lineWidth = 2;

        // Horizontal mortar lines
        ctx.beginPath();
        ctx.moveTo(screenX, screenY + 16);
        ctx.lineTo(screenX + this.width, screenY + 16);
        ctx.moveTo(screenX, screenY + 48);
        ctx.lineTo(screenX + this.width, screenY + 48);
        ctx.stroke();

        // Vertical mortar lines (offset pattern)
        ctx.beginPath();
        ctx.moveTo(screenX + 32, screenY);
        ctx.lineTo(screenX + 32, screenY + 16);
        ctx.moveTo(screenX + 16, screenY + 16);
        ctx.lineTo(screenX + 16, screenY + 48);
        ctx.moveTo(screenX + 48, screenY + 16);
        ctx.lineTo(screenX + 48, screenY + 48);
        ctx.moveTo(screenX + 32, screenY + 48);
        ctx.lineTo(screenX + 32, screenY + this.height);
        ctx.stroke();

        // Draw border
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, this.width, this.height);

        // Draw bounding box if enabled
        if (showBoundingBoxes) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    };
}