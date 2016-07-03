var extensionManager = {
    run: function (room) {

        var extensions = room.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_EXTENSION
            }
        });
        var extensionCount = extensions.length;
        var maximumExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level];
        // don't waste CPU on extensions we can't build
        if (extensionCount >= maximumExtensions) {
            return;
        }
        var sitesPlaced = room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: {
                structureType: STRUCTURE_EXTENSION
            }
        });
        var sitesCurrentlyPlaced = sitesPlaced.length;
        sitesCurrentlyPlaced += extensionCount;
        if (sitesCurrentlyPlaced >= maximumExtensions) {
            return;
        }

        var position = room.find(FIND_MY_SPAWNS)[0].pos;
        // Attempt to flood fill
        var queue = [position];
        for (var index in extensions) {
            queue.push(extensions[index].pos);
        }
        for (var index in sitesPlaced) {
            queue.push(sitesPlaced[index].pos);
        }
        while (queue.length > 0 && sitesCurrentlyPlaced < maximumExtensions) {
            var candidatePosition = queue.pop();
            // var result = room.createConstructionSite(candidatePosition, STRUCTURE_EXTENSION);

            var nextPosition = new RoomPosition(candidatePosition.x - 1, candidatePosition.y - 1, candidatePosition.roomName);
            if (room.createConstructionSite(nextPosition, STRUCTURE_EXTENSION) == OK) {
                sitesCurrentlyPlaced++;
                queue.push(nextPosition);
            }
            if (sitesCurrentlyPlaced >= maximumExtensions) {
                return;
            }
            nextPosition = new RoomPosition(candidatePosition.x + 1, candidatePosition.y + 1, candidatePosition.roomName);
            if (room.createConstructionSite(nextPosition, STRUCTURE_EXTENSION) == OK) {
                sitesCurrentlyPlaced++;
                queue.push(nextPosition);
            }
            if (sitesCurrentlyPlaced >= maximumExtensions) {
                return;
            }
            nextPosition = new RoomPosition(candidatePosition.x, candidatePosition.y + 2, candidatePosition.roomName);
            if (room.createConstructionSite(nextPosition, STRUCTURE_EXTENSION) == OK) {
                sitesCurrentlyPlaced++;
                queue.push(nextPosition);
            }
            if (sitesCurrentlyPlaced >= maximumExtensions) {
                return;
            }
            nextPosition = new RoomPosition(candidatePosition.x, candidatePosition.y - 2, candidatePosition.roomName);
            if (room.createConstructionSite(nextPosition, STRUCTURE_EXTENSION) == OK) {
                sitesCurrentlyPlaced++;
                queue.push(nextPosition);
            }
            if (sitesCurrentlyPlaced >= maximumExtensions) {
                return;
            }
        }
    }
};

module.exports = extensionManager;