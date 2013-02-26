var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var User = new Schema({
	first_name: {type:String, required: true, trim:true},
	last_name: {type:String, required: true, trim:true},
	email: {type:String, required: true, trim:true},
	username: {type:String, required: true, trim:true},
	password: {type:String, required: true, trim:true},
	school: {type:String, required: true, trim:true},
	points: {type:Number, required: true},
	courses: [Course]

	/*FaceBook stuff*/
});
var userM = mongoose.model('User', User);

var Comment = new Schema({
	user: Schema.ObjectId,
	time: Date, 
	content: {type:String, required: true, trim:true}
});
var commentM = mongoose.model('Comment', Comment);

var Answer = new Schema({
	content: {type:String, required: true, trim:true},
	user: Schema.ObjectId,
	time: Date,
	points: {type:Number, required:true},
	text: {type:String, required: true, trim:true},
	comments: [Comment]
});
var answerM = mongoose.model('Answer', Answer);

var Chat = new Schema({
	title: {type:String, required: true, trim:true},
	user: {type:Schema.ObjectId, required:true},
	content: {type:String, required: true, trim:true},
	comments: [Comment],
	time: {type:Date, required: true}
});
var chatM = mongoose.model('Chat', Chat);

var Question = new Schema({
	title: {type:String, required: true, trim:true},
	user: Schema.ObjectId,
	text: {type:String, required: true, trim:true},
	answers: [Answer],
	points: Number,
	comments: [Comment],
	time: Date
});
var questionM = mongoose.model('Question', Question);

var Course = new Schema({
	title: {type:String, required: true, trim:true},
	questions:[Question],
	chats:[Chat],
	description:{type:String, required: true, trim:true},
	students: [User]
});
var courseM = mongoose.model('Course', Course);

mongoose.connect('mongodb://localhost/four_joe');

app.use(express.logger());
app.use(express.compress());
app.use(express.cookieParser('ricky is da 1'));
app.use(express.cookieSession());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.post('/signup', function(req, res){
	console.log('new signup ' + req.body['username']);
  var args = {
			first_name: req.body['first-name'],
			last_name: req.body['last-name'],
			email: req.body['email'],
      username: req.body['username'],
			password: req.body['pass'],
			school: req.body['school'],
			points: 0
	};	
  userM.find(
		{$or: [{email:req.body['email']}, {username:req.body['username']}]}, 
		function(err, docs){	
		//If email user exist
		if(docs.length || err){
			res.send(403, 'Account exist for emaili or username')
		}else{
			userM.create(args, function(err){
		    if(err){
				  res.send(403, 'uhoh');	
				  console.log(err.toString());
				  return;
			  }
				console.log('Saved ' + args['first_name']);
	  	  res.sendfile('./public/home.html');
		  });
	  }
  });
});

app.post('/login', function(req, res){
	userM.find(
		{username:req.body['username'], password:req.body['pass']},
		function(err, docs){
			if(err || !docs.length){
				res.send(403, 'User not found');
			}else{
				console.log('login successful');
				res.sendfile('./public/home.html');
			}
		});
});

app.get('/api/v1/get_user_info', function(req, res){

});

app.post('/api/v1/add_course_to_user', function(req, res){

});

app.post('/api/v1/add_chat', function(req, res){
	var args = {
		title: req.body['title'],
		user: req.body['id'],
		content: req.body['content'],
		time: new Date()
	};
	chatM.create(args, function(err){
		if(err){
			res.send(403, 'Could not create chat');
		}else{
			res.send(200, 'Chat created');
		}
	});
	//Add chat to course

	//Add chat to user
});

app.get('/api/v1/get_chat', function(req, res){
	console.log('getting chat');
});

app.post('/api/v1/add_question', function(req, res){
	console.log('Adding question');
	var arg = { 
		title: req.body['title'],
		user:req.body['id'],
		text: req.body['text'],
		points: 0,
		time: new Date()
	};
	questionM.create(arg, function(err){
		if(err){
			res.send(403, 'Could not create question');
		}else{
			res.send(200, 'Question created');
		}
	});
	//Add question to course

	//Add question to User
});


app.get('/api/v1/get_question', function(req, res){

});

app.post('/api/v1/add_answer', function(req, res){
	var arg = {
		content:req.body['content'],
		user: req.body['id'],
		time: new Date(),
		points: 0,
		text: req.body['text']
	}

	var answer = new answerM(arg);
	answer.save(function(err){
		if(err){
			res.send(403, 'Could not save answer');
		}else{
			res.send(200, 'Saved answer');
			//add answer to question
		  //Update user
		}
	})
});

app.get('/api/v1/get_answer', function(req, res){

});

app.post('/api/v1/add_comment', function(req, res){
	var arg = {
	  user: req.body['id'],
		time: new Date(),
		content: req.body['content']
	}

	var comment = new commentM(arg);
	comment.save(function(err){
		if(err){
      res.send(403, 'Could not add comment');
		}else{
			res.send(200, 'Saved comment');
			//updte question, answer, or chat
			//update user?
		}
	});
});

app.post('/api/v1/create_course', function(req, res){
	courseM.find({title:req.body['title']}, function(err, docs){
		if(err || docs.length){
			res.send(403, 'Course exist');
		}else{
			var args = {
					title: req.body['title'],
					description: req.body['desc']
			};
			courseM.create(args, function(err){
				if(err){
					res.send(403, 'Couldnt create course');
				}else{
				  res.send(200, 'Course created');	
				}
			});
		}
	});
});

app.get('/api/v1/get_courses', function(req, res){
		
});

app.get('/api/v1/get_course', function(req, res){
		
});
app.listen(8000);
console.log('listening on port 8000');
