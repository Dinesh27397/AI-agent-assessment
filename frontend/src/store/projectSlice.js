import { createSlice } from "@reduxjs/toolkit";

const SAMPLE_MODE_KEY = "triageiq.sampleMode";
const SAMPLE_PROJECT_KEY = "triageiq.sampleProjectKey";

function getStoredSampleMode() {
  try {
    if (new URLSearchParams(window.location.search).has("token")) {
      sessionStorage.removeItem(SAMPLE_MODE_KEY);
      return false;
    }

    return sessionStorage.getItem(SAMPLE_MODE_KEY) === "true";
  } catch (error) {
    console.error("Failed to read sample mode from storage.", error);
    return false;
  }
}

function persistSampleMode(sampleMode) {
  try {
    if (sampleMode) {
      sessionStorage.setItem(SAMPLE_MODE_KEY, "true");
    } else {
      sessionStorage.removeItem(SAMPLE_MODE_KEY);
    }
  } catch (error) {
    console.error("Failed to persist sample mode to storage.", error);
  }
}

function getStoredProjectKey(sampleMode) {
  try {
    return sampleMode
      ? sessionStorage.getItem(SAMPLE_PROJECT_KEY)
      : localStorage.getItem("projectKey");
  } catch (error) {
    console.error("Failed to read projectKey from storage.", error);
    return null;
  }
}

function persistProjectKey(projectKey, sampleMode) {
  try {
    const storage = sampleMode ? sessionStorage : localStorage;
    const key = sampleMode ? SAMPLE_PROJECT_KEY : "projectKey";

    if (projectKey) {
      storage.setItem(key, projectKey);
      return;
    }

    storage.removeItem(key);
  } catch (error) {
    console.error("Failed to persist projectKey to storage.", error);
  }
}

const initialSampleMode = getStoredSampleMode();

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projectKey: getStoredProjectKey(initialSampleMode),
    selectionVersion: 0,
    sampleMode: initialSampleMode,
  },
  reducers: {
    setProjectKey(state, action) {
      state.projectKey = action.payload || null;
      state.selectionVersion += 1;
      persistProjectKey(state.projectKey, state.sampleMode);
    },
    clearProjectKey(state) {
      state.projectKey = null;
      state.selectionVersion += 1;
      persistProjectKey(null, state.sampleMode);
    },
    setSampleMode(state, action) {
      if (state.sampleMode === action.payload) return;

      state.sampleMode = action.payload;
      state.projectKey = getStoredProjectKey(state.sampleMode);
      state.selectionVersion += 1;
      persistSampleMode(state.sampleMode);
    },
  },
});

export const { setProjectKey, clearProjectKey, setSampleMode } = projectSlice.actions;
export default projectSlice.reducer;
