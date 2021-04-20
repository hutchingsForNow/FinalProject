const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// setup express
const app = express();

// setup body parser middleware to conver to JSON and handle URL encoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/recipe', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);

//imports recipes module
const recipes = require("./recipes.js");
app.use("/api/recipes", recipes.routes);


//for todo-list for single recipe

// Create a scheme for projects
const projectSchema = new mongoose.Schema({
  name: String,
  color: String
});

// Create a model for projects
const Project = mongoose.model('Project', projectSchema);

// Create a project
app.post('/api/projects', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    color: req.body.color
  });
  try {
    await project.save();
    res.send(project);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all projects
app.get('/api/projects', async (req, res) => {
  try {
    let projects = await Project.find();
    res.send(projects);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Schema for items
const itemSchema = new mongoose.Schema({
  project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project'
  },
  text: String,
  completed: Boolean,
})

// Model for items
const Item = mongoose.model('Item',itemSchema);

//api endpoint for creating items
app.post('/api/projects/:projectID/items', async (req, res) => {
  try {
      let project = await Project.findOne({_id: req.params.projectID});
      if (!project) {
          res.send(404);
          return;
      }
      let item = new Item({
          project: project,
          text: req.body.text,
          completed: req.body.completed,
      });
      await item.save();
      res.send(item);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//get list of items
app.get('/api/projects/:projectID/items', async (req, res) => {
  try {
      let project = await Project.findOne({_id: req.params.projectID});
      if (!project) {
          res.send(404);
          return;
      }
      let items = await Item.find({project:project});
      res.send(items);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//updating items
app.put('/api/projects/:projectID/items/:itemID', async (req, res) => {
  try {
      let item = await Item.findOne({_id:req.params.itemID, project: req.params.projectID});
      if (!item) {
          res.send(404);
          return;
      }
      item.text = req.body.text;
      item.completed = req.body.completed;
      await item.save();
      res.send(item);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//delete items
app.delete('/api/projects/:projectID/items/:itemID', async (req, res) => {
  try {
      let item = await Item.findOne({_id:req.params.itemID, project: req.params.projectID});
      if (!item) {
          res.send(404);
          return;
      }
      await item.delete();
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));