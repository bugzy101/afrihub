
// require and instantiate express
var express = require('express')
var path = require('path')
const app = require('express')()
var bodyParser = require('body-parser');
var faker = require('faker')
var nodemailer = require('nodemailer')
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose').set('debug', true);
mongoose.connect("mongodb://127.0.0.1:27017/afrihub")
var assert = require('assert');  
var util=require('util');

var url = "mongodb://127.0.0.1:27017/afrihub";



var db = mongoose.connection;

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
  // render `home.ejs` with the list of posts
  res.render('postad')
})

app.get('/about', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('about')
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

         MongoClient.connect('mongodb://127.0.0.1:27017/afrihub', function(err, db) {
	if(err) throw err;
  	var dbo = db.db("afrihub");
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
	  }).toArray(function(err, items) {
	    res.render('posts', {
			posts: items,
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

MongoClient.connect('mongodb://127.0.0.1:27017/afrihub', function(err, db) {
	if(err) throw err;
  	var dbo = db.db("afrihub");
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

MongoClient.connect('mongodb://127.0.0.1:27017/afrihub', function(err, db) {
	if(err) throw err;
  	var dbo = db.db("afrihub");
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

         MongoClient.connect('mongodb://127.0.0.1:27017/afrihub', function(err, db) {
	if(err) throw err;
  	var dbo = db.db("afrihub");
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
	  }).toArray(function(err, items) {
	    res.render('posts', {
			posts: items,
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
