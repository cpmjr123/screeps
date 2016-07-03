var extensionManager = {
    /** @param {Room} room **/
    run: function (room) {

        var extensions = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        var maximumExtensions = CONTROLLER_STRUCTURES.extension[room.controller.level];
        // don't waste CPU on extensions we can't build
        if (extensions.length >= maximumExtensions) {
            return;
        }
        var sitesPlaced = room.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});

        var position = room.find(FIND_MY_SPAWNS)[0].pos;

        if (sitesPlaced < maximumExtensions) {
            var checkPosition = new RoomPosition(position.x - 1, position.y - 1, room.name);
            if (room.createConstructionSite(checkPosition)) {
                sitesPlaced++;
            }
            checkPosition = new RoomPosition(position.x + 1, position.y - 1, room.name);
            if (room.createConstructionSite(checkPosition)) {
                sitesPlaced++;
            }
            checkPosition = new RoomPosition(position.x - 1, position.y + 1, room.name);
            if (room.createConstructionSite(checkPosition)) {
                sitesPlaced++;
            }
            checkPosition = new RoomPosition(position.x + 1, position.y + 1, room.name);
            if (room.createConstructionSite(checkPosition)) {
                sitesPlaced++;
            }
            console.log(sitesPlaced);
        } else {
            return;
        }
        // go up left.
        // if not is wall
        // if not construction site or structure != road
        // place construction site
        // go up right
        // if not is wall
        // if not construction site or structure != road
        // place construction site
        // go down left

        // if not is wall
        // if not construction site or structure != road
        // place construction site
        //go down right

        // if not is wall
        // if not construction site or structure != road
        // place construction site
        // do the same for up left
    }
};

module.exports = extensionManager;