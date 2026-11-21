"use client";

import ExerciseShowcase from "../../components/ExerciseShowcase";

const WOMEN_GUIDES = [
  {
    title: "Arms — Biceps & Triceps",
    badge: "Free Preview • Sculpt & Tone",
    level: "3 Exercises • 35 Mins",
    image: "/images/exercises/women-arms.jpg",
    locked: false,
    summary:
      "Shape and tighten your biceps and triceps with controlled form, full range of motion, and zero guesswork.",
    highlights: [
      "Bicep Curls — 3 Sets x 8-12 Reps",
      "Tricep Pushdown — 3 Sets x 10-12 Reps",
      "Overhead Tricep Extension — 3 Sets x 10-12 Reps",
    ],
  },
  {
    title: "Back & Shoulders Workout",
    badge: "Free Preview • Posture & Definition",
    level: "8 Exercises • 50 Mins",
    image: "/images/exercises/women-back-shoulders.jpg",
    locked: false,
    summary:
      "Build a strong, defined back and sculpted front, side, and rear delts for confident everyday posture.",
    highlights: [
      "Pull-Ups & Lat Pulldowns — 3 Sets x 8-12 Reps",
      "Barbell & One Arm Dumbbell Row — 3 Sets x 10-12 Reps",
      "Overhead Press & Lateral Raises — 3 Sets x 8-15 Reps",
      "Front Raises & Rear Delt Fly — 3 Sets x 10-15 Reps",
    ],
  },
  {
    title: "Legs & Chest Power Plan",
    badge: "Personalised Access",
    level: "8 Exercises • Locked",
    image: "/images/exercises/women-legs-chest.jpg",
    locked: true,
    summary:
      "Unlock Coach James's lower-body & upper-chest sculpting chart with Squats, Leg Press, Bench Press & Dumbbell Fly.",
    highlights: [
      "Squats, Leg Press, Lunges & Hamstring Curls",
      "Bench Press, Incline Press & Push-Ups",
      "Extra Personalised Form Feedback",
    ],
  },
  {
    title: "Glutes & Core Full Blueprint",
    badge: "Personalised Access",
    level: "Full Weekly Split • Locked",
    image: "/images/exercises/women-glutes-legs.jpg",
    locked: true,
    summary:
      "Get the complete weekly women's glute & core training split plus extra personalised training and custom nutrition.",
    highlights: [
      "Complete 4-Day & 5-Day Female Splits",
      "Glute Activation & Tempo Progression",
      "1-on-1 Coaching & Custom Meal Plan",
    ],
  },
];

const WOMEN_BENEFITS = [
  {
    icon: "sparkles",
    title: "Toned, Sculpted Physique",
    description:
      "Controlled resistance training shapes lean muscle and curves without adding unwanted bulk.",
  },
  {
    icon: "flame",
    title: "Sustainable Fat Loss",
    description:
      "Building lean muscle raises daily calorie burn so you stay leaner without endless exhausting cardio.",
  },
  {
    icon: "shield",
    title: "Stronger Core & Posture",
    description:
      "Targeted back, shoulder, and core work relieves desk stiffness and builds confident upright posture.",
  },
  {
    icon: "dumbbell",
    title: "Confidence & Energy",
    description:
      "Measurable strength gains improve bone density, hormone balance, and daily energy levels.",
  },
];

export default function WomenExercisesPage() {
  return (
    <ExerciseShowcase
      audience="women"
      eyebrow="World Fitness Zone • For Women"
      titleLead="Women's"
      titleOutline="Exercises"
      subtitle="Preview 2 free watermarked workout charts below. Unlock the blurred Glutes & Legs and Full Upper & Core blueprints with extra personalised training from Coach James."
      guides={WOMEN_GUIDES}
      benefitsTitle="Key Benefits For Women"
      benefits={WOMEN_BENEFITS}
      ctaTitle="Get Personalised Access With"
      ctaHighlight="Extra Personalised Training"
      ctaDescription="Want full access to every female workout chart, custom glute & core splits, and our 13-week system (Week 1 preparation + 12 weeks of momentum, hard work, and mental & physical discipline)? Enroll with Coach James today."
    />
  );
}
