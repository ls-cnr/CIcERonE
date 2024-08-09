<template>
  <div class="new-project">
    <h2>Create a New Project</h2>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="isLoading" class="loading-message">
      Creating project... Please wait.
      <div class="loading-spinner"></div>
    </div>
    <form @submit.prevent="createProject">
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
        <input v-model="project.apiKey" type="text" id="apiKey" required @input="touchForm" placeholder="Enter API Key">
      </div>
      <div class="button-group">
        <button
          type="submit"
          class="btn create-btn"
          :disabled="!isFormValid || isLoading"
        >
          <span class="material-icons">add_circle</span>
          Create Project
        </button>
        <button @click="cancel" type="button" class="btn cancel-btn" :disabled="isLoading">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'NewProject',
  setup() {
    const router = useRouter();
    const project = reactive({
      title: '',
      description: '',
      chatModelId: null,
      llmModelId: null,
      apiKey: ''
    });
    const config = ref({ chatModels: [] });
    const selectedChatModel = ref(null);
    const isConfigLoaded = ref(false);
    const isLoading = ref(false);
    const error = ref('');
    const isFormTouched = ref(false);

    const availableLLMModels = computed(() => selectedChatModel.value?.llmModels || []);

    const isFormValid = computed(() => {
      const isValid =
        project.title.trim() !== '' &&
        project.description.trim() !== '' &&
        project.chatModelId !== null &&
        project.llmModelId !== null &&
        (!selectedChatModel.value?.requiresAPIKey || project.apiKey.trim() !== '');

      return isValid && isFormTouched.value;
    });

    const touchForm = () => {
      isFormTouched.value = true;
    };

    const updateLLMOptions = () => {
      if (selectedChatModel.value) {
        project.chatModelId = selectedChatModel.value.id;
        const availableLLMs = selectedChatModel.value.llmModels;
        if (availableLLMs.length > 0) {
          project.llmModelId = availableLLMs[0].id;
        } else {
          project.llmModelId = null;
        }
        if (selectedChatModel.value.requiresAPIKey && !project.apiKey) {
          project.apiKey = '';
        } else if (!selectedChatModel.value.requiresAPIKey) {
          project.apiKey = 'NO_KEY';
        }
      }
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

        // Set default chat model
        const defaultChatModel = config.value.chatModels.find(model => model.isDefault);
        if (defaultChatModel) {
          selectedChatModel.value = defaultChatModel;
          updateLLMOptions();
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
        error.value = 'Failed to load configuration. Please try again.';
      }
    };

    const createProject = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;
      error.value = '';

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, {
          title: project.title,
          description: project.description,
          chat_model_id: project.chatModelId,
          llm_model_id: project.llmModelId,
          api_key: project.apiKey
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Project created:', response.data);
        router.push('/dashboard');
      } catch (err) {
        console.error('Error creating project:', err);
        error.value = 'An error occurred while creating the project. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const cancel = () => {
      if (!isLoading.value) {
        router.push('/dashboard');
      }
    };

    onMounted(async () => {
      await fetchConfig();
    });

    return {
      project,
      config,
      selectedChatModel,
      isConfigLoaded,
      isFormValid,
      isLoading,
      error,
      availableLLMModels,
      createProject,
      cancel,
      touchForm,
      updateLLMOptions
    };
  }
};
</script>


<style scoped>
.new-project {
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
input[type="text"] {
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
input[type="text"]:focus {
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

.create-btn {
  background-color: #4CAF50;
  color: white;
}

.create-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.create-btn:disabled {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.material-icons {
  font-size: 1.25rem;
}
</style>