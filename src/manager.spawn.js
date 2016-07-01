const HARVESTER_ALLOCATION_PERCENTAGE = 0.35;
const BUILDER_ALLOCATION_PERCENTAGE = 0.15;
const UPGRADE_ALLOCATION_PERCENTAGE = 0.5;

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
            var currentAllocation = _.filter(Game.creeps, (creep) => creep.memory.source == source.id);
            var currentHarvesterAllocation = _.filter(currentAllocation, (creep) => creep.memory.role == 'harvester');
            var currentBuilderAllocation = _.filter(currentAllocation, (creep) => creep.memory.role == 'builder');
            var currentUpgraderAllocation = _.filter(currentAllocation, (creep) => creep.memory.role == 'upgrader');
            console.log('Local harvesters' + currentHarvesterAllocation);
            console.log('Local upgraders' + currentUpgraderAllocation);
            console.log('Local builders' + currentBuilderAllocation);


            var upgraderWorkerAllocation = Math.ceil(traversableHarvestPoints * UPGRADE_ALLOCATION_PERCENTAGE); // 1/3 of total node allocation

            // 150 == approximate carry weight
            upgraderWorkerAllocation += Math.ceil(
                    (spawn.room.findPath(spawn.room.controller.pos, source.pos).length / 150)
                ) * upgraderWorkerAllocation;

            var spawned = false;

            if (currentHarvesterAllocation.length < Math.ceil(traversableHarvestPoints * HARVESTER_ALLOCATION_PERCENTAGE)) {
                console.log('Attempting to create harvester.');
                var returnCode = spawn.createCreep(
                    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'harvester', source: source.id}
                );
                spawned = true;
                console.log('Return code: ' + returnCode);
            } else if (currentBuilderAllocation.length < Math.ceil(traversableHarvestPoints * BUILDER_ALLOCATION_PERCENTAGE)) {
                console.log('Attempting to create builder.');
                var returnCode = spawn.createCreep(
                    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'builder', source: source.id}
                );
                spawned = true;
                console.log('Return code: ' + returnCode);
            } else if (currentUpgraderAllocation.length < upgraderWorkerAllocation) {
                console.log('Attempting to create upgrader.');
                var returnCode = spawn.createCreep(
                    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'upgrader', source: source.id}
                );
                spawned = true;
                console.log('Return code: ' + returnCode);
            } else {
                console.log('Attempting to spawn soldier');
                var returnCode = spawn.createCreep(
                    [ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH],
                    null,
                    {role: 'shock-troop', squad: 1}
                );
                spawned = true;
                console.log('Return code: ' + returnCode);
            }
        }
        if (spawned) {
            console.log(spawn.id + ' has spawned something this tick.');
            return;
        }
    }
};

module.exports = spawnManager;