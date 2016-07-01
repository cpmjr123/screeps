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
            var local_harvesters = _.filter(harvesters, (creep) => creep.memory.source == source.id);
            var local_upgraders = _.filter(upgraders, (creep) => creep.memory.source == source.id);
            var local_builders = _.filter(builders, (creep) => creep.memory.source == source.id);
            console.log('Local harvesters' + local_harvesters);
            console.log('Local upgraders' + local_upgraders);
            console.log('Local builders' + local_builders);

            if (local_harvesters.length < 8) {
                console.log('Attempting to create harvester.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'harvester', source: source.id}
                );
                console.log('Return code: ' + returnCode);
            } else if (local_builders.length < 4) {
                console.log('Attempting to create builder.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    null,
                    {role: 'builder', source: source.id}
                );
                console.log('Return code: ' + returnCode);
            } else if (local_upgraders.length < 7) {
                console.log('Attempting to create upgrader.');
                var returnCode = spawn.createCreep(
                    [WORK, CARRY, CARRY, CARRY, MOVE],
                    null,
                    {role: 'upgrader', source: source.id}
                );
                console.log('Return code: ' + returnCode);
            }
        }
    }
};

module.exports = spawnManager;