const express = require('express');
const path  = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load user model
require('./models/User');
require('./models/Story');
//passport config
require('./config/passport')(passport);

//loads routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');


//load keys
const keys = require('./config/keys');

//mogoose global promis
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI,{
    useMongoClient:true
}).then(()=>{
    console.log('mongodb connected')
}).catch(err=>{
    console.log(err)
})

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
})
);
app.set('view engine','handlebars');

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
});
//set static folder
app.use(express.static(path.join(__dirname,'public')));
//uses routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories)

const port = process.env.PORT || 3000;

app.listen(port,
()=>{
    console.log(`server running on  ${port}` );
});