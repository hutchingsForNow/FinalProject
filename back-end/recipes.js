const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const recipeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    path: String,
    title: String,
    description: String,
    created: {
      type: Date,
      default: Date.now
    },
});
  
const Recipe = mongoose.model('Recipe', recipeSchema);

//defines api
// upload recipe
router.post("/", validUser, upload.single('recipe'), async (req, res) => {
    // check parameters
    if (!req.file)
      return res.status(400).send({
        message: "Must upload a file."
      });
  
    const recipe = new Recipe({
      user: req.user,
      path: "/images/" + req.file.filename,
      title: req.body.title,
      description: req.body.description,
    });
    try {
      await recipe.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get my recipes
router.get("/", validUser, async (req, res) => {
    // return recipes
    try {
      let recipes = await Recipe.find({
        user: req.user
      }).sort({
        created: -1
      }).populate('user');
      return res.send(recipes);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

// get all recipes
router.get("/all", async (req, res) => {
  try {
    let recipes = await Recipe.find().sort({
      created: -1
    }).populate('user');
    return res.send(recipes);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//get single recipe for when you click on an image
router.get("/:id", async (req, res) => {
  try {
    let recipe = await Recipe.findOne({
      _id: req.params.id
    }).populate('user');
    //let recipe = response.data;
    return res.send(recipe);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


//for todo-list for single recipe

// Create a scheme for projects. project is in RecipeSchema
const projectSchema = 
new mongoose.Schema({
  name: String,
  color: String,
  recipe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recipe'
  },
});

// Create a model for projects
const Project = mongoose.model('Project', projectSchema);

///projects/${this.project._id}/items/${item._id}
// Create a project
router.post("/:recipeID/projects", async (req, res) => {
  let recipeObj = await Recipe.findOne({_id: req.params.recipeID});
  const project = new Project({
    name: req.body.name,
    color: req.body.color,
    recipe: recipeObj,
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
router.get("/:recipeID/projects", async (req, res) => {
  try {
    let recipeObj = await Recipe.findOne({_id: req.params.recipeID})
    let projects = await Project.find({
      recipe: recipeObj
    });
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
router.post('/:recipeID/projects/:projectID/items', async (req, res) => {
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
router.get('/:recipeID/projects/:projectID/items', async (req, res) => {
  try {
      let project = await Project.findOne({_id: req.params.projectID});
      if (!project) {
          res.send(404);
          return;
      }
      let items = await Item.find({project:project});
      console.log(items)
      res.send(items);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

//updating items
router.put('/:recipeID/projects/:projectID/items/:itemID', async (req, res) => {
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
router.delete('/:recipeID/projects/:projectID/items/:itemID', async (req, res) => {
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

module.exports = {
  model: Recipe,
  routes: router,
}

