var roleDrone = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.working) {
            var source = Game.getObjectById(creep.memory.source);
            var droppedResources = source.pos.findInRange(FIND_DROPPED_ENERGY, 2);
            if (droppedResources.length > 0) {
                if (creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0]);
                    return;
                }
            }

            var containers = source.pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
                }
            });

            if (containers.length > 0) {
                if (containers[0].transfer(creep, RESOURCE_ENERGY, creep.carryCapacity - creep.carry.energy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                    return;
                }
            }

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            if (creep.carry.energy == 0) {
                creep.memory.working = false;
                return this.run(creep);
            }
            creep.memory.working = true;
            //determine job

            var structureId = creep.memory.structureId;
            if (structureId != null) {
                var structure = Game.getObjectById(structureId);
                // structure is gone?
                if (structure == null) {
                    creep.memory.structureId = null;
                }
                var attempt = creep.transfer(structure, RESOURCE_ENERGY);
                if (attempt == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                    return;
                } else if (attempt == ERR_FULL) {
                    // Set to null and go find something else to work on
                    creep.memory.structureId = null;
                } else if (attempt == OK) {
                    creep.memory.structureId = null;
                    creep.memory.working = false;
                    return;
                }
            }
            var structureToFill = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.energyCapacity > structure.energy;
                }
            });
            if (structureToFill != null) {
                creep.memory.structureId = structureToFill.id;
                return this.run(creep);
            }

            var closestConstructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

            if (closestConstructionSite != null) {
                var result = creep.build(closestConstructionSite);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestConstructionSite);
                    return;
                }
            }
        }
    }
};
module.exports = roleDrone;