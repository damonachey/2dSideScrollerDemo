// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Track pressed keys for movement
var keys = {};
var pressedKeys = []; // Track all currently pressed keys for display
var showBoundingBoxes = false; // Global bounding box toggle
var currentDirection = null; // Track the currently active movement direction
var showHelp = false; // Track help overlay visibility

// Handle keyboard events
window.addEventListener('keydown', function(e) {
    var keyName = e.key === ' ' ? 'Space' : e.key;

    // Check if the key is a modifier key itself
    var isModifierKey = keyName === 'Control' || keyName === 'Alt' || keyName === 'Shift' || keyName === 'Meta';

    if (isModifierKey) {
        // For modifier keys, just show the key name
        statistics.setCurrentKey(keyName);
    } else {
        // Build modifier string for non-modifier keys
        var modifiers = [];
        if (e.ctrlKey) modifiers.push('CTRL');
        if (e.altKey) modifiers.push('ALT');
        if (e.shiftKey) modifiers.push('SHIFT');
        if (e.metaKey) modifiers.push('META');

        // Combine modifiers with key
        if (modifiers.length > 0) {
            keyName = modifiers.join('-') + '-' + keyName;
        }

        statistics.setCurrentKey(keyName);
    }

    // Track arrow keys for movement with direction priority
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true;
        
        // Set direction if no current direction is active
        if (currentDirection === null) {
            currentDirection = e.key;
        }
    }

    // Add key to pressed keys list if not already there
    var displayKey = keyName;
    if (pressedKeys.indexOf(displayKey) === -1) {
        pressedKeys.push(displayKey);
    }

    // Update statistics with all pressed keys
    statistics.setCurrentKey(pressedKeys.join(', '));

    // Handle CTRL+s to toggle statistics
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        statistics.toggle();
    }

    // Handle CTRL+g to toggle grid
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        grid.toggle();
    }

    // Handle CTRL+b to toggle bounding boxes
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        showBoundingBoxes = !showBoundingBoxes;
    }
    
    // Handle '?' key to toggle help overlay
    if (e.key === '?') {
        e.preventDefault();
        showHelp = !showHelp;
    } else if (showHelp) {
        // Hide help on any other keypress
        showHelp = false;
    }
});

window.addEventListener('keyup', function(e) {
    // Release arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false;
        
        // If the released key was the current direction, find next pressed direction
        if (currentDirection === e.key) {
            currentDirection = null;
            
            // Check for other pressed arrow keys to become the new current direction
            if (keys['ArrowLeft']) currentDirection = 'ArrowLeft';
            else if (keys['ArrowRight']) currentDirection = 'ArrowRight';
        }
    }

    // Handle key removal - need to check both simple key and modifier combinations
    var keyName = e.key === ' ' ? 'Space' : e.key;

    // Remove simple key name
    var index = pressedKeys.indexOf(keyName);
    if (index > -1) {
        pressedKeys.splice(index, 1);
    }

    // Remove any modifier combinations with this key
    for (var i = pressedKeys.length - 1; i >= 0; i--) {
        if (pressedKeys[i].endsWith('-' + keyName)) {
            pressedKeys.splice(i, 1);
        }
    }

    // If a modifier key is released, remove all combinations with that modifier
    if (keyName === 'Control' || keyName === 'Alt' || keyName === 'Shift' || keyName === 'Meta') {
        var modifierPrefix = keyName === 'Control' ? 'CTRL-' :
                           keyName === 'Alt' ? 'ALT-' :
                           keyName === 'Shift' ? 'SHIFT-' : 'META-';

        for (var i = pressedKeys.length - 1; i >= 0; i--) {
            if (pressedKeys[i].includes(modifierPrefix)) {
                pressedKeys.splice(i, 1);
            }
        }
    }

    // Update statistics with remaining pressed keys
    statistics.setCurrentKey(pressedKeys.length > 0 ? pressedKeys.join(', ') : '');
});

// Clear all keys when window loses focus
window.addEventListener('blur', function() {
    // Clear movement keys
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    
    // Clear current direction
    currentDirection = null;
    
    // Clear display keys
    pressedKeys = [];
    statistics.setCurrentKey('');
});

// Help overlay system
var help = {
    render: function(ctx, canvas, deltaTime) {
        if (!showHelp) return;
        
        // Draw semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Setup text styling
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        
        // Help content
        var helpText = [
            'GAME CONTROLS',
            '',
            'Movement:',
            '  ←→    Left/Right Arrow Keys - Move player',
            '',
            'Display Options:',
            '  CTRL+S  Toggle statistics panel',
            '  CTRL+G  Toggle coordinate grid',
            '  CTRL+B  Toggle collision bounding boxes',
            '',
            'Help:',
            '  ?       Show/hide this help screen',
            '',
            'Press any key to close this help screen'
        ];
        
        // Calculate starting position (centered)
        var startX = 50;
        var startY = 100;
        var lineHeight = 25;
        
        // Draw title with larger font
        ctx.font = 'bold 24px Arial';
        ctx.fillText(helpText[0], startX, startY);
        
        // Draw rest of text
        ctx.font = '18px Arial';
        for (var i = 1; i < helpText.length; i++) {
            ctx.fillText(helpText[i], startX, startY + (i * lineHeight));
        }
    }
};

// Clear all keys when window regains focus (safety measure)
window.addEventListener('focus', function() {
    // Clear movement keys
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    
    // Clear current direction
    currentDirection = null;
    
    // Clear display keys
    pressedKeys = [];
    statistics.setCurrentKey('');
});
