var spawnManager = {
    /** @param {Spawn} spawn **/
    run: function(spawn) {
        spawn.createCreep(
            ['WORK', 'CARRY', 'MOVE'],
            null,
            {role: 'harvester'}
        );
    }
};

module.exports = spawnManager;