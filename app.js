const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load user model
require('./models/User');
//passport config
require('./config/passport')(passport);

//loads routes
const auth = require('./routes/auth');


//load mongoose keys
const keys = require('./config/keys');

//mongoose connect
mongoose.connect(keys.mongoURI,{
    useMongoClient:true
}).then(()=>{
    console.log('mongodb connected')
}).catch(err=>{
    console.log(err)
})

const app = express();

app.get('/',(req,res)=>{
    res.send('Its work');
}); 

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUnitialized: false
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//set global vars
app.use((req,res,next)=>{
res.locals.user = req.user || null;
next();
})
//uses routes
app.use('/auth',auth);

const port = process.env.PORT || 3000;

app.listen(port,
()=>{
    console.log(`server running on  ${port}` );
})