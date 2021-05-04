const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, //ids to be created
    useUnifiedTopology: true,
    useFindAndModify:false,
})