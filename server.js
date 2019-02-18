const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex')
const multiline = require('multiline');

const savepoject = require('./controllers/saveproject');
const getprojects = require('./controllers/projects');
const getproject = require('./controllers/project');
const getprojectForms = require('./controllers/forms');
const loadproject = require('./controllers/loadproject');

//const image = require('./controllers/image');


const postgres = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl:false,
  }
});
/*
const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'gtalcvcs12',
    database : 'smart-brain'
  }
});*/

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var whitelist = ['http://localhost:3000']
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions))



app.get('/',(req,res)=>{
	res.send("It is working");
})

app.get('/getallprojects',getprojects.handleData(postgres))
app.get('/getProjectForms/:id/',(req,res)=>getprojectForms.handleFormsData(req,res,postgres))

app.get('/loadSelectedProject/:id/',(req,res)=>loadproject.handleLoadProjectData(req,res,postgres))

app.get('/getProject/:name/',(req,res)=>{getproject.handleProjectGet(req,res,postgres)})

app.post('/saveProject',(req,res) => {savepoject.handleSaveProject(req,res,postgres)})

// 
app.listen(process.env.PORT || 3000,()=>{
	console.log(`app is running on port ${process.env.PORT}`);
})



/*
/ --> res =  this is working
/signin -->POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT
*/