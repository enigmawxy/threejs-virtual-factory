const Observable = require('../Observable');
var Parse = require('parse/node');

class DbOperation extends Observable{
    constructor(props) {
        super(props);

        console.log(props);
        this.Parse = Parse;
        this.Parse.initialize(props.appId, props.key);
        this.Parse.serverURL = props.url;
    }

    gotoDB(props) {
        const SceneObjects = Parse.Object.extend("SceneObjects");
        let item = {
            uuid: props.id,
            x: props.x,
            y: props.y,
            z: props.z,
            type: props.type
        };
        let sceneObject = new SceneObjects();

        sceneObject.save(item)
            .then((sceneObject) => {
                console.log('New object created with objectId: ' + sceneObject.id + "|"+ sceneObject.uuid);
                props.color = sceneObject.id;
                console.log(props);
            }, (error) => {
                console.log('Failed to create new object, with error code: ' + error.message);
            });
    }

    RemoveById(uuid) {
        const SceneObjects = Parse.Object.extend("SceneObjects");
        var query = new Parse.Query(SceneObjects);
        query.equalTo("uuid", uuid);
        query.find().then((results)=>{
            // find this object by unique id and get the Object itself
            // then call the object's destroy method.
            query.get(results[0].id)
                .then((myObject) => {
                    myObject.destroy().then((myObject)=>{
                        console.log('deleted for: ' + myObject);
                    }, (error)=>{
                        console.log('Failed to delete' + error.message);
                    });
                }, (error) => {
                    console.log('No record found with error code: ' + error.message);
                });
        }, (error)=>{
            console.log('No record found with error code: ' + error.message);
        })
    }

    RetrieveObjects(callback) {
        const SceneObjects = Parse.Object.extend("SceneObjects");
        const query = new Parse.Query(SceneObjects);
        query.limit(5000);

        var results = null;

        try {
            query.find().then((results)=>{
                if(callback)
                    callback(results)
            }, (error)=> {
                console.log('No record found with error code: ' + error.message);
            });
        } catch (error) {
            console.log('Error: ' + error.code + " "+ error.message);
        }
    }
}

module.exports = DbOperation;

