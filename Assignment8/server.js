const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');



const app = express(); //express used
app.use(bodyParser.json());
app.use('/user', userRoutes);
mongoose.connect('mongodb://localhost:27017/user_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
