const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@dsp-mod7-b-cluster-4xabi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log(err);
    console.log(collection);
    client.close();
});