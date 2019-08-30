import MainView from '../view/MainView';
import Voxel from '../model/Voxel';
import AddVoxelCommand from '../command/AddVoxelCommand';
import MoveVoxelCommand from '../command/MoveVoxelCommand';
import RemoveVoxelCommand from '../command/RemoveVoxelCommand';
import { generateUUID } from '../util';
const randomColor = require('randomcolor');

export default class VoxelGridController {
    constructor(voxelGrid, voxelGridRemoteMediator) {
        this.voxelGrid = voxelGrid;
        this.voxelGridRemoteMediator = voxelGridRemoteMediator;
        this.view = new MainView(this, voxelGrid);
        this.view.initialize();
        this.addVoxelPointer();
        this.voxelGridRemoteMediator.initialize();
    }

    addVoxelPointer() {
        const voxelPointerCommand = new AddVoxelCommand(this.voxelGrid, generateUUID(), 0, 0, 0,
                                                        Voxel.Pointer, randomColor());

        this.voxelGrid.voxelPointer = voxelPointerCommand.execute().voxel;
        // this.voxelGrid.voxelPointer = voxelPointerCommand.execute();
        this.voxelGridRemoteMediator.onCommandExecuted(voxelPointerCommand);
    }

    onCellHover(cell) {
        this.executeCommand(new MoveVoxelCommand(this.voxelGrid, this.voxelGrid.voxelPointer,
                            cell[0], cell[1], cell[2]));
    }

    onCellClicked(cell, isShiftDown, uiSettings) {
        if (isShiftDown) {
            const voxel = this.voxelGrid.getNonPointerVoxelByPosition(cell[0], cell[1], cell[2]);

            if (voxel) {
                this.executeCommand(new RemoveVoxelCommand(this.voxelGrid, voxel));
            }
        } else {
            this.executeCommand(new AddVoxelCommand(this.voxelGrid, generateUUID(), cell[0], cell[1], cell[2],
                                parseInt(uiSettings.type)));
        }
    }

    executeCommand(command) {
        // 加入 voxelGrid 中管理
        command.execute(command);
        // 发送消息到 WS
        this.voxelGridRemoteMediator.onCommandExecuted(command);
    }
}
