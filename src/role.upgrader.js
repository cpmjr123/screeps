var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            if (creep.carry.energy < creep.carryCapacity && !creep.memory.working) {
                var source = Game.getObjectById(creep.memory.source);
                var droppedResources = source.pos.findInRange(FIND_DROPPED_ENERGY, 2);
                if (droppedResources.length > 0) {
                    if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedResources[0]);
                        return;
                    }
                }

                var containers = source.pos.findInRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store > 0;
                    }
                });

                if (containers.length > 0) {
                    if (containers[0].transfer(creep, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                }

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleUpgrader;