var state = {
    player: {
        x: 0,  // World coordinates (0,0 = center of screen)
        y: 0
    },

    update: function(deltaTime) {
        // Player movement at 200 pixels per second
        var moveSpeed = 200; // pixels per second
        var moveDistance = (moveSpeed * deltaTime) / 1000; // convert deltaTime from ms to seconds
        
        // Store original position
        var originalX = this.player.x;
        var originalY = this.player.y;
        
        // Move only in the current active direction
        if (currentDirection === 'ArrowLeft') {
            this.player.x -= moveDistance;
            if (this.checkCollisions()) {
                this.player.x = originalX; // Revert if collision
            }
        }
        else if (currentDirection === 'ArrowRight') {
            this.player.x += moveDistance;
            if (this.checkCollisions()) {
                this.player.x = originalX; // Revert if collision
            }
        }
    },
    
    checkCollisions: function() {
        // Get player bounding box
        var playerBox = {
            x: this.player.x,
            y: this.player.y,
            width: player.width,  // 32
            height: player.height // 48
        };
        
        // Check collision with all world objects
        for (var i = 0; i < world.objects.length; i++) {
            var obj = world.objects[i];
            
            // Skip collision detection for traversable objects
            if (obj.traversable) {
                continue;
            }
            
            var objBox = {
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height
            };
            
            if (this.boxesCollide(playerBox, objBox)) {
                return true; // Collision detected
            }
        }
        
        return false; // No collision
    },
    
    boxesCollide: function(box1, box2) {
        // AABB collision detection
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }
};
