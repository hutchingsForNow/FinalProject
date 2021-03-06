
<template>
<div class="recipe">
  <p v-if="error">{{error}}</p>
  <div class='recipeContent' v-if=recipe>
    <br/>
    <h1>{{recipe.title}}</h1>
    <img :src="recipe.path"/>
    <h2>{{recipe.description}}</h2>
  </div>    
  <div id="projects">
    <button :style="{backgroundColor: project.color}" :class="{ white: darkColor(project.color), selected: active(project)}" v-for="project in projects" :key=project.id @click=selectProject(project)>{{project.name}}</button>
  </div>
  <form @submit.prevent="addProject">
        <input type="text" class='projName' v-model="projectName" placeholder="e.g. ingredients, steps">
        <button type="submit">Add Step</button>
        <swatches-picker v-model="color"/>
    </form>
  <div class="todoItems" v-if="project">
    <p v-show="activeItems.length === 0">You are done with all your tasks! Good job!</p>
    <form @submit.prevent="addItem">
      <input type="text" v-model="text" placeholder="e.g. rice, fry meat">
      <button type="submit">Add Item</button>
    </form>
    <div class="controls">
      <button @click="showAll()">Show All</button>
      <button @click="showActive()">Show Active</button>
      <button @click="showCompleted()">Show Completed</button>
      <button @click="deleteCompleted()">Delete Completed</button>
    </div>
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        <label :class="{ item: true, completed: item.completed }">
          {{ item.text }}
          <input type="checkbox" v-model="item.completed" @click="completeItem(item)" />
          <span class="checkmark"></span>
        </label>
        <button @click="deleteItem(item)" class="delete">X</button>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { Swatches } from 'vue-color'
export default {
  name: 'recipe',
  components: {
    'swatches-picker': Swatches
  },
  data() {
    return{
      recipe: null,
      user: null,
      title: '',
      error: '',
      description: '',
      date: '',
      projects: [],
        project: null,
        projectName: '',
        color: "#000",
      items: [],
      text: '',
      show: 'all',
    }
  },
    async created() {
    try {
      this.getRecipe();
      this.getProjects();
      let response = await axios.get('/api/users');
      this.user = response.data.user;
    } catch (error) {
      this.user.$root.$data.user = null;
    }    
  },
  computed: {
    activeItems() {
      return this.items.filter(item => {
        return !item.completed;
      });
    },
    filteredItems() {
        if (this.show === 'active')
          return this.items.filter(item => {
            return !item.completed;
          });
        if (this.show === 'completed')
          return this.items.filter(item => {
            return item.completed;
          });
        return this.items;
    },
  },
  methods:{
    async getRecipe(){
      try {
        let response = await axios.get('/api/recipes/' + this.$route.params.id);
        this.recipe = response.data;  
      } catch (error) {
        this.error = error.response.data.message;
      }    
    },    
    async addProject() {
      try {
        await axios.post("/api/recipes/" + this.$route.params.id + "/projects", {
          name: this.projectName,
          color: this.color.hex,
        });
        await this.getProjects();
      } catch (error) {
        console.log(error);
      }
    },
    async getProjects() {
      try {
        const response = await axios.get("/api/recipes/" + this.$route.params.id + "/projects");
        this.projects = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    selectProject(project) {
      this.project = project;
      this.getItems();
    },
    async getItems() {
      try {
        const response = await axios.get(`/api/recipes/${this.recipe._id}/projects/${this.project._id}/items`);
        this.items = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addItem() {
      try {
        await axios.post(`/api/recipes/${this.recipe._id}/projects/${this.project._id}/items`, {
          text: this.text,
          completed: false
        });
        this.text = "";
        this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async completeItem(item) {
      try {
        axios.put(`/api/recipes/${this.recipe._id}/projects/${this.project._id}/items/${item._id}`, {
          text: item.text,
          completed: !item.completed,
        });
        this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(item) {
      try {
        await axios.delete(`/api/recipes/${this.recipe._id}/projects/${this.project._id}/items/${item._id}`);
        this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    showAll() {
      this.show = 'all';
    },
    showActive() {
      this.show = 'active';
    },
    showCompleted() {
      this.show = 'completed';
    },
    deleteCompleted() {
      this.items.forEach(item => {
        if (item.completed)
          this.deleteItem(item);
      });
    },
    active(project) {
      return (this.project && project._id === this.project._id);
    },
    darkColor(color) {
      return (this.lightOrDark(color) === 'dark');
    },
    lightOrDark(/*color*/) {
      return 'dark';
    /*  let hex = color;
      if (typeof color === 'object' && color !== null)
        hex = color.hex;

    // Convert it to RGB: http://gist.github.com/983661
      let rgb = +0; ("0x" + hex.slice(1).replace( 
      hex.length < 5 && /./g, '$&$&'));

      const r = rgb >> 16;
      const g = rgb >> 8 & 255;
      const b = rgb & 255;
      
      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
      );

      // Using the HSP value, determine whether the color is light or dark
      if (hsp>127.5) {
          return 'light';
      } 
      else {
          return 'dark';
      }*/
    }
  }
}

</script>

<style scoped>
/* List */
h1{
  font-size: 3em;
  color: white;
}

h2{
  font-size: large;
  color: white;
}

.recipe{
  margin-left: 15px;
  margin-right: 15px;
}

.recipeContent{
  margin: auto;
}

img{
  margin-top: 30px;
  margin: auto;
  max-width: 50%;
  max-height: 600px;
  display: block;
}

ul {
  list-style: none;
}

li {
  /*background: #fff;*/
  width: 500px;
  min-height: 40px;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 3em;
  display: flex;
  align-items: center;
}

p {
  font-size: small;
}

.delete {
  display: none;
  margin-left: auto;
}

li:hover .delete {
  display: block;
  transform: scale(.5);
}

label {
  width: 400px;
}

.completed {
  text-decoration: line-through;
}

/* Form */
input[type=checkbox] {
  transform: scale(1.5);
  margin: 10px;
}

input[type=text] {
  font-size: 1em;
}

/* make it so that when you hover or select the projectName box, the vc-swathes colors will appear. Otherwise they are not showing */
.vc-swatches {
  /*margin-bottom: 20px;*/
  display: block;
}

.projName:hover .vc-swatches{
  margin-bottom: 20px;
  display:block;
}

.projName:select .vc-swatches{
  margin-bottom: 20px;
  display:block;
}

#projects {
  margin-bottom: 20px;
}

/* All the buttons for the checklist */
button {
  font-family: 'Arvo';
  font-size: 1em;
  border: none;
  background-color: #ffe056;
  padding: 5px 10px;
  margin: 10px;
  margin-bottom: 20px;
}

button:focus {
  outline: none;
}

button:hover {
  border: 2px solid white;
}

button.selected {
  border: 2px solid #000;
}

.white {
  color: white;
}

/* Controls */
.controls {
  margin-top: 20px;
}

/* Custom checkbox
   Customize the label (the container) */
.item {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.item input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: rgb(175, 255, 255);
}

/* On mouse-over, add a more red background color */
.item:hover input~.checkmark {
  background-color: rgb(86, 248, 248);
}

/* When the checkbox is checked, add a light blue background */
.item input:checked~.checkmark {
  background-color: #ffec97;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.item input:checked~.checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.item .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

</style>




