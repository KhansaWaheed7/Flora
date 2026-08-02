import api from "../api/axios";

/*
IMPORTANT: server/src/utils/ApiResponse.js has the signature
  constructor(statusCode, message, data)
But pcos.controller.js calls it backwards everywhere:
  new ApiResponse(201, { assessment }, "some message string")
This means the real payload object ends up in response.data.message,
NOT response.data.data. Backend is not being changed (model is being
trained), so every function below unwraps from `.message` on purpose.
This does NOT apply to other modules (e.g. cycles) - only PCOS.
*/

/*
Submit a new PCOS assessment
POST /pcos
Returns: { assessment }  (from response.message.assessment)
*/
export const submitAssessment = async (answers) => {
  const response = await api.post("/pcos", answers);
  return response.data.message?.assessment;
};

/*
Get most recent assessment
GET /pcos
Returns: { assessment }  (from response.message.assessment)
*/
export const getLatestAssessment = async () => {
  const response = await api.get("/pcos");
  return response.data.message?.assessment;
};

/*
Get all past assessments
GET /pcos/history
Returns: { history }  (from response.message.history)
There is no GET /pcos/:id route on the backend, so single-assessment
views are handled by fetching this full list and finding the match
client-side (see PCOSDetails.jsx).
*/
export const getAssessmentHistory = async () => {
  const response = await api.get("/pcos/history");
  return response.data.message?.history || [];
};

/*
Get PCOS dashboard summary
GET /pcos/dashboard
Returns the dashboard object directly (from response.message)
*/
export const getDashboard = async () => {
  const response = await api.get("/pcos/dashboard");
  return response.data.message;
};

/*
Delete an assessment
DELETE /pcos/:id
*/
export const deleteAssessment = async (id) => {
  const response = await api.delete(`/pcos/${id}`);
  return response.data;
};
