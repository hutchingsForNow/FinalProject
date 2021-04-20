<template>
  <div id="app">
    <br/>
    <header id="header">
      <h1 class="h1">Recipes</h1>
      <nav>
        <router-link to="/"><i class="fas fa-home"></i></router-link>
        <router-link to="/dashboard"><i class="fas fa-user"></i></router-link>
    </nav>
    </header>
    <router-view />
     <!-- Footer -->
   <div class="footer">
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <ul>
            <li class="li">Email: reaganbh@byu.edu</li>
          </ul>
        </div>
        <div class="col-sm">
          <ul>
            <li class="li"><a href="https://github.com/hutchingsForNow/FinalProject.git">Github</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style>
body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 13pt;
  margin: 0 150px;
}

#app{
  background-color: teal;
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  top:0;bottom:0; /* vertical center */
  left:0;right:0;
  flex-direction: column;
  justify-content: space-evenly;
}

#header {
  /* Semi-circle */
  margin: 0 15px 15px 0;
  height: 100px;
  width: 200px;
  border-bottom-left-radius: 200px;
  border-bottom-right-radius: 200px;
  /* Fixed position*/
  position: relative; 
  z-index: 10000;
  left: 5%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #ff6b6b;
  text-align: center;
  box-shadow: 0 15px 0 15px rgb(117, 173, 65);
}

nav {
  display: flex;
  justify-content: center;
}

h1 {
  color: #fff;
  font-size: 18px;
}

.h1{
  color: black;
}

h2 {
  font-size: 12px;
}

#header .fas {
  font-size: 25px;
  color: black;
  width: 50px;
}

#header .fas:hover {
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 0 5px 0;
  color: black;
  width: 50px;
}

.pure-button-primary {
  background-color: teal;
}

.footer{
    bottom: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    background-color: #464646;
    color:white;
}

a { 
    text-decoration: none;
    color:white;
}

a:hover {
    text-decoration: underline;
    color:white;
    font-weight: bold;
}

.li {
  font-size: small;
  list-style: none;
}

</style>
