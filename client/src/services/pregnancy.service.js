import api from "../api/axios";

/*
IMPORTANT — backend bug (flagged, not yet fixed as of this writing):
cycle.controller.js uses `new ApiResponse(statusCode, message, data)`.
pregnancy.controller.js and pregnancyReminder.controller.js are INCONSISTENT —
createPregnancy uses the correct (statusCode, message, data) order, but
getPregnancy / updatePregnancy / endPregnancy / getPregnancyDashboard /
getReminders / completeReminder / getUpcomingReminder all use the swapped
(statusCode, data, message) order instead.

Until that's fixed backend-side, `unwrap()` below defensively picks whichever
of response.data / response.message is actually an object (the real payload),
regardless of which slot it landed in — so the frontend works either way and
won't break again once the backend bug gets fixed to the correct order.
*/
function unwrap(response) {
  if (response?.data && typeof response.data === "object") return response.data;
  if (response?.message && typeof response.message === "object")
    return response.message;
  return response;
}

/*
Create a new pregnancy record from LMP date.
Real response payload: { pregnancy: { _id, user, lastPeriodDate, dueDate, currentWeek, trimester, isActive } }
*/
export const createPregnancy = async (lastPeriodDate) => {
  const response = await api.post("/pregnancy", { lastPeriodDate });
  return unwrap(response.data);
};

/*
Get the current active pregnancy (or null if none).
*/
export const getPregnancy = async () => {
  const response = await api.get("/pregnancy");
  return unwrap(response.data);
};

/*
Dashboard summary.
Real response payload: {
  pregnancy: { currentWeek, trimester, dueDate },
  progress,        // number, likely 0-100
  weeksRemaining,  // number
  weekInfo,        // PregnancyWeek doc (nearest week <= currentWeek) or null
  upcomingReminder,// PregnancyReminder doc or null
}
*/
export const getPregnancyDashboard = async () => {
  const response = await api.get("/pregnancy/dashboard");
  return unwrap(response.data);
};

/*
Update LMP date (recalculates dueDate/currentWeek/trimester server-side).
*/
export const updatePregnancy = async (lastPeriodDate) => {
  const response = await api.put("/pregnancy", { lastPeriodDate });
  return unwrap(response.data);
};

/*
End the current pregnancy (soft — isActive: false).
*/
export const endPregnancy = async () => {
  const response = await api.delete("/pregnancy");
  return unwrap(response.data);
};

/*
All reminders for the active pregnancy, sorted by week.
Real fields per reminder: { _id, pregnancy, week, title, completed, completedAt, createdAt }
NOTE: no description/date field exists on the model — only `week` and `title`.
*/
export const getReminders = async () => {
  const response = await api.get("/pregnancy/reminders");
  return unwrap(response.data);
};

/*
Mark a reminder completed.
*/
export const completeReminder = async (id) => {
  const response = await api.patch(`/pregnancy/reminders/${id}`);
  return unwrap(response.data);
};

/*
Next pending reminder (week >= currentWeek, not completed).
*/
export const getUpcomingReminder = async () => {
  const response = await api.get("/pregnancy/upcoming");
  return unwrap(response.data);
};

/*
GAP — NOT CONFIRMED: no backend route exists yet for fetching a specific
week's PregnancyWeek info on demand (only the current week comes bundled
in the dashboard response as `weekInfo`). This is left unimplemented on
purpose rather than guessed — Weekly Guide only renders real data for the
current week until a route like GET /pregnancy-weeks/:week exists.
*/

/*
Approximate a calendar date for a given pregnancy week, since
PregnancyReminder has no stored date — only `week`.
*/
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
