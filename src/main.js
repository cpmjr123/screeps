var roleDrone = require('role.drone');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roadManager = require('manager.road');
var spawnManager = require('manager.spawn');
var extensionManager = require('manager.extension');
// var towerStructure = require('structure.tower');
/**
 * @param {Source} source
 * @returns int traversableHarvestPoints
 */
function findTraversablePointsForSourceNode(source) {
    var look = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true // Return as array
    );
    var traversableHarvestPoints = 0;
    for (var grids in look) {
        if (look[grids].terrain != 'wall') {
            traversableHarvestPoints++;
        }
    }
    return traversableHarvestPoints;
}
function populateSourceAttributes() {
    for (var name in Game.rooms) {
        if (Game.time % 5 != 0) {
            break;
        }
        var selectedRoom = Game.rooms[name];
        if (Memory[selectedRoom.name] == null) {
            Memory[selectedRoom.name] = {};
            Memory[selectedRoom.name]['sources'] = {};
            var sources = selectedRoom.find(FIND_SOURCES);
            for (var sourceName in sources) {
                var source = sources[sourceName];
                var harvestablePoints = findTraversablePointsForSourceNode(source);
                // total work parts required for efficient source burn out
                var totalMinerParts = source.energyCapacity / ENERGY_REGEN_TIME / HARVEST_POWER;
                Memory[selectedRoom.name]['sources'][sourceName] = {
                    maxAllowedWorkers: harvestablePoints,
                    totalWorkPartsCount: totalMinerParts,
                    id: sources[sourceName].id
                };
            }
        }
    }
}
module.exports.loop = function () {

    // Grab resource node data
    populateSourceAttributes();

    for (var name in Game.rooms) {
        var selectedRoom = Game.rooms[name];

        extensionManager.run(selectedRoom);
    }

    for (var name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Game.spawns) {
        /** @type {Spawn} spawn */
        var spawn = Game.spawns[name];
        if (!spawn.spawning) {
            spawnManager.run(spawn);
        }
        roadManager.run(spawn);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if (creep.memory.role == 'drone') {
            roleDrone.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }

    // var towers = _.filter(Game.structures, function (o) {
    //     return o.structureType == STRUCTURE_TOWER
    // });
    // for (var name in towers) {
    //     towerStructure.run(towers[name]);
    // }
};