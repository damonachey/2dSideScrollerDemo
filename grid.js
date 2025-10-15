var grid = {
    visible: false,
    squareSize: 64,

    toggle: function() {
        this.visible = !this.visible;
    },

    render: function(ctx, canvas, deltaTime) {
        if (!this.visible) return;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.lineWidth = 1;

        var cols = Math.ceil(canvas.width / this.squareSize);
        var rows = Math.ceil(canvas.height / this.squareSize);

        // Calculate grid offset based on player position (world moves, player stays centered)
        var centerScreenX = canvas.width / 2;
        var centerScreenY = canvas.height / 2;
        var gridOffsetX = (centerScreenX - state.player.x) % this.squareSize;
        var gridOffsetY = (centerScreenY + state.player.y) % this.squareSize;

        // Draw vertical lines (offset so (0,0) square aligns with world center)
        for (var x = 0; x <= cols; x++) {
            var xPos = x * this.squareSize + gridOffsetX;
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height);
            ctx.stroke();
        }

        // Draw horizontal lines (offset so (0,0) square aligns with world center)
        for (var y = 0; y <= rows; y++) {
            var yPos = y * this.squareSize + gridOffsetY;
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(canvas.width, yPos);
            ctx.stroke();
        }

        // Draw coordinates (world coordinates with 0,0 at center)
        for (var x = -1; x < cols; x++) {
            for (var y = -1; y < rows; y++) {
                var pixelX = x * this.squareSize + gridOffsetX + 2;
                var pixelY = y * this.squareSize + gridOffsetY + 14;

                // Calculate world coordinates based on position relative to player
                var worldX = Math.floor((pixelX - centerScreenX + state.player.x) / this.squareSize);
                var worldY = Math.floor((centerScreenY - pixelY + state.player.y) / this.squareSize);

                ctx.fillText(worldX + ',' + worldY, pixelX, pixelY);
            }
        }

        // Draw red X at world coordinates 0,0 for debugging (moves with world)
        var centerPixelX = canvas.width / 2 - state.player.x;
        var centerPixelY = canvas.height / 2 + state.player.y;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;

        // Draw X
        ctx.beginPath();
        ctx.moveTo(centerPixelX - 5, centerPixelY - 5);
        ctx.lineTo(centerPixelX + 5, centerPixelY + 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerPixelX + 5, centerPixelY - 5);
        ctx.lineTo(centerPixelX - 5, centerPixelY + 5);
        ctx.stroke();
    }
};