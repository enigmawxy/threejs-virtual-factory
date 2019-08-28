const VoxelGrid = require('./js/model/VoxelGrid');
const CommandSerializer = require('./js/remote/CommandSerializer');
const AddVoxelCommand = require('./js/command/AddVoxelCommand');
const DbOperation = require('./js/db/index');

// 所有命令都通过CommandSerializer来传递和执行，这个命令类包含一个
// voxelGrid变量，这个变量记录类当前场景所有都实体，这个变量是服务端
// 保存的。
// 已知的问题：没有重连机制。客户端刷新是否慧重新连接服务
const voxelGrid = new VoxelGrid(50, 40);
const commandSerializer = new CommandSerializer(voxelGrid);
const dbOperation = new DbOperation({appId:'appid1', key:'mk1', url: 'http://127.0.0.1:1337/parse'});

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port: 8081});

var nextId = 0;

wss.on('connection', function connection(ws) {
    ws._socket.setKeepAlive(true);

    var connectionId = nextId++;
    var terminationCommand = null;
    wss.clients[wss.clients.length - 1].connectionId = connectionId;

    ws.on('message', function incoming(message) {
        var payload = JSON.parse(message);
        var serializedCommand = JSON.stringify(payload.command);

        if (payload.type === 'RUN') {
            broadcast(serializedCommand);
        } else if (payload.type === 'ON_DISCONNECT') {
            terminationCommand = serializedCommand;
        }
    });

    ws.on('close', function disconnect() {
        if (terminationCommand) {
            broadcast(terminationCommand);
        }
    });

    // 当一个实例加类实体，需要广播通知别的连接实例，增加实体
    function broadcast(serializedCommand) {
        executeCommand(JSON.parse(serializedCommand));
        wss.clients.forEach(function each(client) {
            if (client.connectionId !== connectionId) {
                client.send(serializedCommand);
            }
        });
    }

    // 这是否是一个新的客户端实例连接成功后，初始化的时候发生的，
    // 如果其它客户端实例已经增加来很多实体，那么新客户端开启后会自动增加这些实体
    // 以保持同步
    getInitCommands(ws);
    // for (const command of getInitCommands()) {
    //     const serializedCommand = JSON.stringify(command);
    //     ws.send(serializedCommand);
    // }
});

function executeCommand(serializedCommand) {
    const command = commandSerializer.deserialize(serializedCommand);

    if (command) {
        const object = command.execute();

        if (object.className === 'AddVoxelCommand' &&  object.voxel.type !== 0) {
            console.log(object.voxel);
            dbOperation.gotoDB(object.voxel);
        }

        if (object.className === 'MoveVoxelCommand' &&  object.voxel.type !== 0) {
            console.log(object.voxel);
            dbOperation.gotoDB(object.voxel);
        }

        if (object.className === 'RemoveVoxelCommand' &&  object.voxel.type !== 0) {
            console.log(object.voxel);
            dbOperation.RemoveById(object.voxel.id);
        }

    } else {
        console.error('invalid commmand', serializedCommand);
    }
}

function getInitCommands(ws) {
    for (const voxel of voxelGrid.voxels.values()) {
        var command = new AddVoxelCommand(voxelGrid, voxel.id, voxel.x, voxel.y, voxel.z, voxel.type, voxel.color);
        const serializedCommand = JSON.stringify(command);
        ws.send(serializedCommand);
    }

    // Read MongoDB if result is empty
    dbOperation.RetrieveObjects((res)=> {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            var command = new AddVoxelCommand(voxelGrid, res[i].get('uuid'),
                res[i].get('x'), res[i].get('y'), res[i].get('z'), res[i].get('type'), '');
            const serializedCommand = JSON.stringify(command);
            ws.send(serializedCommand);
        }
    });
}
