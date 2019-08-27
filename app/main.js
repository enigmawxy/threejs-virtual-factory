import 'babel-polyfill';
import 'three';
import VoxelGridController from './js/controller/VoxelGridController';
import RemoteClient from './js/remote/RemoteClient';
import VoxelGridRemoteMediator from './js/remote/VoxelGridRemoteMediator';

const CommandSerializer = require('./js/remote/CommandSerializer');
const VoxelGrid = require('./js/model/VoxelGrid');

const voxelGrid = new VoxelGrid(50, 40);

const remoteClient = new RemoteClient('ws://localhost:8081', new CommandSerializer(voxelGrid));

remoteClient.addObserver("Connected", (e) => {
    new VoxelGridController(voxelGrid, new VoxelGridRemoteMediator(voxelGrid, remoteClient));
});

remoteClient.connect();