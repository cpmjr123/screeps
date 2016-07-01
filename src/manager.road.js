var roadManager = {
    /** @param {Spawn} spawn **/
    run: function (spawn) {
        /** @var {Source} source */
        var sources = spawn.room.find(FIND_SOURCES_ACTIVE);
        sources.push(spawn.room.controller);
        var source = sources[Game.time % sources.length];
        var path = source.room.findPath(spawn.pos, source.pos, {ignoreCreeps: true});
        path.splice(path.length - 1, 1);
        var roadFound = 0;
        var siteFound = false;
        for (var index in path) {
            var structure = spawn.room.lookForAt(LOOK_STRUCTURES, path[index].x, path[index].y);
            if (structure == '' || structure.structureType != STRUCTURE_ROAD) {
                if (spawn.room.lookForAt(LOOK_CONSTRUCTION_SITES, path[index].x, path[index].y) != '') {
                    siteFound = true;
                    break;
                }

            } else {
                roadFound++;
            }
        }

        if (siteFound) {
            return;
        }

        if (roadFound < path.length) {
            for (var index in path) {
                if (spawn.room.lookForAt(LOOK_STRUCTURES, path[index].x, path[index].y) != '') {
                } else {
                    console.log('Spawn road at ' + path[index].x + ',' + path[index].y + ':' + spawn.room.createConstructionSite(path[index].x, path[index].y, STRUCTURE_ROAD));
                    break;
                }
            }
        } else {
            console.log('Road from ' + spawn + ' to ' + source + ' is already built.');
        }
    }
};

module.exports = roadManager;