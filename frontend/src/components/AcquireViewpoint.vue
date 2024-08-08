<template>
  <div class="acquire-viewpoint">
    <h2>Acquire Viewpoint</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="isLoading" class="loading-message">
      Updating the Mental Space Lattice... This may take a few minutes.
      <div class="loading-spinner"></div>
    </div>
    <div class="form-group">
      <label for="source">Source:</label>
      <input
        id="source"
        v-model="source"
        type="text"
        class="input-field"
        required
        @input="checkFields"
        placeholder="Enter the source of the viewpoint"
      />
    </div>
    <div class="form-group">
      <label for="data">Data:</label>
      <textarea
        id="data"
        v-model="data"
        rows="10"
        class="input-field"
        required
        @input="checkFields"
        placeholder="Enter the data for the viewpoint"
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
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

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
          error.value = err.response.data.error || 'An error occurred while acquiring the viewpoint.';
        } else if (err.request) {
          error.value = 'Unable to connect to the server. Please check your network connection.';
        } else {
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

<style scoped>
.acquire-viewpoint {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

textarea.input-field {
  min-height: 150px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.acquire-btn {
  background-color: #4CAF50;
  color: white;
}

.acquire-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.acquire-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.error-message {
  color: #f44336;
  background-color: #ffebee;
  border: 1px solid #ffcccc;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.loading-message {
  margin-bottom: 15px;
  font-style: italic;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>