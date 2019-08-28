const Voxel = require('../model/Voxel');

class AddVoxelCommand {
    constructor(voxelGrid, id, x, y, z, type, color) {
        this.voxelGrid = voxelGrid;
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.type = type;
        this.color = color;
        this.className = 'AddVoxelCommand';
    }

    execute() {
        const voxel = new Voxel(this.id, this.x, this.y, this.z, this.type, this.color);
        this.voxel = voxel;
        this.voxelGrid.addVoxel(voxel);

        return this;
    }
}

module.exports = AddVoxelCommand;
