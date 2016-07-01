var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleShockTroop = require('role.shocktroop');
var spawnManager = require('manager.spawn');
var roadManager = require('manager.road');
module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        if (spawn.spawning === null) {
            if (spawn.room.energyAvailable >= 400) {
                spawnManager.run(spawn);
            }
        }
        roadManager.run(spawn);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'shock-troop') {
            roleShockTroop.run(creep);
        }
    }
};