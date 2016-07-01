var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

var spawnManager = {
    /** @param {Spawn} spawn **/
    run: function (spawn) {
        if (harvesters.length < 6) {
            console.log('Attempting to create harvester.');
            var returnCode = spawn.createCreep(
                [WORK, CARRY, MOVE, MOVE],
                'harvester' + harvesters.length,
                {role: 'harvester'}
            );
            console.log('Return code: ' + returnCode);
        }else if (builders.length < 3) {
            console.log('Attempting to create builder.');
            var returnCode = spawn.createCreep(
                [WORK, CARRY, MOVE, MOVE],
                'builder' + builders.length,
                {role: 'builder'}
            );
            console.log('Return code: ' + returnCode);
        } else if (upgraders.length < 6) {
            console.log('Attempting to create upgrader.');
            var returnCode = spawn.createCreep(
                [WORK, CARRY, CARRY, MOVE],
                'upgrader' + upgraders.length,
                {role: 'upgrader'}
            );
            console.log('Return code: ' + returnCode);
        }
    }
};

module.exports = spawnManager;