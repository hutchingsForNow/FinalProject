
<template>
<div class="singlePhoto">
  <router-link :to="{ name: 'photo', params: { id: photo._id }}"><img :src="photo.path" /></router-link>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return{
      photo: {}
    }
  },
  async created() {
  try {
        let response = await axios.get('/api/photo/:id');
        this.$route.params.id = response.data.id;
      } catch (error) {
        this.$route.params.id = null;
      }
    
  }
}

</script>

