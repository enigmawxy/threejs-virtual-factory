import ViewMediator from './ViewMediator';
import Voxel from '../../model/Voxel';

export default class VoxelViewMediator extends ViewMediator {
    constructor(voxel) {
        super(voxel);
    }

    makeObject3D() {
        const geometry = new THREE.BoxGeometry( this.model.size, this.model.size, this.model.size );

        return new THREE.Mesh(geometry, this.getMaterialForVoxel());
    }

    getMaterialForVoxel() {
        if (this.model.type === Voxel.Pointer) {
            return new THREE.MeshBasicMaterial( { color: this.model.color, opacity: 0.5, transparent: true } );
        } else {
            return new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load( "images/" +
                                                  VoxelViewMediator.getTextureForType(this.model.type)) } );
        }
    }

    static getTextureForType(type) {
        switch (type) {
            case Voxel.Brick:
                return 'brick.jpg';
            case Voxel.Crate:
                return 'crate.jpg';
            case Voxel.Water:
                return 'water.jpg';
            case Voxel.Stone:
                return 'stone.jpg';
            case Voxel.Grass:
                return 'grass.jpg';
        }

        return 'brick.jpg';
    }
}

