import api from "../api/axios";

/*
Symptom label <-> backend enum mapping
Backend enum: cramps, headache, bloating, fatigue, back_pain,
breast_tenderness, mood_swings, acne, nausea, insomnia, none
*/
export const symptomLabelToEnum = {
  Cramps: "cramps",
  Headache: "headache",
  Bloating: "bloating",
  Fatigue: "fatigue",
  "Back Pain": "back_pain",
  "Breast Tenderness": "breast_tenderness",
  "Mood Swings": "mood_swings",
  Acne: "acne",
  Nausea: "nausea",
  Insomnia: "insomnia",
  None: "none",
};

export const symptomEnumToLabel = Object.fromEntries(
  Object.entries(symptomLabelToEnum).map(([label, val]) => [val, label])
);

/*
Create Cycle
*/
export const createCycle = async (data) => {
  const response = await api.post("/cycles", data);
  return response.data;
};

/*
Get all cycles
*/
export const getCycles = async () => {
  const response = await api.get("/cycles");
  return response.data;
};

/*
Get single cycle
*/
export const getCycle = async (id) => {
  const response = await api.get(`/cycles/${id}`);
  return response.data;
};

/*
Update cycle
*/
export const updateCycle = async (id, data) => {
  const response = await api.put(`/cycles/${id}`, data);
  return response.data;
};

/*
Delete cycle
*/
export const deleteCycle = async (id) => {
  const response = await api.delete(`/cycles/${id}`);
  return response.data;
};

/*
Predictions
*/
export const getPrediction = async () => {
  const response = await api.get("/cycles/prediction");
  return response.data;
};

/*
Dashboard summary
*/
export const getCycleDashboard = async () => {
  const response = await api.get("/cycles/dashboard");
  return response.data;
};
