// General health tips shown on the dashboard.
// The dashboard selects one tip based on the current calendar day,
// so the same tip stays visible for the whole day and changes tomorrow.

export const HEALTH_TIPS = [
  "Drink water regularly throughout the day and keep a bottle nearby.",
  "Aim for a consistent sleep schedule and try to get enough restful sleep.",
  "Include a variety of fruits and vegetables in your meals each day.",
  "Choose whole grains and fiber-rich foods when possible.",
  "Take short movement breaks if you spend a lot of time sitting.",
  "A gentle daily walk can be an easy way to stay active.",
  "Do not skip meals regularly; balanced meals can help maintain energy.",
  "Wash your hands regularly, especially before eating and after using the restroom.",
  "Limit sugary drinks and make water your main everyday drink.",
  "Eat slowly and pay attention to hunger and fullness signals.",
  "Keep a simple record of symptoms or changes that you want to discuss with a doctor.",
  "Include a source of protein in your meals to support a balanced diet.",
  "Try a few minutes of deep, slow breathing when you need to relax.",
  "Spend a little time outdoors during the day when the weather is comfortable.",
  "Keep commonly used personal health records organized and easy to find.",
  "Use sunscreen and protective clothing when spending time in strong sunlight.",
  "Add calcium-rich foods such as dairy or fortified alternatives to a balanced diet.",
  "Choose nuts, seeds, or other nutrient-dense snacks instead of heavily processed snacks when possible.",
  "Keep caffeine moderate, especially later in the day if it affects your sleep.",
  "Clean reusable water bottles regularly to keep them fresh and hygienic.",
  "Make time for hobbies, social connection, or other activities that help you unwind.",
  "Stretch gently after long periods of sitting or staying in one position.",
  "Read food labels when you want to compare added sugar, sodium, or serving sizes.",
  "Try to keep regular meal and sleep routines rather than making large daily changes.",
  "Prepare a few healthy meal or snack options ahead of time to make busy days easier.",
  "Avoid smoking and secondhand smoke whenever possible.",
  "If you drink alcohol, keep consumption within your local health guidance and avoid binge drinking.",
  "Pay attention to persistent or unusual symptoms and discuss them with a qualified healthcare professional.",
  "Use good posture and adjust your screen height when working at a desk for long periods.",
  "Keep physical activity enjoyable by choosing movement that fits your routine and ability.",
  "Make one small healthy change at a time; consistency is often easier than trying to change everything at once.",
  "Keep a regular dental-care routine, including brushing twice a day and cleaning between teeth.",
  "Make time to rest when your body is tired instead of constantly pushing through fatigue.",
  "Keep your living and working spaces reasonably clean and well ventilated.",
  "Check medicine labels and follow the directions provided by your doctor or pharmacist.",
  "Do not share prescription medicines with other people, even when symptoms seem similar.",
  "Keep emergency and important healthcare contact information somewhere accessible.",
  "Build a balanced plate with vegetables or fruit, protein, and a source of whole-grain carbohydrates.",
  "Choose fresh or minimally processed foods more often when practical.",
  "Practice regular hand and personal hygiene, especially during illness seasons.",
  "Give your eyes regular breaks during long screen sessions by looking away into the distance.",
  "Keep your bedroom comfortable, quiet, and dark when preparing for sleep.",
  "Try to get some regular physical activity each week that matches your fitness level.",
  "Do not ignore severe, sudden, or worsening symptoms; seek appropriate medical care promptly.",
  "Use a reusable shopping list or meal plan to make healthier food choices easier.",
  "Keep track of important appointments, screenings, and vaccinations.",
  "Avoid very restrictive diets unless they are medically advised and supervised.",
  "Include healthy fats such as nuts, seeds, fish, or suitable plant oils in a balanced diet.",
  "Take your time when eating and avoid rushing through every meal.",
  "Keep up with routine health checkups appropriate for your age and health needs.",
  "Be kind to yourself when routines are difficult; returning to healthy habits matters more than perfection.",
  "Use reliable healthcare sources and qualified professionals when checking health information online.",
  "Keep a small self-care routine you can realistically follow even on busy days.",
  "Stay hydrated during exercise and in hot weather, and pay attention to signs of dehydration.",
  "Wash fresh produce before eating and store food safely.",
  "Try reducing screen use shortly before bedtime if it makes falling asleep harder.",
  "Make your health goals specific and manageable so they are easier to maintain.",
  "Notice what makes you feel energized, rested, or stressed and adjust your routine where practical.",
  "Ask questions during medical appointments so you understand your diagnosis, treatment, and next steps.",
  "Keep a consistent routine for any prescribed medicines and follow your healthcare professional's instructions.",
  "Celebrate small, healthy habits instead of focusing only on big changes.",
];

const getDayOfYear = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((startOfDay - startOfYear) / 86400000);
};

export const getTipOfTheDay = (date = new Date()) => {
  if (!HEALTH_TIPS.length) return "Take care of yourself with small, healthy habits each day.";

  const dayIndex = getDayOfYear(date) % HEALTH_TIPS.length;
  return HEALTH_TIPS[dayIndex];
};

export const getTipDateLabel = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
