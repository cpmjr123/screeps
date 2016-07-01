var roadManager = {
    /** @param {Spawn} spawn **/
    run: function (spawn) {
        /** @var {Source} source */
        var sources = spawn.room.find(FIND_SOURCES_ACTIVE);
        var source = sources[Game.time % sources.length];
        var path = source.room.findPath(spawn.pos, source.pos);
        var roadFound = 0;
        var siteFound = false;
        for (var index in path) {
            if (spawn.room.lookForAt(LOOK_STRUCTURES, path[index].x, path[index].y) != STRUCTURE_ROAD) {
                if (spawn.room.lookForAt(LOOK_CONSTRUCTION_SITES, path[index].x, path[index].y) != '') {
                    siteFound = true;
                    break;
                }

            } else {
                roadFound++;
            }
        }

        if (siteFound) {
            console.log('Found a construction site, doing nothing');
            return;
        }

        if (roadFound < path.length) {
            for (var index in path) {
                if (spawn.room.lookForAt(LOOK_STRUCTURES, path[index].x, path[index].y) != '') {
                } else {
                    console.log(spawn.room.createConstructionSite(path[index].x, path[index].y, STRUCTURE_ROAD));
                    break;
                }
            }
        }
    }
};

module.exports = roadManager;