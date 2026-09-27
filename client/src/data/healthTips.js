// Women’s health tips shown on the dashboard.
export const HEALTH_TIPS = [
  "Keep your water bottle close — hydration is always a good idea.",
  "Period day? A warm heating pad can be your best friend.",
  "Track your period — your cycle has a story to tell.",
  "Add a little extra iron to your plate during your period.",
  "A short walk can help you feel lighter on period days.",
  "Listen to your body, rest when it asks for a break.",
  "Keep an eye on cycle changes; small patterns can tell you a lot.",
  "Feeling bloated? Gentle movement and enough water may help.",
  "A balanced breakfast can make busy mornings easier.",
  "Add some colorful fruits and veggies to your plate today.",
  "Your cycle doesn't have to match anyone else's, every body is different.",
  "Sleep well tonight; your body does plenty of work while you rest.",
  "Keep your period products clean, fresh, and comfortable.",
  "Feeling stressed? Take a few slow breaths and reset.",
  "Make time for yourself today, even if it's just 10 minutes.",
  "Protein on your plate? Your body will thank you.",
  "Small healthy habits add up — you don't have to change everything at once.",
  "Notice unusual cycle changes instead of brushing them off.",
  "Keep a note of symptoms you want to mention at your next appointment.",
  "A little sunshine and a little movement can brighten your day.",
  "Don't ignore persistent pelvic pain — your body deserves attention.",
  "Your period may change sometimes; look for patterns, not perfection.",
  "Stay hydrated, especially on hot days or during exercise.",
  "Crampy day? Gentle stretching might help you feel more comfortable.",
  "Give your body the rest it needs, rest is productive too.",
  "Choose nourishing snacks when your energy starts to dip.",
  "Your health isn't a competition, go at your own pace.",
  "Keep your gynecological checkups on your calendar.",
  "Ask questions at your doctor's appointment, understanding matters.",
  "If something feels unusual, it's okay to get it checked.",
  "Be kind to yourself on the days your body feels a little off.",
  "A healthy routine doesn't need to be perfect to be helpful.",
  "Take a screen break, stretch, breathe, and carry on.",
  "Good sleep is self-care too, protect your bedtime.",
  "Keep track of your cycle, symptoms, and how you feel.",
  "Your body gives signals,  learning to notice them is a strength.",
  "Eat well, sleep well, move a little — simple things matter.",
  "Having a busy day? Don't forget to eat and drink water.",
  "Make your next meal colorful, your body loves variety.",
  "A few minutes of movement is still movement.",
  "Give yourself permission to slow down when you need it.",
  "Your cycle is personal, there is no 'perfect' period.",
  "Take care of your future self with one healthy choice today.",
  "Feeling tired lately? Check in with your sleep, meals, and hydration.",
  "Keep important health records somewhere easy to find.",
  "Your health deserves attention, not just when something goes wrong.",
  "One small healthy choice today is still a win.",
];

const getDayOfYear = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return Math.floor((startOfDay - startOfYear) / 86400000);
};

export const getTipOfTheDay = (date = new Date()) => {
  if (!HEALTH_TIPS.length) {
    return "Take care of your health with small, consistent habits each day.";
  }

  const dayIndex = getDayOfYear(date) % HEALTH_TIPS.length;
  return HEALTH_TIPS[dayIndex];
};

export const getTipDateLabel = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });