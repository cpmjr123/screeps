var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

var spawnManager = {
    /** @param {Spawn} spawn **/
    run: function (spawn) {
        /** @var {Source} source */
        var sources = spawn.room.find(FIND_SOURCES_ACTIVE);
        for (var index in sources) {
            var source = sources[index];
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
            console.log('Found ' + traversableHarvestPoints + ' traversable points around ' + source.id);
            var local_harvesters = _.filter(harvesters, (creep) => creep.memory.source == source.id);
            var local_upgraders = _.filter(upgraders, (creep) => creep.memory.source == source.id);
            var local_builders = _.filter(builders, (creep) => creep.memory.source == source.id);
            console.log('Local harvesters' + local_harvesters);
            console.log('Local upgraders' + local_upgraders);
            console.log('Local builders' + local_builders);


            var upgraderWorkerAllocation = Math.floor(traversableHarvestPoints * 0.3); // 1/3 of total node allocation

            // 150 == approximate carry weight
            upgraderWorkerAllocation += Math.floor(
                (spawn.room.findPath(spawn.room.controller.pos, source.pos).length / 150)
            ) * upgraderWorkerAllocation;

            if (local_harvesters.length < Math.ceil(traversableHarvestPoints * 0.5)) {
                console.log('Attempting to create harvester.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'harvester', source: source.id, stuffstuff: look}
                );
                console.log('Return code: ' + returnCode);
            } else if (local_builders.length < Math.floor(traversableHarvestPoints * 0.2)) {
                console.log('Attempting to create builder.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'builder', source: source.id, stuffstuff: look}
                );
                console.log('Return code: ' + returnCode);
            } else if (local_upgraders.length < Math.floor(upgraderWorkerAllocation)) {
                console.log('Attempting to create upgrader.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, CARRY, MOVE],
                    null,
                    {role: 'upgrader', source: source.id, stuffstuff: look}
                );
                console.log('Return code: ' + returnCode);
            }
        }
    }
};

module.exports = spawnManager;