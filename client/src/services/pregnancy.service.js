import api from "../api/axios";


function unwrap(response) {
  if (response?.data && typeof response.data === "object") return response.data;
  if (response?.message && typeof response.message === "object")
    return response.message;
  return response;
}


export const createPregnancy = async (lastPeriodDate) => {
  const response = await api.post("/pregnancy", { lastPeriodDate });
  return unwrap(response.data);
};


export const getPregnancy = async () => {
  const response = await api.get("/pregnancy");
  return unwrap(response.data);
};


export const getPregnancyDashboard = async () => {
  const response = await api.get("/pregnancy/dashboard");
  return unwrap(response.data);
};


export const updatePregnancy = async (lastPeriodDate) => {
  const response = await api.put("/pregnancy", { lastPeriodDate });
  return unwrap(response.data);
};

export const endPregnancy = async () => {
  const response = await api.delete("/pregnancy");
  return unwrap(response.data);
};


export const getReminders = async () => {
  const response = await api.get("/pregnancy/reminders");
  return unwrap(response.data);
};


export const completeReminder = async (id) => {
  const response = await api.patch(`/pregnancy/reminders/${id}`);
  return unwrap(response.data);
};


export const getUpcomingReminder = async () => {
  const response = await api.get("/pregnancy/upcoming");
  return unwrap(response.data);
};


export function dateForWeek(lastPeriodDate, week) {
  if (!lastPeriodDate || !week) return null;
  const d = new Date(lastPeriodDate);
  d.setDate(d.getDate() + week * 7);
  return d;
}

export function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const trimesterLabel = { 1: "1st Trimester", 2: "2nd Trimester", 3: "3rd Trimester" };
