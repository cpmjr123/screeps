var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnManager = require('manager.spawn');
module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        if (spawn.spawning === null) {
            if (spawn.energy >= 200) {
                spawn.createCreep(
                    ['WORK', 'CARRY', 'MOVE'],
                    null,
                    {role: 'harvester'}
                );
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
    }
};