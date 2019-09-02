import ViewMediator from './ViewMediator';

// 定义创建 Voxel 实例的方法,类似于C++里的多态
// 在 VoxelGridViewMediator 中创建 VoxelViewMediator 实例。
export default class WallViewMediator extends ViewMediator {
    constructor(voxel) {
        super(voxel);
    }

    // makeObject3D 在super(voxel)里倍调用，而不会调用ViewMediator里的makeObject3D方法
    makeObject3D() {
        var glass_material=new THREE.MeshBasicMaterial( { color: 'green', opacity: 0.3, transparent: true});

        return this.createCubeWall(40, 100, 500, 0, glass_material);
    }

    //创建墙
    createCubeWall(width, height, depth, angle,material){
        var cube = new THREE.BoxGeometry(width, height, depth);
        // cube.rotateZ(Math.PI/2);
        return new THREE.Mesh( cube, material );
    }
}

