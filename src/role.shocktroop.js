var roleShockTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var targets = creep.room.find(FIND_FLAGS);
        if (targets.length > 0) {
            creep.moveTo(targets[0]);
        }
    }
};

module.exports = roleShockTroop;