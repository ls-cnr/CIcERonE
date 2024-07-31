<template>
  <div class="acquire-viewpoint">
    <h2>Acquire Viewpoint</h2>
    <div class="form-group">
      <label for="source">Source:</label>
      <textarea id="source" v-model="source" rows="1" class="source-textarea"></textarea>
    </div>
    <div class="form-group">
      <label for="data">Data:</label>
      <textarea id="data" v-model="data" rows="10" class="data-textarea"></textarea>
    </div>
    <div class="button-group">
      <button @click="acquireViewpoint" class="btn">Acquire Viewpoint</button>
      <button @click="cancel" class="btn cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import '../styles/AcquireViewpoint.css';

export default {
  name: 'AcquireViewpoint',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const source = ref('');
    const data = ref('');

    const submit = () => {
      // Implementazione futura
      console.log('Submit clicked');
    };

    const cancel = () => {
      // Torna alla pagina del progetto
      router.push({ name: 'Project', params: { id: route.params.id } });
    };

    return {
      source,
      data,
      submit,
      cancel
    };
  }
};
</script>