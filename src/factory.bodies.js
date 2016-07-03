/**
 * total amount of miner parts for source = source.max/ENERGY_REGEN_TIME/HARVEST_POWER

 if tech level 1
 max energy per room == 300
 if tech level 2
 max energy per room == 550
 if tech level 3
 max energy per room == 800
 if tech level 4
 max energy per room == 1300
 if tech level 5
 max energy per room == 1800

 worker parts per miner = floor((sum(maxenergy of extensions + spawner - move part cost)/work part cost))

 Number of workers for source = min(traversableWorkPoints, floor(total amount of miner parts / worker parts per miner))

 * @type {{fetchMinerBody: factoryBodies.fetchMinerBody}}
 */

var factoryBodies = {

    /**
     * @param {Spawn} spawn
     * @returns int[]
     */
    getMaxExtensionsForRoom: function (spawn) {
        var extensions = spawn.room.find(
            FIND_MY_STRUCTURES,
            {
                filter: {structureType: STRUCTURE_EXTENSION}
            }
        );
        var extensionsCount = extensions.length;
        var maxExtensionEnergy = extensionsCount;
        if (extensionsCount == 0) {
            maxExtensionEnergy = 0;
        } else {
            maxExtensionEnergy *= extensions[0].energyCapacity;
        }
        return maxExtensionEnergy;
    },
    /**
     * @param {Spawn} spawn
     * @param int maximumRequestedWorkerParts
     */
    fetchMinerBody: function (spawn, maximumRequestedWorkerParts) {
        var maxExtensionEnergy = this.getMaxExtensionsForRoom(spawn);
        var workerPartsPerMiner =
            Math.floor((maxExtensionEnergy + spawn.energyCapacity - BODYPART_COST[MOVE]) / BODYPART_COST[WORK]);
        workerPartsPerMiner = Math.min(workerPartsPerMiner, maximumRequestedWorkerParts);
        var bodyArray = [];
        for (i = 0; i < workerPartsPerMiner; i++) {
            bodyArray[i] = WORK;
        }
        bodyArray[bodyArray.length] = MOVE;
        return bodyArray;
    }
};

module.exports = factoryBodies;