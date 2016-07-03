var roleShockTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // if (creep.memory.target == 'nowhere') {
        //     creep.moveTo(Game.spawns.Spawn1.room.find(FIND_FLAGS)[0]);
        // }
        var route = Game.map.findRoute(creep.room, 'W12N32');
        if (route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        } else {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (target != '') {
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else {
                    creep.say('Attacking creep');
                }
            } else {
                var target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                if (target != '') {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    } else {
                        creep.say('Attacking structure');
                    }
                }
            }
        }
    }
};

module.exports = roleShockTroop;