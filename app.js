
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
var smtpTransport = require('nodemailer-smtp-transport');


//var url = "mongodb://localhost:27017/sampledb";
var url = "mongodb://admin:secret@mongodb/sampledb";

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
  // render `postad.ejs` 
  res.render('postad')
})

app.get('/about', (req, res) => {
  // render `about.ejs`
  res.render('about')
})

app.get('/terms', (req, res) => {
  // render `terms.ejs`
  res.render('terms')
})

app.get('/ai-news', (req, res) => {
  // render `terms.ejs`
  res.render('ai-news')
})

app.get('/ai-news1', (req, res) => {
  // render `terms.ejs`
  res.render('ai-news1')
})

app.get('/ai-news2', (req, res) => {
  // render `terms.ejs`
  res.render('ai-news2')
})

app.get('/ai-news3', (req, res) => {
  // render `terms.ejs`
  res.render('ai-news3')
})
app.get('/mobile-news', (req, res) => {
  // render `terms.ejs`
  res.render('mobile-news')
})
app.get('/quantumcomp', (req, res) => {
  // render `terms.ejs`
  res.render('quantumcomp')
})


app.get('/posts', (req, res) => {

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
	dbo.collection('posts').createIndex( { name: "text", poster: "text", category: "text", title: "text", body: "text" } )
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
	  }).toArray(function(err, posts)  {
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


app.get('/post/:_id', (req, res) => {
  // find the post in the `posts` array

//const post = posts.filter((post) => {
       // return post.id == req.params.id
      //})[0]


  
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

	
var heading = post.title;
var responder = req.body.poster;
var emailaddress = req.body.email;
var response = req.body.body;
    		
console.log("poster: " + heading + responder + emailaddress + response);




  var transporter = nodemailer.createTransport(smtpTransport({
  name: 'pigeon.whogohost.com',
  host: 'mail.myafrihub.com.ng',
  port: 465,
  secure:true,
  tls: {
        rejectUnauthorized: false
   },
  auth: {
    user:'response@myafrihub.com.ng',
    pass:'***********'
  }

}));

var mailOptions = {
  from: 'AFRIHUB RESPONSE <response@myafrihub.com.ng>',
  to: post.email,
  replyTo:req.body.email,
  subject: 'Afrihub: Re:' + post.title,
  context: {
	heading:heading,
	responder:responder,
	emailaddress:emailaddress,
	response:response
},
  text: 'You have recieved a response to your ad on myafrihub \n Responder: '+ req.body.poster + '\n Response: '+ req.body.body
  //html: '<h1>Reply to your ad on myafrihub</h1><h2>Do not reply to this mail directly</h2> <h3>Title: '+docs[0]['heading']+'</h3> <h3>Response from: '+docs[0]['responder'] + ' </h3> <h3>Reply to: '+docs[0]['emailaddress']+'</h3> <h3>Response: '+docs[0]['response']+ '</h3>'
  //html:
 // {
  // path:'views/email.ejs'

//},
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
res.send("Cannot send reply:  + "<br>" + <h1> Bad email </h1>")
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
	dbo.collection('posts').createIndex( { name: "text", poster: "text", category: "text", title: "text", body: "text" } )
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
        
app.listen(8080)

console.log('listening on port 8080')
