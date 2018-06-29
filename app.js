
// require and instantiate express
var express = require('express')
var path = require('path')
const app = require('express')()
var bodyParser = require('body-parser');
var faker = require('faker')
var nodemailer = require('nodemailer')
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose').set('debug', true);
var assert = require('assert');  
var util=require('util');
var Server = require('mongodb').Server;

var url = "mongodb://admin:secret@mongodb/sampledb";

//mongoose.connect("mongodb://127.0.0.1:27017/sampledb")
mongoose.connect(url)

var db = mongoose.connection;


// Initialize connection once
//MongoClient.connect("mongodb://localhost:27017/sampledb", function(err, database) {
  //if(err) throw err;

 // db = database;
//});


// fake posts to simulate a database

var postSchema = new mongoose.Schema({ 
    id: Number,
    poster: String,
    email: String,
    telephone: String,
    category: String,
    title: String,
    body: String,
    timestamp: Date


});

var Post = mongoose.model('Post', postSchema);

/*To make our DB accessible to our router */
app.use(function(req, res, next){
    req.db = db;
    next();
});




var docs = [{ poster: "Bugzy", email: "bugzy231@gmail.com", telephone:"+2348109616049", category:"Programming",title:"I will do your programming", body: "I am an advanced Java programmer. I can also programm in c and c++. Do you have a java project at hand? I am your guy. contact me for your programming needs", timestamp: new Date()},
		    { poster: "Henry", email: "h.amuka@yhoo.ca", telephone:"+2348109616049", category:"Database",title:"I am a Database Administrator", body: "I am into database management. I design and manage relational database. If you are looking for a database administrator, I am your guy. If you are looking to design a relational database for your business, contact me.", timestamp: new Date()},
		    { poster: "Nonso", email: "bugzy231@gmail.com", telephone:"+2348109616049",category:"web application",title:"I will design your websites at affordable rate", body: "I am into web design. I do modern and up to date web application. I will design, host and manage your web applications at an affordable rate. Contact me for details.", timestamp: new Date()},
		    { poster: "Nony", email: "bugzy231@gmail.com", telephone:"+2348109616049",category:"software engineering",title:"I am a software engineer",body:"I am a software engineer. I am an advanced Java, C, and C++ programmer. contact me for your small scale and huge projects.", timestamp: new Date() },
		    { poster: "Nonyyo", email: "bugzy231@gmail.com", telephone:"+2348109616049", category:"Data Structure",title:"I am a data analyst", body: "I am into data mining and data management. I will manage your huge database and provide real time efficient data structures for your programs for efficiency. Contact me for an efficient programming projects", timestamp: new Date()},
		    { poster: "Chukwunonso", email: "h.amuka@yhoo.ca",telephone:"+2348109616049",category:"Embedded Systems",title:"I am into embedded systems", body: "I am an embedded system engineer. I am good at assembly language. Contact me for details.", timestamp: new Date() },
		    { poster: "Blue Ocean", email: "h.amuka@yhoo.ca",telephone:"+2348109616049",category:"Game Development",title:"I will do your programming",title:"We are looking for someone into game development",body: "Blue Ocean Business World Limited is looking for industrious people to join our team of software engineers, realtors, financial service specialists. We are looking for talented and hardworking people in our software, real estate and financial departments. We are looking for people with the knowledge of web applications, mobile applications, desktop application and database management service, real estate services, accounting, book keeping, Taxes", timestamp: new Date() },
		    { poster: "Blue Tech", email: "bugzy231@gmail.com",telephone:"+2348109616049",category:"Graphics Design",title:"I am looking for a graphics designer",body: "Blue Ocean Business World Limited is looking for industrious people to join our team of software engineers, realtors, financial service specialists. We are looking for talented and hardworking people in our software, real estate and financial departments. We are looking for people with the knowledge of web applications, mobile applications, desktop application and database management service, real estate services, accounting, book keeping, Taxes.", timestamp: new Date() },
		    { poster: "Amuka", email: "bugzy231@gmail.com",telephone:"+2348109616049", category:"Hardware",title:"Cisqo and hardware coupling", body:"I am into computer hardware. I have ComptIA A+ and cisqo certifications. Contact me for details", timestamp: new Date()},
		    { poster: "bugzy101", email: "bugzy231@gmail.com",telephone:"+2348109616049", category:"Mobile Development",title:"I will develop mobile applications for you",body: "I am into mobile app development. I develop android and iOS applications. Please feel free to contact me for your mobile apps dev. ", timestamp: new Date()},
		    { poster: "hamuka", email: "h.amuka@yhoo.ca", telephone:"+2348109616049", category:"Shell Scripting",title:"I will do your shell and kernel management",body: "are you looking for someone to manage your shell and linux kernel? I am your guy. I can write shell scripts(wrappers) for your projects. Please contact me for details", timestamp: new Date()},
		    { poster: "Bugz101", email: "h.amuka@yhoo.ca", telephone:"+2348109616049",category:"Tutoring", title:"Are you looking for a tutor in programming?",body: "I am your tutor in programming. I will teach you Java, C, C++, relational database, web application, mobile application, etc. I will also do your computer science assignments and projects at affordable rate. Contact me for details.", timestamp: new Date()},
		    { poster: "Nonso", email: "bugzy231@gmail.com", telephone:"+2348109616049",category:"Software Engineering",title:"I am a software engineer",body: "I am a software engineer. I can design applications in Java, C, C++, python, javascript, etc. We design huge projects. Just provide your functional and non-functional requirements and I will do a good job for you.", timestamp: new Date() },
		    { poster: "ChiNonso", email: "bugzy231@gmail.com", telephone:"+2348109616049",category:"Web Application",title:"I am looking for a web designer",body:"I am looking for someone to design my website at a reasonable price. Please contact me if you are into web design", timestamp: new Date() }];





// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));










// blog home page
app.get('/', (req, res) => {

//render `home.ejs` with the list of posts

  res.render('home', {})
})
app.get('/postad', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('postad')
})

app.get('/about', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('about')
})

app.get('/posts', (req, res) => {


MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	// db pointing to newdb
	console.log("Switched to "+db.databaseName+" database");
  	var dbo = db.db("sampledb");
	// documents to be inserted
	
	
	// insert multiple documents to 'users' collection using insertOne
	dbo.collection("posts").insertMany(docs, function(err, res) {
		if (err) throw err;
		console.log(res.insertedCount+" documents inserted");
		// close the connection to db when you are done with it
		db.close();
	});
});

   var perPage = 12
    var page = req.params.page || 1

    Post
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
	.sort({ timestamp: 'desc'})
        .exec(function(err, posts) {
            Post.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('posts', {
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

app.get('/posts/:page', function(req, res, next) {
    var perPage = 12
    var page = req.params.page || 1

    Post
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
	.sort({ timestamp: 'desc'})
        .exec(function(err, posts) {
            Post.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('posts', {
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})



app.post('/postad', (req, res) => {
    var postData = new Post(req.body);
    postData.timestamp = new Date();
    postData.save().then( result => {
res.send( "Ad succesfully uploaded."+ "<br>" + "<a href='/'> Home</a>" + "<br>" +"<a href='/posts'> Posts</a>" + "<br>");
    }).catch(err => {
        res.status(400).send("Unable to save data");
    });
});


app.post('/', (req, res) => {

var perPage = 12
    var page = req.params.page || 1

         MongoClient.connect(url, function(err, db) {
	if(err) throw err;
  	var dbo = db.db("sampledb");
        dbo.collection('posts').find({
	"$text": {
	      "$search": req.body.search
	    }
	}, {

	document: 1,
	    created: 1,
	    _id: 1,
	    textScore: {
	      $meta: "textScore"
	    }
	  }, {
	    sort: {
	      textScore: {
		$meta: "textScore"
	      }
	    }
	  }).toArray(function(err, posts) {
	    res.render('posts', {
			posts: posts,
			current: page,
		        pages: Math.ceil(120 / perPage)
	  })
	});
	
})


       // res.redirect('/posts');
   
    
});


// blog post
app.get('/post/:_id', (req, res) => {
  // find the post in the `posts` array

//const post = posts.filter((post) => {
       // return post.id == req.params.id
      //})[0]

var id = new require('mongodb').ObjectID(req.params._id);

MongoClient.connect(url, function(err, db) {
	if(err) throw err;
  	var dbo = db.db("sampledb");
        dbo.collection('posts').findOne({
	_id: id
        }, function(err, post){
		if (err) return 
		if(!post){
			console.log("wrong post\n");
		    }else{
	// render the `post.ejs` template with the post content
			console.log("correct post!!\n");
			res.render('post', {
			    title: post.title,
			    body: post.body,
			    poster: post.poster,
			    timestamp: post.timestamp,
			    email: post.email,
			    telephone: post.telephone
			  })
		    }
		
    			db.close();

	
    });   
 });
  
})


app.post('/post/:_id', (req, res) => {


var id = new require('mongodb').ObjectID(req.params._id);

MongoClient.connect(url, function(err, db) {
	if(err) throw err;
  	var dbo = db.db("sampledb");
        dbo.collection('posts').findOne({
	_id: id
        }, function(err, post){
		if (err) return 
		if(!post){
			console.log("wrong post\n");
		    }else{

		console.log("Found!!!\n");
		    
}
		
    			db.close();

	
    


  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'bugzy231@gmail.com',
    pass:'*********'
  }
});

var mailOptions = {
  from: 'bugzy231@gmail.com',
  to: post.email,
  subject: 'Afrihub: Re:' + post.title,
  text: req.body.body
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 

    
res.send( "You have successfully responded to: "+post.title + "<br>" + "<a href='/'> Home</a>" + "<br>" +"<a href='/posts'> Posts</a>" + "<br>");
   
    
});
 });
 });

app.post('/search', function(req, res) {

    var perPage = 12
    var page = req.params.page || 1

         MongoClient.connect(url, function(err, db) {
	if(err) throw err;
  	var dbo = db.db("sampledb");
        dbo.collection('posts').find({
	"$text": {
	      "$search": req.body.search
	    }
	}, {

	document: 1,
	    created: 1,
	    _id: 1,
	    textScore: {
	      $meta: "textScore"
	    }
	  }, {
	    sort: {
	      textScore: {
		$meta: "textScore"
	      }
	    }
	  }).toArray(function(err, posts) {
	    res.render('posts', {
			posts: posts,
			current: page,
		        pages: Math.ceil(120 / perPage)
	  })
	});
	
})
})
        




app.get('/generate-fake-data', function(req, res, next) {
    for (var i = 0; i < 90; i++) {
        var product = new Post()

        product.category = faker.commerce.department()
        product.title = faker.commerce.productName()
        product.email = faker.internet.email()
	product.name = faker.name.findName()
        product.body = faker.lorem.sentences()
	product.timestamp = faker.date.past(1, '2017-01-01')


        product.save(function(err) {
            if (err) throw err
        })
    }
    res.redirect('/postad')
})

app.listen(8080)

console.log('listening on port 8080')
