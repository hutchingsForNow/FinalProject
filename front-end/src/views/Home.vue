<template>
<div class="home">
  <br/>
  <cookBook :recipes="recipes" />
  <p v-if="error">{{error}}</p>
  <br/><br/>
</div>
</template>

<script>
import axios from 'axios';
import CookBook from '@/components/CookBook.vue';
export default {
  name: 'Home',
  components: {
    CookBook,
  },
  created() {
    this.getRecipes();
  },
  data() {
    return {
      recipes: [],
      error: '',
    }
  },
  methods: {
    async getRecipes() {
      try {
        let response = await axios.get("/api/recipes/all");
        this.recipes = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
.home{
  margin-left: 15px;
  margin-right: 15px;
}

</style>
