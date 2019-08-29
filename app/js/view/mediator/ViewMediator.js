import Observable from '../../Observable';

// 定义基本到创建3D方法
export default class ViewMediator extends Observable {
    constructor(model) {
        super();
        this.model = model;
        this.object3D = this.makeObject3D();
        this.object3D.name = model.name;
        this.childMediators = new Map();
        this.object3D.traverse((object3D) => {
            object3D.mediator = this;
        });
    }

    //  缺省创建THREE.Object3D()，如果继承类覆盖类此方法，则创建继承类定义的内容
    makeObject3D() {
        return new THREE.Object3D();
    }
}

