<template>
<div class="dashboard">
  <MyRecipe v-if="user" />
  <Login v-else />
  <br/>
</div>
</template>

<script>
import axios from 'axios';
import Login from '@/components/Login.vue';
import MyRecipe from '@/components/MyRecipes.vue';
export default {
  name: 'dashboard',
  components: {
    MyRecipe,
    Login,
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>

<style scoped>
.dashboard {
  margin-left: 15px;
  margin-right: 15px;
}

</style>
