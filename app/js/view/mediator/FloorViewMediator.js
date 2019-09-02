import ViewMediator from './ViewMediator';

// 定义创建 Voxel 实例的方法,类似于C++里的多态
// 在 VoxelGridViewMediator 中创建 VoxelViewMediator 实例。
export default class FloorViewMediator extends ViewMediator {
    constructor(voxel) {
        super(voxel);
    }

    // makeObject3D 在super(voxel)里倍调用，而不会调用ViewMediator里的makeObject3D方法
    makeObject3D() {
        var texture =new THREE.TextureLoader().load("images/floor.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 10, 10 );
        var floorGeometry = new THREE.BoxGeometry(1600, 1100);
        floorGeometry.rotateX(-Math.PI / 2);
        var floorMaterial = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

        return new THREE.Mesh(floorGeometry, floorMaterial);
    }
}

