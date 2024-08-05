<template>
  <div class="acquire-viewpoint">
    <h2>Acquire Viewpoint</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="isLoading" class="loading-message">
      Acquiring viewpoint... This may take a few minutes.
      <div class="loading-spinner"></div>
    </div>
    <div class="form-group">
      <label for="source">Source:</label>
      <textarea
        id="source"
        v-model="source"
        rows="1"
        class="source-textarea"
        required
        @input="checkFields"
      ></textarea>
    </div>
    <div class="form-group">
      <label for="data">Data:</label>
      <textarea
        id="data"
        v-model="data"
        rows="10"
        class="data-textarea"
        required
        @input="checkFields"
      ></textarea>
    </div>
    <div class="button-group">
      <button
        @click="acquireViewpoint"
        class="btn acquire-btn"
        :disabled="!isFormValid || isLoading"
      >
        Acquire Viewpoint
      </button>
      <button @click="cancel" class="btn cancel-btn" :disabled="isLoading">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import '../styles/AcquireViewpoint.css';

export default {
  name: 'AcquireViewpoint',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const source = ref('');
    const data = ref('');
    const isFormValid = ref(false);
    const isLoading = ref(false);
    const error = ref('');

    const checkFields = () => {
      isFormValid.value = source.value.trim() !== '' && data.value.trim() !== '';
    };

    const acquireViewpoint = async () => {
      isLoading.value = true;
      error.value = '';

      try {
        const projectId = route.params.id;
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/${projectId}/update-mental-space`, {
          source: source.value,
          interview: data.value
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          router.push({ name: 'Project', params: { id: projectId } });
        } else {
          throw new Error(response.data.error || 'Failed to update mental space');
        }
      } catch (err) {
        console.error('Error acquiring viewpoint:', err);
        if (err.response) {
          // Errore di risposta dal server
          error.value = err.response.data.error || 'An error occurred while acquiring the viewpoint.';
        } else if (err.request) {
          // Errore di rete
          error.value = 'Unable to connect to the server. Please check your network connection.';
        } else {
          // Altro tipo di errore
          error.value = err.message || 'An unexpected error occurred.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    const cancel = () => {
      if (!isLoading.value) {
        router.push({ name: 'Project', params: { id: route.params.id } });
      }
    };

    return {
      source,
      data,
      isFormValid,
      isLoading,
      error,
      checkFields,
      acquireViewpoint,
      cancel
    };
  }
};
</script>