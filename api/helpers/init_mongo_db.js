const mongoose = require ('mongoose');
require('dotenv').config();
mongoose.connect(
    "mongodb+srv://varlyq-task:"+ process.env.MONGO_ATLAS_PW
    +"@cluster0.znz6qm7.mongodb.net/",{
        useNewUrlParser :true,
    }
 
).then(()=> console.log('database connected')).catch((error)=> console.log(error));

mongoose.Promise = global.Promise;