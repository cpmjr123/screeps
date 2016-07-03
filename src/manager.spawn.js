const HARVESTER_ALLOCATION_PERCENTAGE = 0.5;
const BUILDER_ALLOCATION_PERCENTAGE = 0.15;
const UPGRADE_ALLOCATION_PERCENTAGE = 0.35;

var factoryBodies = require('factory.bodies');

var spawnManager = {
    /** @param {Spawn} spawn **/
    run: function (spawn) {
        /** @var {Source} source */
        var sources = Memory[spawn.room.name]['sources'];

        var index = Memory[spawn.room.name].counter;

        if (index == null) {
            Memory[spawn.room.name].counter = 0;
            index = Memory[spawn.room.name].counter;
        }

        //select a source
        var selectedSource = Game.time % Object.keys(sources).length;
        var source = sources[selectedSource];

        var creepsAssignedToThisSource = _.filter(Game.creeps, function (o) {
            return o.memory.source == source.id
        });

        if (creepsAssignedToThisSource.length > 0) {
            var miners = _.filter(creepsAssignedToThisSource, function (o) {
                return o.memory.role == 'miner'
            });
            var workParts = 0;
            for (var minerIndex in miners) {
                var body = miners[minerIndex].body;
                for (var partsIndex in body) {
                    if (body[partsIndex].type == WORK) {
                        workParts++;
                    }
                }
            }
            var workPartDeficiency = source.totalWorkPartsCount - workParts;
            if (workPartDeficiency > 0 && source.maxAllowedWorkers > miners.length) {
                var minerBody = factoryBodies.fetchMinerBody(spawn, workPartDeficiency);
                spawn.createCreep(minerBody, null, {role: 'miner', source: source.id});
                Memory[spawn.room.name].counter++;
                return;
            }

            // Miners sufficiently saturating the node, figure out what to do next
            var drones = _.filter(creepsAssignedToThisSource, function (o) {
                return o.memory.role == 'drone'
            });

            // 2-3 drones per miner?
            if (drones.length < miners.length * 2) {
                spawn.createCreep([WORK, CARRY, MOVE], null, {role: 'drone', source: source.id});
                return;
            }

            var upgraders = _.filter(creepsAssignedToThisSource, function (o) {
                return o.memory.role == 'upgrader'
            });

            if (upgraders.length < 4) {
                spawn.createCreep([WORK, CARRY, MOVE], null, {role: 'upgrader', source: source.id});
            }

        } else {
            //spawn a drone, we've either just started or we're in emergency mode.
            spawn.createCreep([CARRY, WORK, MOVE], null, {role: 'drone', source: source.id});
            Memory[spawn.room.name].counter++;
            return;
        }
    }
};

module.exports = spawnManager;