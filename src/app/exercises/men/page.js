"use client";

import ExerciseShowcase from "../../components/ExerciseShowcase";

const MEN_GUIDES = [
  {
    title: "Chest Intermediate Workout",
    badge: "Free Preview • Upper Push",
    level: "4 Exercises • 45 Mins",
    image: "/images/exercises/men-chest.jpg",
    locked: false,
    summary:
      "Target upper, mid, and lower pectoral fibers with compound barbell pressing and controlled cable isolation.",
    highlights: [
      "Bench Press — 4 Sets x 8-10 Reps",
      "Incline Dumbbell Press — 4 Sets x 10 Reps",
      "Chest Dips — 3 Sets x 10-12 Reps",
      "Cable Flyes — 3 Sets x 12 Reps",
    ],
  },
  {
    title: "Legs Intermediate Workout",
    badge: "Free Preview • Lower Power",
    level: "4 Exercises • 50 Mins",
    image: "/images/exercises/men-legs.jpg",
    locked: false,
    summary:
      "Build quad sweep, hamstring thickness, and functional athletic power with balanced knee- and hip-dominant lifts.",
    highlights: [
      "Squats — 4 Sets x 8-10 Reps",
      "Leg Press — 4 Sets x 12 Reps",
      "Romanian Deadlifts — 3 Sets x 10 Reps",
      "Walking Lunges — 3 Sets x 12 Reps (Each Leg)",
    ],
  },
  {
    title: "Back Intermediate Workout",
    badge: "Personalised Access",
    level: "4 Exercises • Locked",
    image: "/images/exercises/men-back.jpg",
    locked: true,
    summary:
      "Unlock Coach James's complete lat width & mid-back thickness protocol with exact elbow-path coaching cues.",
    highlights: [
      "Pull-Ups & Lat Pulldowns Breakdown",
      "Barbell & Seated Cable Row Tempo",
      "Extra Personalised Form Feedback",
    ],
  },
  {
    title: "Full 5-Split Complete Chart",
    badge: "Personalised Access",
    level: "Arms • Chest • Legs • Back • Shoulders",
    image: "/images/exercises/men-full-split.jpg",
    locked: true,
    summary:
      "Get the full 5-day muscle split chart plus extra personalised training tailored to your body, schedule, and goals.",
    highlights: [
      "All 5 Muscle Groups in One Blueprint",
      "Weekly Progressive Overload Targets",
      "1-on-1 Coaching & Custom Meal Plan",
    ],
  },
];

const MEN_BENEFITS = [
  {
    icon: "dumbbell",
    title: "Lean Muscle Hypertrophy",
    description:
      "Structured 8-12 rep ranges maximize mechanical tension and muscle fiber recruitment for dense, athletic mass.",
  },
  {
    icon: "flame",
    title: "Higher Metabolic Burn",
    description:
      "Heavy compound movements like squats and bench presses boost resting metabolic rate and support fat loss.",
  },
  {
    icon: "shield",
    title: "Joint & Core Stability",
    description:
      "Balanced push, hinge, and lunge patterns strengthen stabilizers and protect knees, hips, and shoulders.",
  },
  {
    icon: "sparkles",
    title: "Clear Progression",
    description:
      "Simple set-and-rep targets make progressive overload easy to track week after week without guesswork.",
  },
];

export default function MenExercisesPage() {
  return (
    <ExerciseShowcase
      audience="men"
      eyebrow="World Fitness Zone • For Men"
      titleLead="Men's"
      titleOutline="Exercises"
      subtitle="Preview 2 free watermarked workout charts below. Unlock the blurred Back & Full 5-Split blueprints with extra personalised training from Coach James."
      guides={MEN_GUIDES}
      benefitsTitle="Key Benefits For Men"
      benefits={MEN_BENEFITS}
      ctaTitle="Get Personalised Access With"
      ctaHighlight="Extra Personalised Training"
      ctaDescription="Ready to unlock all 4+ muscle splits, custom weekly programming, form correction, and your 13-week transformation meal plan? Enroll with Coach James today."
    />
  );
}
