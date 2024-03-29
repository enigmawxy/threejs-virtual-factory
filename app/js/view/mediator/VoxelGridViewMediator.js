import ViewMediator from './ViewMediator';
import VoxelViewMediator from './VoxelViewMediator';
import FloorViewMediator from './FloorViewMediator';
import WallViewMediator from './WallViewMediator';
import Voxel from '../../model/Voxel';

export default class VoxelGridViewMediator extends ViewMediator {
    constructor(voxelGrid) {
        super(voxelGrid);
        voxelGrid.addObserver("VoxelAdded", (e) => this.onVoxelAdded(e));
        voxelGrid.addObserver("VoxelRemoved", (e) => this.VoxelRemoved(e));
        voxelGrid.addObserver("VoxelMoved", (e) => this.onVoxelMoved(e));

        const grid = this.getGridObject(voxelGrid);

        this.object3D.add(grid);
        // called by MainView's computeCellMouseIntersection
        this.objects = [];

        this.plane = this.getGridPlane();

        this.object3D.add(this.plane);
        this.objects.push(this.plane);

        const axesHelper = new THREE.AxisHelper( 1000 );
        axesHelper.position.set( 0, 0, 0 );
        this.object3D.add(axesHelper);
    }

    onVoxelMoved(e) {
        const voxel = e.voxel;

        this.setVoxelPosition(e.voxel, this.childMediators.get(voxel));
    }

    VoxelRemoved(e) {
        const voxel = e.voxel;
        const mediator = this.childMediators.get(voxel);

        this.object3D.remove(mediator.object3D);
    }

    onVoxelAdded(e) {
        const voxel = e.voxel;

        voxel.size = this.model.cellSize;

        const mediator = this.createObjectByType(voxel).obj;

        this.childMediators.set(voxel, mediator);

        this.setVoxelPosition(voxel, mediator);

        this.object3D.add(mediator.object3D);

        if (voxel.type !== Voxel.Pointer) {
            this.objects.push(mediator.object3D);
            mediator.object3D.cell = [voxel.x, voxel.y, voxel.z];
        }
    }

    createObjectByType(voxel) {
        var obj = null;

        switch (voxel.type) {
            case Voxel.Wall:
                obj = new WallViewMediator(voxel);
                break;
            case Voxel.Floor:
                obj = new FloorViewMediator(voxel);
                break;

            default:
                obj = new VoxelViewMediator(voxel) ;
                break;
        }

        return {obj: obj};
    }

    setVoxelPosition(voxel, mediator) {
        const cube = mediator.object3D;
        const origin =  - (this.model.cellSize * this.model.numCells) / 2 + this.model.cellSize / 2;

        cube.position.x = origin + voxel.x * this.model.cellSize;
        cube.position.z = origin + voxel.y * this.model.cellSize;
        cube.position.y = this.model.cellSize / 2 + voxel.z * this.model.cellSize;
    }

    getGridCellFromWorldPosition(position) {
        const result = [];
        const origin =  - (this.model.cellSize * this.model.numCells) / 2 + this.model.cellSize / 2;

        result[0] = Math.round((position.x - origin) / this.model.cellSize);
        result[1] = Math.round((position.z - origin) / this.model.cellSize);
        result[2] = Math.round((position.y - this.model.cellSize / 2) / this.model.cellSize);

        if (result[0] >=0 && result[1] >=0 && result[2] >=0 && result[0] < this.model.numCells &&
            result[1] < this.model.numCells && result[2] < this.model.numCells) {
            return result;
        } else {
            return null;
        }
    }

    // 画网格函数
    getGridObject(voxelGrid) {
        const step = voxelGrid.cellSize;
        const size = step * voxelGrid.numCells / 2;
        const geometry = new THREE.Geometry();

        console.log(size);
        for ( let i = - size; i <= size; i += step ) {
            geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
            geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

            geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
            geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

        }

        const material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

        return new THREE.LineSegments( geometry, material );
    }

    // 增加一个平面，目前没啥用。
    getGridPlane() {
        const geometry = new THREE.PlaneBufferGeometry(2000, 2000);
        geometry.rotateX(-Math.PI / 2);

        return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:'glass', visible: false}));
    }

}
