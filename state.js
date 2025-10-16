var state = {
    player: {
        x: 0,  // World coordinates (0,0 = center of screen)
        y: 0,
        z: 0,  // Height off ground for jumping (standing on brick surface)
        velocityZ: 0,  // Vertical velocity for jumping
        isJumping: false,
    },

    jumpSpeed: 900,  // Initial jump velocity (pixels per second)
    gravity: 1800,   // Gravity acceleration (pixels per second squared)

    update: function(deltaTime) {
        if (this.player.z < -5000) {
            // Reset player if they fall too far
            this.player.x = 0;
            this.player.y = 0;
            this.player.z = 0;
            this.player.velocityZ = 0;
        }

        // Player movement at 200 pixels per second
        var moveSpeed = 200; // pixels per second
        var moveDistance = (moveSpeed * deltaTime) / 1000; // convert deltaTime from ms to seconds
        var deltaSeconds = deltaTime / 1000;

        // Store original values in case we need to revert due to collision
        var originalX = this.player.x;
        var originalY = this.player.y;
        var originalVelocityZ = this.player.velocityZ;
        var originalPlayerZ = this.player.z;

        // Check for rising and falling collisions
        this.player.velocityZ -= this.gravity * deltaSeconds; // Apply gravity
        this.player.z += this.player.velocityZ * deltaSeconds; // Update height

        // Check for landing collision with tiles
        if (this.checkCollisions()) {
            this.player.z = originalPlayerZ; // Revert to original height
            this.player.velocityZ = 0; // Stop vertical movement
        }

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

    jump: function() {
        // Only allow jumping if on ground
        if (this.player.velocityZ == 0) {
            this.player.velocityZ = this.jumpSpeed;
        }
    },

    checkCollisions: function() {
        // Get player bounding box
        var playerBox = {
            x: this.player.x,
            y: this.player.y + this.player.z, // Include height for jumping
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
