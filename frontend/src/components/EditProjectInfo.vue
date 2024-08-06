<template>
  <div class="edit-project-info">
    <h2>Edit Project Information</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="isLoading" class="loading-message">
      Updating project... Please wait.
      <div class="loading-spinner"></div>
    </div>
    <form @submit.prevent="updateProject">
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="project.title"
          type="text"
          class="title-input"
          required
          @input="checkFields"
          placeholder="Enter project title"
        />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="project.description"
          class="description-input"
          required
          @input="checkFields"
          placeholder="Enter project description"
        ></textarea>
      </div>
      <div class="button-group">
        <button
          type="submit"
          class="btn update-btn"
          :disabled="!isFormValid || isLoading"
        >
          <span class="material-icons">save</span>
          Update Project
        </button>
        <button @click="cancel" type="button" class="btn cancel-btn" :disabled="isLoading">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'EditProjectInfo',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const project = reactive({ title: '', description: '' });
    const isFormValid = ref(false);
    const isLoading = ref(false);
    const error = ref('');

    const checkFields = () => {
      isFormValid.value = project.title.trim() !== '' && project.description.trim() !== '';
    };

    const updateProject = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      error.value = '';

      try {
        const token = localStorage.getItem('token');
        await axios.put(`${import.meta.env.VITE_API_URL}/projects/${route.params.id}`, project, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        router.push(`/project/${route.params.id}`);
      } catch (err) {
        console.error('Error updating project:', err);
        error.value = 'An error occurred while updating the project. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const cancel = () => {
      if (!isLoading.value) {
        router.push(`/project/${route.params.id}`);
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        Object.assign(project, response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
        router.push('/dashboard');
      }
    };

    onMounted(fetchProjectDetails);

    return {
      project,
      isFormValid,
      isLoading,
      error,
      checkFields,
      updateProject,
      cancel
    };
  }
};
</script>

<style scoped>
.edit-project-info {
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

.title-input,
.description-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.title-input:focus,
.description-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.description-input {
  min-height: 150px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.update-btn {
  background-color: #4CAF50;
  color: white;
}

.update-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.update-btn:disabled {
  background-color: #cccccc;
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
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
}

.loading-message {
  margin-bottom: 1rem;
  font-style: italic;
  color: #666;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>