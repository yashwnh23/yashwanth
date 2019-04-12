// Express application to perform CRUD operations with MongoDb
var  express  =  require("express");
var bodyParser = require("body-parser");

var  app  = express();
app.use(bodyParser.urlencoded({extended : false}));


var mongoClient = require("mongodb").MongoClient;
var url = 'mongodb://localhost:27017/';
var  db ;

mongoClient.connect(url, {useNewUrlParser:true} , function (err, database) 
{	
        if(err) { console.log(err); return;  }
		db = database.db("testDb"); 
		console.log("Connected to MongoDb Database.");
 });
 

app.get("/",  function(req, res)
{	     
    db.collection("depts").find().toArray(function(err,result)
    {  
        var data  = {};
        data.depts = result;    
        res.render( "depts.ejs" , data);
    });     
});

app.get("/create",  function(req, res)
{	     
    res.render( "create.ejs" , null);
});

app.post("/create",  function(req, res)
{	     
    var obj = {};
	obj.deptno  = parseInt(req.body.t1);
	obj.dname  = req.body.t2;
	obj.loc  = req.body.t3;

	db.collection('depts').insertOne(obj) ;
	console.log("New Dept is added to database");
	res.redirect("/");	 
});


app.get("/edit/:id",  function(req, res)
{	     
    var  dno  = parseInt(  req.params.id );
    db.collection("depts").findOne({deptno:dno}, function(err, result)
    {  
        var data  = {};
        data.deptObj = result;    
        res.render( "edit.ejs" , data);
    });  
    
});

app.post("/edit",  function(req, res)
{	     
    var obj = {};
	obj.deptno  = parseInt(req.body.t1);
	obj.dname  = req.body.t2;
	obj.loc  = req.body.t3;

	db.collection('depts').updateOne({deptno:obj.deptno}, {$set:obj});
	console.log("Dept is updated to database");
	res.redirect("/");	 
});


app.get("/delete/:id",  function(req, res)
{	     
    var  dno  = parseInt(  req.params.id );
    db.collection("depts").deleteOne({deptno:dno}, function(err, result)
    {  
        console.log("Dept is deleted from  database");
        res.redirect("/");	 
    });  
    
});

app.listen(3002);
console.log("Server started.   http://localhost:3002/");