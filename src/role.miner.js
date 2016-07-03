var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var source = Game.getObjectById(creep.memory.source);
        var harvestResult = creep.harvest(source);
        var container = [];
        if (harvestResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            return;
        } else if (harvestResult == OK) {
            if (creep.memory.containerId == null) {
                container = creep.pos.findInRange(
                    FIND_STRUCTURES,
                    0,
                    {filter: s=>s.structureType == STRUCTURE_CONTAINER}
                );
                if (container.length > 0) {
                    creep.memory.containerId = container.id;
                }
            } else {
                container = Game.getObjectById((creep.memory.containerId));
            }
        }
        if (container.length == 0) {
            creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
        }
    }
};

module.exports = roleMiner;