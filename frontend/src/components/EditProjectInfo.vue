<template>
  <div class="edit-project-info">
    <h2>Edit Project Information</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="isLoading" class="loading-message">
      Loading project information... Please wait.
      <div class="loading-spinner"></div>
    </div>
    <form v-else @submit.prevent="updateProject">
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="project.title"
          type="text"
          class="title-input"
          required
          @input="touchForm"
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
          @input="touchForm"
          placeholder="Enter project description"
        ></textarea>
      </div>
      <div v-if="isConfigLoaded" class="form-group">
        <label for="chatModel">Chat Model:</label>
        <select v-model="selectedChatModel" @change="updateLLMOptions" id="chatModel" required>
          <option v-for="model in config.chatModels" :key="model.id" :value="model">
            {{ model.name }}
          </option>
        </select>
      </div>
      <div v-if="isConfigLoaded" class="form-group">
        <label for="llmModel">LLM Model:</label>
        <select v-model="project.llmModelId" id="llmModel" required @change="touchForm">
          <option v-for="model in availableLLMModels" :key="model.id" :value="model.id">
            {{ model.name }}
          </option>
        </select>
      </div>
      <div v-if="selectedChatModel && selectedChatModel.requiresAPIKey" class="form-group">
        <label for="apiKey">API Key:</label>
        <input v-model="project.apiKey" type="password" id="apiKey" required @input="touchForm" placeholder="Enter API Key">
      </div>
      <div class="button-group">
        <button
          type="submit"
          class="btn update-btn"
          :disabled="!isFormValid || isLoading"
        >
          <span class="material-icons">save</span>
          Update Project Info
        </button>
        <button @click="cancel" type="button" class="btn cancel-btn" :disabled="isLoading">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'EditProjectInfo',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const project = reactive({
      title: '',
      description: '',
      chatModelId: null,
      llmModelId: null,
      apiKey: ''
    });
    const originalProject = ref(null);
    const config = ref({ chatModels: [] });
    const selectedChatModel = ref(null);
    const isConfigLoaded = ref(false);
    const isProjectLoaded = ref(false);
    const isLoading = ref(true);
    const error = ref('');
    const isFormTouched = ref(false);

    const availableLLMModels = computed(() => selectedChatModel.value?.llmModels || []);

    const isFormValid = computed(() => {
      if (!isConfigLoaded.value || !isProjectLoaded.value) return false;

      const isValid =
        project.title.trim() !== '' &&
        project.description.trim() !== '' &&
        project.chatModelId !== null &&
        project.llmModelId !== null &&
        (!selectedChatModel.value?.requiresAPIKey || project.apiKey.trim() !== '');

      const hasChanges = JSON.stringify({
        title: project.title,
        description: project.description,
        chatModelId: project.chatModelId,
        llmModelId: project.llmModelId,
        apiKey: project.apiKey
      }) !== JSON.stringify({
        title: originalProject.value.title,
        description: originalProject.value.description,
        chatModelId: originalProject.value.chat_model_id,
        llmModelId: originalProject.value.llm_model_id,
        apiKey: originalProject.value.api_key
      });

      console.log('Form validation:', { isValid, isFormTouched: isFormTouched.value, hasChanges });
      console.log('Current project:', JSON.stringify(project));
      console.log('Original project:', JSON.stringify(originalProject.value));

      return (isValid && isFormTouched.value) || hasChanges;
    });

    const touchForm = () => {
      isFormTouched.value = true;
      console.log('Form touched');
    };

    const updateLLMOptions = () => {
      if (selectedChatModel.value) {
        project.chatModelId = selectedChatModel.value.id;
        const availableLLMs = selectedChatModel.value.llmModels;
        if (availableLLMs.length > 0) {
          if (!availableLLMs.some(model => model.id === project.llmModelId)) {
            project.llmModelId = availableLLMs[0].id;
          }
        } else {
          project.llmModelId = null;
        }
        if (selectedChatModel.value.requiresAPIKey && !project.apiKey) {
          project.apiKey = '';
        } else if (!selectedChatModel.value.requiresAPIKey) {
          project.apiKey = 'NO_KEY';
        }
      }
      console.log('LLM options updated:', JSON.stringify(project));
      touchForm();
    };

    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat-llm-models`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        config.value = response.data;
        isConfigLoaded.value = true;
        console.log('Config loaded:', JSON.stringify(config.value));
        if (isProjectLoaded.value) {
          syncProjectWithConfig();
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
        error.value = 'Failed to load configuration. Please try again.';
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const projectId = route.params.id;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Project details received:', JSON.stringify(response.data));

        // Mappiamo i campi del database ai nomi dei campi usati nel frontend
        project.title = response.data.title;
        project.description = response.data.description;
        project.chatModelId = response.data.chat_model_id;
        project.llmModelId = response.data.llm_model_id;
        project.apiKey = response.data.api_key;

        // Salviamo l'originale esattamente come ricevuto dal server
        originalProject.value = JSON.parse(JSON.stringify(response.data));
        isProjectLoaded.value = true;

        console.log('Project after assignment:', JSON.stringify(project));
        console.log('Original project:', JSON.stringify(originalProject.value));

        if (isConfigLoaded.value) {
          syncProjectWithConfig();
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        error.value = 'Failed to load project details. Please try again.';
      }
    };

    const syncProjectWithConfig = () => {
      if (config.value.chatModels && project.chatModelId) {
        selectedChatModel.value = config.value.chatModels.find(model => model.id === project.chatModelId);
        if (selectedChatModel.value) {
          updateLLMOptions();
        } else {
          console.log('Invalid chatModelId, setting default');
          selectedChatModel.value = config.value.chatModels.find(model => model.isDefault) || config.value.chatModels[0];
          updateLLMOptions();
        }
      }
      console.log('Project after sync:', JSON.stringify(project));
    };

    const updateProject = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      error.value = '';

      try {
        const token = localStorage.getItem('token');
        const updateData = {
          title: project.title,
          description: project.description,
          chat_model_id: project.chatModelId,
          llm_model_id: project.llmModelId,
          api_key: project.apiKey
        };
        await axios.put(`${import.meta.env.VITE_API_URL}/projects/${route.params.id}`, updateData, {
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

    onMounted(async () => {
      try {
        await Promise.all([fetchConfig(), fetchProjectDetails()]);
        isFormTouched.value = false; // Reset touch state after initial load
        console.log('Component mounted, form touched reset');
      } catch (error) {
        console.error('Error during component initialization:', error);
        error.value = 'Failed to initialize the component. Please try refreshing the page.';
      } finally {
        isLoading.value = false;
      }
    });

    watch(selectedChatModel, () => {
      updateLLMOptions();
    });

    return {
      project,
      config,
      selectedChatModel,
      isConfigLoaded,
      isProjectLoaded,
      isFormValid,
      isLoading,
      error,
      availableLLMModels,
      updateProject,
      cancel,
      touchForm
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
.description-input,
select,
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.title-input:focus,
.description-input:focus,
select:focus,
input[type="password"]:focus {
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
  text-align: center;
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