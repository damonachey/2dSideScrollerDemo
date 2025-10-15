var player = {
    width: 32,
    height: 32,
    
    render: function(ctx, canvas, deltaTime) {
        // Player stays centered on screen (world moves around player)
        var screenX = (canvas.width / 2);
        var screenY = (canvas.height / 2) - this.height;
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        // Head (circle)
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY + 6, 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Body (vertical line)
        ctx.beginPath();
        ctx.moveTo(screenX + 16, screenY + 11);
        ctx.lineTo(screenX + 16, screenY + 22);
        ctx.stroke();
        
        // Arms (horizontal line)
        ctx.beginPath();
        ctx.moveTo(screenX + 8, screenY + 16);
        ctx.lineTo(screenX + 24, screenY + 16);
        ctx.stroke();
        
        // Left leg
        ctx.beginPath();
        ctx.moveTo(screenX + 16, screenY + 22);
        ctx.lineTo(screenX + 10, screenY + 32);
        ctx.stroke();
        
        // Right leg
        ctx.beginPath();
        ctx.moveTo(screenX + 16, screenY + 22);
        ctx.lineTo(screenX + 22, screenY + 32);
        ctx.stroke();
        
        // Draw bounding box if enabled
        if (showBoundingBoxes) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    }
};