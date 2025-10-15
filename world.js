var world = {
    objects: [],
    loaded: false,
    tilesLoaded: {},
    tilesLoading: {},
    
    loadTileScript: function(tileName) {
        return new Promise((resolve) => {
            // If already loaded, resolve immediately
            if (this.tilesLoaded[tileName]) {
                resolve(tileName);
                return;
            }
            
            // If already loading, wait for existing promise
            if (this.tilesLoading[tileName]) {
                this.tilesLoading[tileName].then(resolve);
                return;
            }
            
            // Start loading the script
            this.tilesLoading[tileName] = new Promise((scriptResolve) => {
                var script = document.createElement('script');
                script.src = 'tiles/' + tileName + '.js';
                script.onload = () => {
                    this.tilesLoaded[tileName] = true;
                    delete this.tilesLoading[tileName];
                    console.log('Loaded tile:', tileName);
                    scriptResolve(tileName);
                };
                script.onerror = () => {
                    delete this.tilesLoading[tileName];
                    console.warn('Failed to load tile:', tileName + '.js', '- using MissingTile fallback');
                    // Mark as 'missing' so we use MissingTile
                    this.tilesLoaded[tileName] = 'missing';
                    scriptResolve('MissingTile');
                };
                document.head.appendChild(script);
            });
            
            this.tilesLoading[tileName].then(resolve);
        });
    },
    
    loadMap: function() {
        if (this.loaded) return;
        
        // Load world.map file
        fetch('world.map')
            .then(response => response.text())
            .then(data => {
                var lines = data.split('\n');
                var uniqueTiles = new Set();
                var objectsToCreate = [];
                var occupiedPositions = new Map(); // Track occupied positions
                
                // First pass: collect unique tile types and object data
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    
                    // Skip comments and empty lines
                    if (line.startsWith('#') || line === '') continue;
                    
                    // Parse: x, y, Name, [Traversable]
                    var parts = line.split(',');
                    if (parts.length >= 3) {
                        var x = parseInt(parts[0].trim()) * 64; // Convert grid to pixels
                        var y = parseInt(parts[1].trim()) * 64; // Convert grid to pixels
                        var objectName = parts[2].trim();
                        var traversable = parts.length > 3 && parts[3].trim().toLowerCase() === 'traversable';
                        
                        // Check for duplicate positions
                        var positionKey = x + ',' + y;
                        if (occupiedPositions.has(positionKey)) {
                            var existingTile = occupiedPositions.get(positionKey);
                            console.warn('Duplicate tile position detected at (' + 
                                (x/64) + ',' + (y/64) + '): "' + existingTile + '" and "' + objectName + '"');
                        } else {
                            occupiedPositions.set(positionKey, objectName);
                        }
                        
                        uniqueTiles.add(objectName);
                        objectsToCreate.push({ x: x, y: y, name: objectName, traversable: traversable });
                    }
                }
                
                // Load all required tile scripts
                var tilePromises = Array.from(uniqueTiles).map(tileName => 
                    this.loadTileScript(tileName)
                );
                
                return Promise.all(tilePromises).then(() => {
                    // Create objects after all scripts are loaded
                    for (var i = 0; i < objectsToCreate.length; i++) {
                        var objData = objectsToCreate[i];
                        var obj = this.createObject(objData.name, objData.x, objData.y);
                        if (obj) {
                            obj.traversable = objData.traversable;
                            this.objects.push(obj);
                        }
                    }
                    
                    this.loaded = true;
                    console.log('World loaded with', this.objects.length, 'objects');
                    console.log('Loaded tile types:', Array.from(uniqueTiles));
                });
            })
            .catch(error => {
                console.error('Error loading world.map:', error);
            });
    },

    createObject: function(name, x, y) {
        // Check if tile failed to load
        if (this.tilesLoaded[name] === 'missing') {
            return new MissingTile(x, y, name);
        }
        
        // Try to create the object dynamically
        try {
            var constructor = window[name];
            if (typeof constructor === 'function') {
                return new constructor(x, y);
            }
        } catch (e) {
            console.error('Error creating object:', name, e);
        }
        
        // Fallback to MissingTile
        console.warn('Unknown or failed object type:', name, '- using MissingTile');
        return new MissingTile(x, y, name);
    },

    update: function(deltaTime) {
        // Update all world objects
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(deltaTime);
        }
    },

    render: function(ctx, canvas, deltaTime) {
        // Load map if not already loaded
        if (!this.loaded) {
            this.loadMap();
        }
        
        // Render all world objects
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].render(ctx, canvas, deltaTime);
        }
    }
};
