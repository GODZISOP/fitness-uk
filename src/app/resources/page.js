"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Utensils, 
  Video, 
  Calendar, 
  Clock, 
  Flame, 
  Dumbbell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Sparkles, 
  User, 
  Droplet, 
  Check,
  MessageSquare,
  Send,
  Image as ImageIcon,
  CheckCheck,
  Scale,
  Printer,
  CheckSquare,
  Square,
  LayoutGrid,
  ListFilter,
  ArrowRight,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import './resources.css';

const LOCAL_CLIENTS_KEY = 'wfz_local_clients';
const LOCAL_RESOURCES_KEY = 'wfz_local_resources';
const LOCAL_MESSAGES_KEY = 'wfz_client_messages';
const LOCAL_WEIGHINS_KEY = 'wfz_client_weighins';

// Demo Client 1: Marcus T.
const defaultDemoClient = {
  id: "demo-client-1",
  name: "Marcus T.",
  pin_code: "12345",
  program: "13-Week Transformation & 30-Day Meal Plan",
  current_week: 4,
  coach: "Coach James (London)",
  calories: 2450,
  protein: "190g",
  carbs: "220g",
  fats: "55g",
  water: "3.5L"
};

// Demo Client 2: Zain (Week 1 7-Day Protocol)
const defaultZainClient = {
  id: "client-zain-1",
  name: "Zain",
  pin_code: "78601",
  program: "13-Week Transformation (Week 1 Active)",
  current_week: 1,
  coach: "Head Coach James (London)",
  calories: 2350,
  protein: "185g",
  carbs: "210g",
  fats: "55g",
  water: "3.5L"
};

const defaultZainResources = [
  {
    id: "res-zain-week1",
    client_id: "client-zain-1",
    title: "Week 1 Plan — 7-Day Precision Meal Protocol",
    category: "meal_plan",
    format: "text",
    content_text: `7:30 AM — Breakfast
Mon: 2 eggs + 1 roti + tea
Tue: Oats + banana + milk
Wed: 2 eggs + 1–2 slices whole-wheat bread
Thu: 1 paratha + 2 eggs
Fri: Oats + apple
Sat: 2 eggs + 1 roti + tea
Sun: Omelette + 2 slices bread

10:30 AM — Snack
1 fruit + handful of almonds/peanuts

1:30–2:00 PM — Lunch
Mon: Chicken + 1–2 roti + salad
Tue: Daal + 1–2 roti + salad
Wed: Chicken rice + raita
Thu: Beef/chicken + 1–2 roti + vegetables
Fri: Daal + rice + salad
Sat: Chicken + roti + vegetables
Sun: Biryani/pulao + raita (moderate portion)

5:00 PM — Snack
Fruit / yogurt / handful of nuts

8:00–8:30 PM — Dinner
Mon: Chicken + vegetables
Tue: 2 eggs + roti + salad
Wed: Chicken + 1 roti + salad
Thu: Daal + roti + vegetables
Fri: Chicken/fish + salad
Sat: Chicken + roti
Sun: Light dinner — eggs/chicken + salad

10:30 PM — Optional
Milk or plain yogurt if you're hungry.`,
    created_at: new Date().toISOString()
  }
];

// =========================================================================
// SMART MEAL PLAN PARSER (Converts written coach text into organized daily/weekly schedule)
// =========================================================================
function parseCoachMealPlan(text) {
  if (!text || typeof text !== 'string') return null;

  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  const lines = text.split('\n');
  const sections = [];
  let currentSection = null;

  // Regex to detect time/meal headers (e.g. "7:30 AM — Breakfast", "1:30–2:00 PM — Lunch", "MEAL 1 (08:00 AM)")
  const timeOrMealRegex = /^(\d{1,2}:\d{2}(?:\s*[-–—]\s*\d{1,2}:\d{2})?\s*(?:am|pm)?)\s*[-—:]\s*(.+)|^meal\s*\d+\s*(?:\([^)]+\))?\s*[-—:]?\s*(.*)/i;

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Skip metadata lines
    if (
      line.toLowerCase().startsWith('coach james') ||
      line.toLowerCase().startsWith('assigned to') ||
      line.toLowerCase().startsWith('daily target') ||
      line.toLowerCase().startsWith('7-day meal plan') ||
      line.toLowerCase().startsWith('week 1 plan') ||
      line.toLowerCase().startsWith('updated:')
    ) {
      continue;
    }

    const match = line.match(timeOrMealRegex);
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: 'slot_' + sections.length,
        time: match[1] ? match[1].trim() : (line.includes('(') ? line.match(/\(([^)]+)\)/)?.[1] || 'Scheduled' : 'Scheduled'),
        title: match[2] ? match[2].trim() : (match[3] ? match[3].trim() : line),
        days: {},
        generalItems: []
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        id: 'slot_0',
        time: 'General Timing',
        title: 'Coach Protocol',
        days: {},
        generalItems: []
      };
    }

    // Check for day prefixes: "Mon: ...", "Tue: ..."
    const dayMatch = line.match(/^(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:\s*(.+)/i);
    if (dayMatch) {
      const key = dayMatch[1].substring(0, 3).toLowerCase();
      currentSection.days[key] = dayMatch[2].trim();
    } else {
      currentSection.generalItems.push(line.replace(/^[•\-\*]\s*/, ''));
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const is7Day = sections.some(s => Object.keys(s.days).length > 0);

  return {
    is7Day,
    sections,
    dayKeys,
    dayNames
  };
}

// =========================================================================
// ORGANIZED MEAL SCHEDULE COMPONENT (Day-by-Day focus + 7-Day Matrix + Checklist)
// =========================================================================
function OrganizedMealSchedule({ plan, client, onAskCoach }) {
  const parsed = useMemo(() => parseCoachMealPlan(plan.content_text), [plan.content_text]);

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()] || 'mon';
  const [selectedDay, setSelectedDay] = useState('mon');
  const [viewMode, setViewMode] = useState('matrix'); // Default to full 7-Day Matrix

  useEffect(() => {
    if (parsed?.is7Day) {
      setViewMode('matrix');
    }
  }, [plan.id]);

  const storageKey = `wfz_weekly_eaten_${client.id}_${plan.id}`;
  const [dailyChecks, setDailyChecks] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (e) {
      return {};
    }
  });

  const toggleSlotEaten = (dayKey, slotId) => {
    const key = `${dayKey}_${slotId}`;
    const updated = { ...dailyChecks, [key]: !dailyChecks[key] };
    setDailyChecks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  if (!parsed || !parsed.sections || parsed.sections.length === 0) {
    return (
      <div className="custom-written-plan-card">
        <div className="written-plan-badge"><FileText size={14} /> Coach James Custom Directives</div>
        <h3 className="written-plan-title">{plan.title}</h3>
        <div className="written-plan-text">{plan.content_text}</div>
      </div>
    );
  }

  const totalSlots = parsed.sections.length;
  const completedSlots = parsed.sections.filter(s => !!dailyChecks[`${selectedDay}_${s.id}`]).length;
  const dayAdherencePct = Math.round((completedSlots / (totalSlots || 1)) * 100);

  return (
    <div className="organized-meal-schedule-card">
      {/* HEADER WITH METADATA & VIEW MODE SWITCHER */}
      <div className="schedule-header-wrap">
        <div className="schedule-title-meta">
          <div className="written-plan-badge">
            <Sparkles size={14} /> Coach James Custom Directives &bull; {plan.status === 'archived' ? 'Previous / Archived Protocol' : 'Active Protocol'}
          </div>
          <h2 className="schedule-main-title">{plan.title || "Week 1 Plan — 7-Day Precision Meal Protocol"}</h2>
          <div className="written-plan-meta">
            <span><strong>Client:</strong> {client.name}</span>
            <span>&bull;</span>
            <span><strong>Daily Target:</strong> {client.calories || 2350} kcal &bull; {client.protein || '185g'} Protein</span>
            <span>&bull;</span>
            <span><strong>Assigned:</strong> {new Date(plan.assigned_at || plan.created_at || Date.now()).toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        {/* VIEW MODE TOGGLE BUTTONS */}
        <div className="schedule-view-switcher">
          <button 
            type="button" 
            className={`schedule-view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
            onClick={() => setViewMode('matrix')}
          >
            <LayoutGrid size={15} /> 1. Full 7-Day Matrix Table
          </button>
          <button 
            type="button" 
            className={`schedule-view-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            <Clock size={15} /> 2. Day-by-Day View
          </button>
          <button 
            type="button" 
            className={`schedule-view-btn ${viewMode === 'text' ? 'active' : ''}`}
            onClick={() => setViewMode('text')}
          >
            <FileText size={15} /> 3. Coach Notes
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: INTERACTIVE DAY-BY-DAY FOCUS WITH REAL-TIME LOGGING
         ========================================================================= */}
      {viewMode === 'daily' && (
        <div className="daily-view-container">
          {/* DAY SELECTION PILL BAR */}
          <div className="schedule-days-bar">
            <span className="select-day-label">Select Day:</span>
            {parsed.dayKeys.map((dKey, idx) => {
              const isSelected = selectedDay === dKey;
              const isToday = todayKey === dKey;
              const allDone = parsed.sections.length > 0 && parsed.sections.every(s => !!dailyChecks[`${dKey}_${s.id}`]);

              return (
                <button
                  key={dKey}
                  type="button"
                  className={`day-pill-btn ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={() => setSelectedDay(dKey)}
                >
                  {isToday && <span className="today-badge">TODAY</span>}
                  <span className="day-name-pill-text">Day {idx + 1}: {parsed.dayNames[dKey]}</span>
                  {allDone && <CheckCircle2 size={13} className="day-done-icon" />}
                </button>
              );
            })}
          </div>

          {/* ACTIVE DAY PROGRESS & SUMMARY STRIP */}
          <div className="active-day-summary-strip">
            <div className="active-day-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span className="day-number-badge">DAY {parsed.dayKeys.indexOf(selectedDay) + 1} OF 7</span>
                <span className="active-day-heading">
                  {parsed.dayNames[selectedDay]}&apos;s Nutrition Routine
                </span>
                {selectedDay === todayKey && (
                  <span className="today-indicator-pill">⚡ TODAY</span>
                )}
              </div>
              <span className="active-day-sub">
                {completedSlots} of {totalSlots} meals marked completed ({dayAdherencePct}% adherence for {parsed.dayNames[selectedDay]})
              </span>
            </div>

            <div className="active-day-right-actions">
              {selectedDay !== todayKey && (
                <button 
                  type="button" 
                  className="btn-day-nav-quick"
                  onClick={() => setSelectedDay(todayKey)}
                  title="Jump to today"
                >
                  ⚡ Jump to Today ({parsed.dayNames[todayKey]})
                </button>
              )}
              {selectedDay !== 'mon' && (
                <button 
                  type="button" 
                  className="btn-day-nav-quick"
                  onClick={() => setSelectedDay('mon')}
                  title="Go to Day 1"
                >
                  &larr; Start of Week (Monday)
                </button>
              )}
              <div className="active-day-meter">
                <div className="active-day-meter-track">
                  <div className="active-day-meter-fill" style={{ width: `${dayAdherencePct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* CHRONOLOGICAL MEAL CARDS FOR THIS DAY */}
          <div className="daily-meals-timeline">
            {parsed.sections.map((sec) => {
              const foodText = sec.days[selectedDay] || (sec.generalItems.length > 0 ? sec.generalItems.join(', ') : 'Follow daily guidelines');
              const isEaten = !!dailyChecks[`${selectedDay}_${sec.id}`];

              return (
                <div key={sec.id} className={`daily-meal-card ${isEaten ? 'eaten' : ''}`}>
                  <div className="daily-meal-top-row">
                    <div className="meal-time-tag">
                      <Clock size={14} />
                      <strong>{sec.time}</strong>
                      <span className="meal-category-pill">{sec.title}</span>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => toggleSlotEaten(selectedDay, sec.id)}
                      className={`btn-toggle-slot ${isEaten ? 'checked' : ''}`}
                    >
                      {isEaten ? (
                        <>
                          <CheckSquare size={16} /> Completed &bull; Logged
                        </>
                      ) : (
                        <>
                          <Square size={16} /> Mark Eaten ({parsed.dayNames[selectedDay]})
                        </>
                      )}
                    </button>
                  </div>

                  <div className="meal-food-content-row">
                    <div className="food-main-text">
                      <p>{foodText}</p>
                    </div>

                    <button 
                      type="button" 
                      className="btn-ask-coach-swap"
                      onClick={() => onAskCoach(sec.title, parsed.dayNames[selectedDay], foodText)}
                      title="Ask Coach James about meal substitution or timing"
                    >
                      <MessageSquare size={13} /> Ask Coach Swap
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL 7-DAY MATRIX (WEEK-AT-A-GLANCE COMPARISON TABLE)
         ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className="weekly-matrix-container">
          <div className="matrix-instruction-strip">
            <Sparkles size={16} color="#ffc928" />
            <span>Complete 7-Day Comparison Matrix &bull; Perfect for grocery shopping, batch cooking, and weekly review.</span>
          </div>

          <div className="matrix-scroll-wrapper">
            <table className="weekly-matrix-table">
              <thead>
                <tr>
                  <th className="th-timing">Meal Window</th>
                  {parsed.dayKeys.map(dKey => (
                    <th key={dKey} className={`th-day ${dKey === todayKey ? 'today-col' : ''}`}>
                      {parsed.dayNames[dKey]}
                      {dKey === todayKey && <span className="matrix-today-tag">TODAY</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.sections.map(sec => (
                  <tr key={sec.id}>
                    <td className="matrix-meal-meta-cell">
                      <div className="matrix-meal-time">{sec.time}</div>
                      <div className="matrix-meal-title">{sec.title}</div>
                    </td>

                    {parsed.dayKeys.map(dKey => {
                      const item = sec.days[dKey] || (sec.generalItems.length > 0 ? sec.generalItems.join(', ') : '—');
                      const isEaten = !!dailyChecks[`${dKey}_${sec.id}`];

                      return (
                        <td key={dKey} className={`matrix-food-cell ${dKey === todayKey ? 'today-col' : ''} ${isEaten ? 'cell-eaten' : ''}`}>
                          <div className="matrix-food-text">{item}</div>
                          {isEaten && <span className="matrix-eaten-badge">✓ Done</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RAW COACH DIRECTIVES
         ========================================================================= */}
      {viewMode === 'text' && (
        <div className="raw-directives-container">
          <p className="raw-directives-hint">
            Verbatim instructions &amp; notes submitted directly by Head Coach James:
          </p>
          <div className="written-plan-text">
            {plan.content_text}
          </div>
        </div>
      )}

    </div>
  );
}

const defaultMealPlan = [
  {
    id: 1,
    time: "08:00 AM",
    name: "Meal 1 — Metabolic Breakfast",
    desc: "4 Whole Eggs / Egg Whites scramble, 80g Organic Rolled Oats with Blueberries & 1 scoop Whey Isolate.",
    protein: "45g",
    carbs: "58g",
    fats: "14g",
    calories: "530 kcal",
    icon: "sunrise"
  },
  {
    id: 2,
    time: "12:30 PM",
    name: "Meal 2 — Pre-Workout Power Lunch",
    desc: "200g Grilled Chicken Breast, 160g Steamed Jasmine Rice, Steamed Broccoli & 1/2 Hass Avocado.",
    protein: "52g",
    carbs: "62g",
    fats: "12g",
    calories: "560 kcal",
    icon: "sun"
  },
  {
    id: 3,
    time: "04:30 PM",
    name: "Meal 3 — Post-Workout Anabolic Window",
    desc: "1 Scoop Whey Isolate with Almond Milk, 2 Salted Rice Cakes with Raw Honey, and 1 Medium Banana.",
    protein: "32g",
    carbs: "46g",
    fats: "3g",
    calories: "340 kcal",
    icon: "dumbbell"
  },
  {
    id: 4,
    time: "08:00 PM",
    name: "Meal 4 — Lean Dinner & Muscle Repair",
    desc: "220g Wild Scottish Salmon or Lean Sirloin, 200g Roasted Sweet Potato with Olive Oil & Grilled Asparagus.",
    protein: "50g",
    carbs: "42g",
    fats: "18g",
    calories: "530 kcal",
    icon: "moon"
  }
];

const defaultVideos = [
  {
    id: 1,
    title: "Week 4 Form Calibration: Deadlifts & Fiber Recruitment",
    duration: "12:45",
    type: "Technique Guide",
    url: "/canuzunnn__pindown.io_1787244520.mp4",
    coachNote: "Watch the hip hinge closely before your heavy sets on Tuesday."
  },
  {
    id: 2,
    title: "Lower Belly Compression: Stripping Visceral Fat",
    duration: "08:20",
    type: "Abs & Core Protocol",
    url: "/canuzunnn__pindown.io_1787244520.mp4",
    coachNote: "Perform these vacuum holds immediately upon waking before Meal 1."
  }
];

const defaultWeeks = [
  { week: 1, title: "Metabolic Reset & Baseline Testing", status: "Completed", desc: "Setting macro baseline, water intake adaptation, lifting form calibration." },
  { week: 2, title: "Fat Burning Engine Ignition", status: "Completed", desc: "Calorie deficit initiated with whole foods, zero hunger adaptation." },
  { week: 3, title: "Lower Abdominal Shredding", status: "Completed", desc: "Carb cycling introduced on heavy leg days to accelerate fat melt." },
  { week: 4, title: "Mid-Program Recomposition", status: "Active (Current)", desc: "Deep cuts emerging on obliques, progressive overload increased by 5%." },
  { week: 5, title: "Hypertrophy Density & Peak Overload", status: "Upcoming", desc: "Shoulder cap sculpting and upper back volume ramp-up." },
  { week: 6, title: "6-Week Milestone & Check-in", status: "Upcoming", desc: "Full photo assessment with Coach James, calorie adjustment." },
  { week: 7, title: "Aggressive Lean Muscle Drive", status: "Upcoming", desc: "Super-setting routines to stimulate deeper fast-twitch muscle fibers." },
  { week: 8, title: "Visceral Fat Elimination Phase", status: "Upcoming", desc: "Refining macro timing around workouts for maximum vascularity." },
  { week: 9, title: "Strength & Power Calibration", status: "Upcoming", desc: "Testing PRs on squat, bench, and deadlift with clean form." },
  { week: 10, title: "Stage-Conditioning Shred", status: "Upcoming", desc: "Sub-9% body fat push with structured carb tapering." },
  { week: 11, title: "Shoulder & Arm Fine-Sculpting", status: "Upcoming", desc: "High-volume isolations for 3D muscle roundness." },
  { week: 12, title: "Final Transformation Polish", status: "Upcoming", desc: "Water balance optimization and deep striation emergence." },
  { week: 13, title: "Peak Longevity & Permanent Standard", status: "Upcoming", desc: "Celebration photoshoot and permanent lifestyle maintenance protocol." }
];

// =========================================================================
// CLIENT RESOURCES EXTRACTOR (Never drops old plans; matches by ID, PIN & Name)
// =========================================================================
function extractClientResources(allResources, clientObj) {
  if (!clientObj) return [];
  const isZain = clientObj.name?.toLowerCase().trim() === 'zain' || 
                 clientObj.pin_code === '78601' || 
                 clientObj.pin_code === '8989' || 
                 clientObj.id === 'client-zain-1';

  let list = (allResources || []).filter(r => {
    if (r.client_id === clientObj.id) return true;
    if (r.client_pin && clientObj.pin_code && r.client_pin === clientObj.pin_code) return true;
    if (isZain) {
      if (r.client_id === 'client-zain-1') return true;
      if (r.client_name?.toLowerCase().trim() === 'zain') return true;
      if (r.id?.includes('zain')) return true;
      if (r.title?.toLowerCase().includes('zain')) return true;
    }
    return false;
  });

  // Always ensure Zain has his foundational Week 1 7-Day Plan
  if (isZain) {
    defaultZainResources.forEach(dz => {
      if (!list.some(item => item.id === dz.id)) {
        list.push({ ...dz, client_id: clientObj.id });
      }
    });
  }

  // If Marcus or demo client with empty resources, provide demo fallback
  if (list.length === 0 && (clientObj.id === 'demo-client-1' || clientObj.pin_code === '12345')) {
    list = (allResources || []).filter(r => r.client_id === "demo-client-1" || !r.client_id);
  }

  // Deduplicate by ID
  const map = new Map();
  list.forEach(item => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values());
}

export default function ResourcesPage() {
  const [pin, setPin] = useState('');
  const [client, setClient] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('meal_plan'); // meal_plan, videos, messenger, weighin, weeks, guidelines
  const [selectedWeek, setSelectedWeek] = useState(4);

  // Client to Coach Messenger State
  const [clientMsgText, setClientMsgText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [msgSentNotice, setMsgSentNotice] = useState(false);

  // Daily Meal Checklist & Adherence State
  const [eatenMeals, setEatenMeals] = useState({});

  // Fasted Weigh-In State
  const [weighInVal, setWeighInVal] = useState('');
  const [weighInNote, setWeighInNote] = useState('');
  const [weighInList, setWeighInList] = useState([]);
  const [weighInNotice, setWeighInNotice] = useState(false);

  // Multiple Meal Plans Filter & View State
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [protocolFilterType, setProtocolFilterType] = useState('all'); // 'all', 'active', 'previous'
  const [isScheduleOpen, setIsScheduleOpen] = useState(false); // Collapsed by default so user controls when to view ("apni marzi se dekh lega, aise direct mat show karo")
  const [planFilterCategory, setPlanFilterCategory] = useState('all'); // 'all', 'weekly', 'daily'
  const [planSearchQuery, setPlanSearchQuery] = useState('');
  const [plansViewDisplay, setPlansViewDisplay] = useState('focused'); // 'focused', 'accordion'
  const [expandedPlanIds, setExpandedPlanIds] = useState({});
  const [showBaselineMeals, setShowBaselineMeals] = useState(false);

  // Filter coach resources assigned to this client and sort: active first, then newest (Hook order preserved)
  const sortedCustomPlans = useMemo(() => {
    const list = resources.filter(r => r.format === 'text' || (!r.content_url && r.content_text));
    return [...list].sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return new Date(b.assigned_at || b.created_at || 0) - new Date(a.assigned_at || a.created_at || 0);
    });
  }, [resources]);

  const customMediaPlans = useMemo(() => {
    return resources.filter(r => r.format !== 'text' && (r.content_url || r.format === 'video' || r.format === 'image'));
  }, [resources]);

  const activePlan = useMemo(() => {
    if (selectedPlanId) {
      const match = sortedCustomPlans.find(p => p.id === selectedPlanId);
      if (match) return match;
    }
    return sortedCustomPlans[0] || null;
  }, [sortedCustomPlans, selectedPlanId]);

  const activeCustomPlan = sortedCustomPlans.find(p => p.status === 'active') || sortedCustomPlans[0] || null;
  const previousCustomPlans = sortedCustomPlans.filter(p => p.id !== activeCustomPlan?.id);

  const displayedPlans = useMemo(() => {
    if (protocolFilterType === 'active') {
      return activeCustomPlan ? [activeCustomPlan] : [];
    }
    if (protocolFilterType === 'previous') {
      return previousCustomPlans;
    }
    return sortedCustomPlans;
  }, [sortedCustomPlans, protocolFilterType, activeCustomPlan, previousCustomPlans]);

  const toggleExpandPlan = (id) => {
    setExpandedPlanIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAskCoachAboutMeal = (mealTitle, dayName, foodText) => {
    setActiveTab('messenger');
    setClientMsgText(`Hi Coach James, question regarding ${dayName ? dayName + ' ' : ''}${mealTitle} (${foodText}): `);
  };

  // Load chat messages & weigh-ins when client logs in or when storage changes
  const syncData = () => {
    if (client) {
      const allMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      const filteredMsgs = allMsgs.filter(m => m.client_pin === client.pin_code || m.client_id === client.id);
      setChatMessages(filteredMsgs);

      const allWeigh = JSON.parse(localStorage.getItem(LOCAL_WEIGHINS_KEY) || '[]');
      const filteredWeigh = allWeigh.filter(w => w.client_id === client.id || w.client_pin === client.pin_code);
      setWeighInList(filteredWeigh);

      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const clientLocalRes = extractClientResources(localRes, client);
      setResources(clientLocalRes);

      const savedEaten = JSON.parse(localStorage.getItem('wfz_eaten_' + client.id) || '{}');
      setEatenMeals(savedEaten);

      // Refresh client's macros if updated by Coach in Admin
      const allClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
      const updatedClient = allClients.find(c => c.pin_code === client.pin_code || c.id === client.id || (client.name?.toLowerCase() === 'zain' && c.name?.toLowerCase() === 'zain'));
      if (updatedClient && (
        updatedClient.calories !== client.calories ||
        updatedClient.protein !== client.protein ||
        updatedClient.carbs !== client.carbs ||
        updatedClient.fats !== client.fats ||
        updatedClient.water !== client.water
      )) {
        setClient(prev => ({
          ...prev,
          ...updatedClient
        }));
      }
    }
  };

  useEffect(() => {
    syncData();

    // Cross-tab real-time sync with Admin Dashboard
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('wfz_')) {
        syncData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [client]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanPin = pin.trim();

    // 1. Try Supabase
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('pin_code', cleanPin)
        .single();

      if (!clientError && clientData) {
        const activeClientObj = {
          ...defaultDemoClient,
          ...clientData,
          name: clientData.name || "Client"
        };
        setClient(activeClientObj);

        const { data: resData } = await supabase
          .from('resources')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });

        const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
        const clientLocalRes = extractClientResources([...(resData || []), ...localRes], activeClientObj);
        setResources(clientLocalRes);

        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Supabase connection fallback to local storage:", err);
    }

    // 2. Try LocalStorage for registered clients
    const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
    const matchedClient = localClients.find(c => c.pin_code === cleanPin || (cleanPin.toLowerCase() === 'zain' && c.name?.toLowerCase() === 'zain'));

    if (matchedClient) {
      const activeClientObj = {
        ...defaultDemoClient,
        ...matchedClient,
        coach: "Head Coach James (London)"
      };
      setClient(activeClientObj);

      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const clientLocalRes = extractClientResources(localRes, activeClientObj);
      setResources(clientLocalRes);
      setLoading(false);
      return;
    }

    // 3. Zain Quick Access Fallback (PIN 78601 or 'zain' or '8989')
    if (cleanPin === '78601' || cleanPin === '8989' || cleanPin.toLowerCase() === 'zain') {
      const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
      const localZain = localClients.find(c => c.name?.toLowerCase() === 'zain' || c.pin_code === cleanPin || c.id === 'client-zain-1');
      const activeClientObj = {
        ...defaultZainClient,
        ...(localZain || {}),
        pin_code: cleanPin
      };
      setClient(activeClientObj);
      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const clientLocalRes = extractClientResources(localRes, activeClientObj);
      setResources(clientLocalRes);
      setLoading(false);
      return;
    }

    // 4. Demo fallback for 12345 or general testing
    if (cleanPin === '12345' || cleanPin.length >= 4) {
      const activeClientObj = {
        ...defaultDemoClient,
        pin_code: cleanPin
      };
      setClient(activeClientObj);

      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const clientLocalRes = extractClientResources(localRes, activeClientObj);
      setResources(clientLocalRes);
      setLoading(false);
      return;
    }

    setErrorMsg('Invalid PIN. Enter 78601 / 8989 (Zain) or 12345 (Marcus T.) to view plans.');
    setLoading(false);
  };

  const handleLogout = () => {
    setClient(null);
    setResources([]);
    setPin('');
  };

  // Toggle Meal Eaten
  const toggleMealEaten = (mealId) => {
    const updated = { ...eatenMeals, [mealId]: !eatenMeals[mealId] };
    setEatenMeals(updated);
    if (client) {
      localStorage.setItem('wfz_eaten_' + client.id, JSON.stringify(updated));
    }
  };

  // Client sends text/check-in to Coach James
  const handleSendClientMessage = (e) => {
    e.preventDefault();
    if (!clientMsgText.trim()) return;

    const newMsg = {
      id: "msg_" + Date.now(),
      client_id: client.id,
      client_name: client.name,
      client_pin: client.pin_code,
      sender: "client",
      sender_name: client.name,
      text: clientMsgText.trim(),
      timestamp: new Date().toISOString(),
      status: "Delivered to Coach James"
    };

    try {
      supabase.from('client_messages').insert([{
        id: newMsg.id,
        client_id: newMsg.client_id,
        client_name: newMsg.client_name,
        client_pin: newMsg.client_pin,
        sender: newMsg.sender,
        sender_name: newMsg.sender_name,
        text: newMsg.text,
        timestamp: newMsg.timestamp,
        status: newMsg.status
      }]).then();
    } catch (e) {}

    const allMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    allMsgs.push(newMsg);
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(allMsgs));

    setChatMessages(prev => [...prev, newMsg]);
    setClientMsgText('');
    setMsgSentNotice(true);
    setTimeout(() => setMsgSentNotice(false), 4000);
  };

  // Log Fasted Weigh-In
  const handleLogWeighIn = (e) => {
    e.preventDefault();
    if (!weighInVal) return;

    const newEntry = {
      id: "w_" + Date.now(),
      client_id: client.id,
      client_name: client.name,
      client_pin: client.pin_code,
      weight: weighInVal.trim(),
      notes: weighInNote.trim() || "Fasted morning check-in",
      timestamp: new Date().toISOString()
    };

    try {
      supabase.from('weigh_ins').insert([{
        id: newEntry.id,
        client_id: newEntry.client_id,
        client_name: newEntry.client_name,
        client_pin: newEntry.client_pin,
        weight: parseFloat(newEntry.weight) || 0,
        notes: newEntry.notes,
        timestamp: newEntry.timestamp
      }]).then();
    } catch (e) {}

    const allWeigh = JSON.parse(localStorage.getItem(LOCAL_WEIGHINS_KEY) || '[]');
    allWeigh.unshift(newEntry);
    localStorage.setItem(LOCAL_WEIGHINS_KEY, JSON.stringify(allWeigh));

    setWeighInList(prev => [newEntry, ...prev]);
    setWeighInVal('');
    setWeighInNote('');
    setWeighInNotice(true);
    setTimeout(() => setWeighInNotice(false), 4000);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  // Prevent right click globally on this page to protect coach's proprietary plan
  const disableRightClick = (e) => e.preventDefault();

  if (!client) {
    return (
      <div className="resources-login-container">
        <div className="login-box">
          <div className="login-badge">
            <Lock size={16} />
            <span>PRIVATE CLIENT ACCESS</span>
          </div>
          <h2>World Fitness Zone</h2>
          <p className="login-desc">
            Enter your private PIN code to access your personalized <strong>Meal Plan, Diet Routine &amp; Training Videos</strong> from Coach James.
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-wrap">
              <input 
                type="password" 
                placeholder="Enter PIN (e.g. 12345)" 
                value={pin} 
                onChange={e => setPin(e.target.value)} 
                maxLength={8}
                required 
              />
            </div>
            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <button type="submit" className="btn-unlock" disabled={loading}>
              {loading ? "Authenticating..." : "Unlock Client Portal →"}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem' }}>
            <div 
              className="demo-hint-box active-zain-btn" 
              style={{ cursor: 'pointer', userSelect: 'none', background: '#eff6ff', border: '1.5px solid #93c5fd', padding: '0.65rem 0.95rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} 
              onClick={() => { setPin('78601'); setErrorMsg(''); }}
              title="Click to auto-fill Zain's PIN"
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1d4ed8' }}>⚡ Auto-Fill: <strong>Zain</strong> (Week 1 7-Day Plan)</span>
              <code style={{ background: '#dbeafe', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', color: '#1e40af' }}>PIN: 78601</code>
            </div>

            <div 
              className="demo-hint-box" 
              style={{ cursor: 'pointer', userSelect: 'none', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.55rem 0.95rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} 
              onClick={() => { setPin('12345'); setErrorMsg(''); }}
              title="Click to auto-fill Marcus's PIN"
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Marcus T. (Week 4 Plan)</span>
              <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', color: '#64748b' }}>PIN: 12345</code>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid #e2e8f0' }}>
            <a 
              href="/admin" 
              style={{ fontSize: '0.82rem', color: '#64748b', textDecoration: 'none', fontWeight: '600' }}
            >
              Coach James? Switch to <strong>Trainer Admin Portal &rarr;</strong>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-portal-wrapper" onContextMenu={disableRightClick}>
      
      {/* TOP STATUS BAR */}
      <div className="portal-top-bar">
        <div className="portal-brand">
          <div className="brand-dot"></div>
          <span>WORLD FITNESS ZONE &bull; CLIENT PORTAL</span>
        </div>

        <div className="portal-user-meta">
          <button onClick={handlePrintPlan} className="btn-print-plan" title="Print Meal Plan">
            <Printer size={15} /> Print / PDF
          </button>
          <div className="user-badge">
            <User size={15} />
            <span>{client.name} (PIN: {client.pin_code})</span>
          </div>
          <button onClick={handleLogout} className="btn-portal-logout" title="Lock &amp; Exit">
            <LogOut size={16} /> Exit
          </button>
        </div>
      </div>

      {/* DASHBOARD HERO CARD */}
      <div className="dashboard-hero-card">
        <div className="hero-welcome-info">
          <span className="client-program-tag">ACTIVE CLIENT PROGRAM</span>
          <h1>Welcome Back, {client.name}</h1>
          <p className="hero-subtext">
            <strong>Program:</strong> {client.program || "13-Week Elite Transformation"} &bull; <strong>Head Coach:</strong> {client.coach || "Coach James (London)"}
          </p>
        </div>

        <div className="coach-status-box">
          <div className="coach-avatar-mini">CJ</div>
          <div className="coach-text">
            <div className="coach-name-label">Head Coach James</div>
            <div className="coach-quote-small">&ldquo;Discipline creates freedom. Stick to the meals.&rdquo;</div>
          </div>
        </div>
      </div>

      {/* DAILY MACRONUTRIENT TARGETS STRIP (DYNAMIC FROM COACH JAMES) */}
      <div className="macro-targets-strip">
        <div className="macro-box cal-box">
          <div className="macro-icon-wrap"><Flame size={20} /></div>
          <div>
            <span className="macro-label">Daily Target</span>
            <span className="macro-val">{client.calories || 2450} <small>kcal</small></span>
          </div>
        </div>

        <div className="macro-box">
          <div className="macro-icon-wrap protein"><Dumbbell size={20} /></div>
          <div>
            <span className="macro-label">Target Protein</span>
            <span className="macro-val">{client.protein || "190g"}</span>
          </div>
        </div>

        <div className="macro-box">
          <div className="macro-icon-wrap carbs"><Utensils size={20} /></div>
          <div>
            <span className="macro-label">Target Carbs</span>
            <span className="macro-val">{client.carbs || "220g"}</span>
          </div>
        </div>

        <div className="macro-box">
          <div className="macro-icon-wrap fats"><Sparkles size={20} /></div>
          <div>
            <span className="macro-label">Healthy Fats</span>
            <span className="macro-val">{client.fats || "55g"}</span>
          </div>
        </div>

        <div className="macro-box">
          <div className="macro-icon-wrap water"><Droplet size={20} /></div>
          <div>
            <span className="macro-label">Hydration Goal</span>
            <span className="macro-val">{client.water || "3.5L"}</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="portal-tabs-nav">
        <button 
          className={`portal-tab ${activeTab === 'meal_plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('meal_plan')}
        >
          <Utensils size={18} />
          <span>Meal Plan of the Day</span>
        </button>

        <button 
          className={`portal-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <Video size={18} />
          <span>Routine Exercise Videos</span>
        </button>

        <button 
          className={`portal-tab ${activeTab === 'messenger' ? 'active' : ''}`}
          onClick={() => setActiveTab('messenger')}
        >
          <MessageSquare size={18} />
          <span>Text Coach James {chatMessages.length > 0 && `(${chatMessages.length})`}</span>
        </button>

        <button 
          className={`portal-tab ${activeTab === 'weighin' ? 'active' : ''}`}
          onClick={() => setActiveTab('weighin')}
        >
          <Scale size={18} />
          <span>Fasted Weigh-In Tracker</span>
        </button>

        <button 
          className={`portal-tab ${activeTab === 'weeks' ? 'active' : ''}`}
          onClick={() => setActiveTab('weeks')}
        >
          <Calendar size={18} />
          <span>13-Week Transformation Timeline</span>
        </button>

        <button 
          className={`portal-tab ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
        >
          <Shield size={18} />
          <span>Coach James&apos;s Rules &amp; Protocols</span>
        </button>
      </div>

      {/* TAB CONTENT 1: MEAL PLAN OF THE DAY */}
      {activeTab === 'meal_plan' && (
        <div className="tab-pane-container">

          <div className="pane-header">
            <div>
              <h2>Personalized Nutrition &amp; Meal Protocols</h2>
              <p>Tailored whole-food meal protocols designed specifically for your body composition and weekly transformation goals.</p>
            </div>

            <div className="coach-quote-pill">
              <Sparkles size={16} />
              <span>&ldquo;Follow my meal plan and you will never be hungry!&rdquo; &mdash; Coach James</span>
            </div>
          </div>

          {/* =========================================================================
              CLEAN PROTOCOL SWITCHER (SWITCH BETWEEN OLD & NEW MEAL PLANS WITH 1 CLICK)
             ========================================================================= */}
          {/* =========================================================================
              CLEAN DIET PROTOCOL FILTER & SELECTOR (USER CONTROLS WHAT & WHEN TO VIEW)
             ========================================================================= */}
          {sortedCustomPlans.length > 0 && (
            <div className="protocol-filter-command-bar">
              {/* TOP HEADER ROW: TITLE + BADGE + SCHEDULE VISIBILITY TOGGLE */}
              <div className="filter-bar-header">
                <div className="filter-header-left">
                  <div className="filter-icon-badge">
                    <ListFilter size={20} />
                  </div>
                  <div>
                    <h3 className="filter-title">
                      Diet Protocol Filter &amp; Selector
                      <span className="plans-count-pill">{sortedCustomPlans.length} Total</span>
                    </h3>
                    <p className="filter-subtext">
                      Filter active vs. previous meal plans and choose which protocol to inspect.
                    </p>
                  </div>
                </div>

                {/* SCHEDULE OPEN/CLOSE TOGGLE BUTTON */}
                <button
                  type="button"
                  id="btn-toggle-schedule"
                  className={`btn-schedule-toggle ${isScheduleOpen ? 'btn-toggle-open' : 'btn-toggle-closed'}`}
                  onClick={() => setIsScheduleOpen(prev => !prev)}
                >
                  {isScheduleOpen ? (
                    <>
                      <EyeOff size={16} />
                      <span>Hide Meal Schedule</span>
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      <span>View Meal Schedule</span>
                    </>
                  )}
                </button>
              </div>

              {/* CONTROLS ROW: FILTER TABS + SELECT DROPDOWN */}
              <div className="filter-controls-row">
                {/* 1. FILTER TABS (ALL / ACTIVE / PREVIOUS) */}
                <div className="filter-pills-wrap">
                  <span className="filter-control-label">Filter Status:</span>
                  <div className="filter-pills-group">
                    <button
                      type="button"
                      className={`filter-pill-tab ${protocolFilterType === 'all' ? 'active' : ''}`}
                      onClick={() => setProtocolFilterType('all')}
                    >
                      All Protocols ({sortedCustomPlans.length})
                    </button>
                    <button
                      type="button"
                      className={`filter-pill-tab ${protocolFilterType === 'active' ? 'active' : ''}`}
                      onClick={() => {
                        setProtocolFilterType('active');
                        if (activeCustomPlan) setSelectedPlanId(activeCustomPlan.id);
                      }}
                    >
                      🟢 Current Active (1)
                    </button>
                    {previousCustomPlans.length > 0 && (
                      <button
                        type="button"
                        className={`filter-pill-tab ${protocolFilterType === 'previous' ? 'active' : ''}`}
                        onClick={() => {
                          setProtocolFilterType('previous');
                          if (activePlan?.id === activeCustomPlan?.id && previousCustomPlans.length > 0) {
                            setSelectedPlanId(previousCustomPlans[0].id);
                          }
                        }}
                      >
                        📜 Previous Plans ({previousCustomPlans.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. CHOOSE PLAN DROPDOWN */}
                <div className="filter-dropdown-wrap">
                  <label htmlFor="protocol-plan-selector" className="filter-control-label">
                    Select Meal Protocol:
                  </label>
                  <div className="select-dropdown-container">
                    <select
                      id="protocol-plan-selector"
                      className="diet-plan-select-dropdown"
                      value={activePlan?.id || ''}
                      onChange={(e) => {
                        setSelectedPlanId(e.target.value);
                        setIsScheduleOpen(true);
                      }}
                    >
                      {protocolFilterType === 'all' ? (
                        <>
                          {activeCustomPlan && (
                            <optgroup label="🟢 CURRENT ACTIVE PROTOCOL">
                              <option value={activeCustomPlan.id}>
                                🟢 [ACTIVE] {activeCustomPlan.title} (Assigned: {new Date(activeCustomPlan.assigned_at || activeCustomPlan.created_at || Date.now()).toLocaleDateString('en-GB')})
                              </option>
                            </optgroup>
                          )}
                          {previousCustomPlans.length > 0 && (
                            <optgroup label="📜 PREVIOUS / ARCHIVED DIET PROTOCOLS">
                              {previousCustomPlans.map(p => (
                                <option key={p.id} value={p.id}>
                                  📜 [PREVIOUS] {p.title} (Assigned: {new Date(p.assigned_at || p.created_at || Date.now()).toLocaleDateString('en-GB')})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </>
                      ) : (
                        displayedPlans.map(p => {
                          const isActive = p.id === activeCustomPlan?.id;
                          return (
                            <option key={p.id} value={p.id}>
                              {isActive ? '🟢 [ACTIVE]' : '📜 [PREVIOUS]'} {p.title} (Assigned: {new Date(p.assigned_at || p.created_at || Date.now()).toLocaleDateString('en-GB')})
                            </option>
                          );
                        })
                      )}
                    </select>
                    <ChevronDown size={16} className="dropdown-arrow-icon" />
                  </div>
                </div>
              </div>

              {/* CURRENT SELECTION SUMMARY STRIP */}
              {activePlan && (
                <div className={`selected-protocol-summary-bar ${activePlan.id === activeCustomPlan?.id ? 'is-active' : 'is-archived'}`}>
                  <div className="summary-bar-left">
                    <span className={`summary-status-pill ${activePlan.id === activeCustomPlan?.id ? 'pill-active' : 'pill-archived'}`}>
                      {activePlan.id === activeCustomPlan?.id ? '🟢 CURRENT ACTIVE' : '📜 PREVIOUS / ARCHIVED'}
                    </span>
                    <strong className="summary-plan-title">&ldquo;{activePlan.title}&rdquo;</strong>
                    <span className="summary-date-tag">
                      <Clock size={12} /> Assigned: {new Date(activePlan.assigned_at || activePlan.created_at || Date.now()).toLocaleDateString('en-GB')}
                    </span>
                    <span className="summary-format-tag">
                      {/7-day|week|mon\s*:/i.test(activePlan.title + ' ' + activePlan.content_text) ? '📅 7-Day Matrix' : '⚡ Daily Plan'}
                    </span>
                  </div>

                  <div className="summary-bar-right">
                    {activePlan.id !== activeCustomPlan?.id && (
                      <button
                        type="button"
                        className="btn-switch-to-active"
                        onClick={() => {
                          if (activeCustomPlan) setSelectedPlanId(activeCustomPlan.id);
                        }}
                      >
                        &larr; Switch to Active Plan
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-summary-toggle-action"
                      onClick={() => setIsScheduleOpen(prev => !prev)}
                    >
                      {isScheduleOpen ? 'Hide Table ⌃' : 'Inspect Table ⌄'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MEAL SCHEDULE RENDER: EXPANDED ONLY WHEN USER CHOOSES */}
          {activePlan && isScheduleOpen && (
            <div className="focused-plan-view-area">
              <OrganizedMealSchedule 
                plan={activePlan}
                client={client}
                onAskCoach={handleAskCoachAboutMeal}
              />
              <div className="schedule-bottom-collapse-bar">
                <span>Finished reviewing &ldquo;{activePlan.title}&rdquo;?</span>
                <button 
                  type="button" 
                  className="btn-collapse-bottom"
                  onClick={() => setIsScheduleOpen(false)}
                >
                  <EyeOff size={14} /> Collapse / Hide Schedule
                </button>
              </div>
            </div>
          )}

          {/* WHEN SCHEDULE IS COLLAPSED: USER CAN OPEN ON DEMAND */}
          {activePlan && !isScheduleOpen && (
            <div className="schedule-collapsed-state-card">
              <div className="collapsed-state-left">
                <div className="collapsed-state-icon">
                  <Calendar size={28} />
                </div>
                <div>
                  <h4 className="collapsed-state-title">
                    Meal Schedule for &ldquo;{activePlan.title}&rdquo; is hidden
                  </h4>
                  <p className="collapsed-state-sub">
                    You have selected this protocol. Click the button to inspect the complete 7-day matrix, daily calories, macro breakdowns, and meal recipes at your own pace.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-open-schedule-cta"
                onClick={() => setIsScheduleOpen(true)}
              >
                <Eye size={18} /> View &amp; Open Meal Schedule
              </button>
            </div>
          )}

          {/* DYNAMIC IMAGE / DIET SHEET UPLOADED BY COACH JAMES */}
          {customMediaPlans.filter(r => r.format === 'image').length > 0 && (
            <div className="custom-media-sheets" style={{ marginBottom: '2rem' }}>
              {customMediaPlans.filter(r => r.format === 'image').map(sheet => (
                <div key={sheet.id} className="meal-card" style={{ padding: '1.5rem' }}>
                  <div className="written-plan-badge" style={{ width: 'fit-content' }}>
                    <ImageIcon size={14} /> Official Diet Sheet / Infographic
                  </div>
                  <h3 className="meal-title">{sheet.title}</h3>
                  <div style={{ marginTop: '1rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img 
                      src={sheet.content_url} 
                      alt={sheet.title} 
                      style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', background: '#0a1626' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BASELINE SAMPLE MEALS (ONLY IF NO CUSTOM PLANS ASSIGNED BY COACH) */}
          {sortedCustomPlans.length === 0 && (
            <div className="baseline-meals-section-wrap">
              <div className="meals-grid">
                {defaultMealPlan.map(meal => {
                  const isEaten = !!eatenMeals[meal.id];
                  return (
                    <div key={meal.id} className={`meal-card ${isEaten ? 'meal-completed' : ''}`}>
                      <div className="meal-card-top">
                        <span className="meal-time">
                          <Clock size={14} /> {meal.time}
                        </span>
                        <span className="meal-calories">{meal.calories}</span>
                      </div>
                      <h3 className="meal-title">{meal.name}</h3>
                      <p className="meal-desc">{meal.desc}</p>
                      <div className="meal-macros-row" style={{ marginBottom: '1.25rem' }}>
                        <span className="badge-p">P: {meal.protein}</span>
                        <span className="badge-c">C: {meal.carbs}</span>
                        <span className="badge-f">F: {meal.fats}</span>
                      </div>
                      <button 
                        onClick={() => toggleMealEaten(meal.id)}
                        className={`btn-meal-check ${isEaten ? 'checked' : ''}`}
                      >
                        {isEaten ? <><CheckSquare size={16} /> Completed</> : <><Square size={16} /> Mark Eaten</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hydration & Supplements Card */}
          <div className="nutrition-supplements-banner">
            <h3><Droplet size={18} /> Essential Daily Supplements &amp; Hydration</h3>
            <div className="supplements-grid">
              <div className="supp-item">
                <CheckCircle2 size={16} className="supp-check" />
                <div>
                  <strong>3.5L Clean Water Daily:</strong> 500ml immediately upon waking up with a pinch of Celtic sea salt.
                </div>
              </div>
              <div className="supp-item">
                <CheckCircle2 size={16} className="supp-check" />
                <div>
                  <strong>5g Creatine Monohydrate:</strong> Take with Meal 3 (Post-workout) to saturate ATP and preserve muscle fullness.
                </div>
              </div>
              <div className="supp-item">
                <CheckCircle2 size={16} className="supp-check" />
                <div>
                  <strong>Omega-3 &amp; Vitamin D3:</strong> 2 capsules with Meal 1 for metabolic health and joint recovery.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ROUTINE EXERCISE VIDEOS */}
      {activeTab === 'videos' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Assigned Routine Videos &amp; Form Execution</h2>
              <p>Strict instruction from Coach James. Study the cues before your daily gym sessions.</p>
            </div>
          </div>

          <div className="videos-container">
            {/* Custom Videos Assigned by Coach James */}
            {customMediaPlans.filter(r => r.format === 'video' || r.type === 'routine_video').map(video => (
              <div key={video.id} className="video-card">
                <div className="video-header">
                  <div className="video-badge"><Video size={14} /> Custom Client Video</div>
                  <span className="video-duration">Direct from Coach James</span>
                </div>

                <div className="video-player-wrap">
                  <video 
                    src={video.content_url || "/canuzunnn__pindown.io_1787244520.mp4"} 
                    controls 
                    controlsList="nodownload" 
                    className="protected-video"
                    preload="metadata"
                  />
                </div>

                <div className="video-info">
                  <h3>{video.title}</h3>
                  {video.content_text && (
                    <p className="coach-video-note">
                      <strong>Coach James&apos;s Note:</strong> {video.content_text}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Default Technique Drills */}
            {defaultVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-header">
                  <div className="video-badge"><Video size={14} /> {video.type}</div>
                  <span className="video-duration">{video.duration}</span>
                </div>

                <div className="video-player-wrap">
                  <video 
                    src={video.url} 
                    controls 
                    controlsList="nodownload" 
                    className="protected-video"
                    preload="metadata"
                  />
                </div>

                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="coach-video-note">
                    <strong>Coach James&apos;s Note:</strong> {video.coachNote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2-WAY CHAT THREAD WITH COACH JAMES */}
      {activeTab === 'messenger' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Direct Check-In &amp; 2-Way Chat with Coach James</h2>
              <p>Ask food substitution questions, report workout feedback, and receive direct replies from Head Coach James.</p>
            </div>
          </div>

          <div className="client-messenger-panel">
            <div className="messenger-header">
              <div>
                <h3><MessageSquare size={20} color="var(--color-primary, #155eef)" /> Coach James Private Thread</h3>
                <p>Private encrypted direct line. Coach James answers in your dashboard in real time.</p>
              </div>
              <div className="coach-status-pill">
                <span className="status-dot"></span> Head Coach James Online
              </div>
            </div>

            {/* CONVERSATION THREAD */}
            <div className="chat-thread-box">
              {chatMessages.length === 0 ? (
                <div className="chat-empty-state">
                  <MessageSquare size={32} color="#94a3b8" />
                  <p>No messages yet. Send your first question or check-in to Coach James below!</p>
                </div>
              ) : (
                chatMessages.map(m => {
                  const isCoach = m.sender === 'coach';
                  return (
                    <div key={m.id} className={`chat-bubble-row ${isCoach ? 'from-coach' : 'from-client'}`}>
                      {isCoach && <div className="chat-coach-avatar">CJ</div>}
                      <div className="chat-bubble-content">
                        <div className="chat-bubble-top">
                          <strong>{isCoach ? 'Head Coach James' : 'You (' + client.name + ')'}</strong>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendClientMessage} className="messenger-form" style={{ marginTop: '1.5rem' }}>
              <textarea 
                rows={3}
                placeholder="Type your message or Sunday check-in to Coach James..."
                value={clientMsgText}
                onChange={e => setClientMsgText(e.target.value)}
                required
              />

              <div className="messenger-submit-row">
                <button type="submit" className="btn-send-coach">
                  <Send size={16} /> Send Message to Coach James
                </button>

                {msgSentNotice && (
                  <span className="msg-sent-alert">
                    <CheckCheck size={18} /> Delivered to Coach James!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FASTED WEIGH-IN LOGGER */}
      {activeTab === 'weighin' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Sunday Fasted Weigh-In Tracker</h2>
              <p>Weigh yourself fasted immediately after waking up before drinking water or eating Meal 1.</p>
            </div>
          </div>

          <div className="client-messenger-panel">
            <form onSubmit={handleLogWeighIn} className="weigh-in-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#071a2b' }}>
                    Bodyweight (kg)
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    placeholder="e.g. 79.4" 
                    value={weighInVal} 
                    onChange={e => setWeighInVal(e.target.value)} 
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '1.1rem', fontWeight: '800' }}
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: '#071a2b' }}>
                    Physique &amp; Energy Notes
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Waist feeling tighter, high energy throughout the day" 
                    value={weighInNote} 
                    onChange={e => setWeighInNote(e.target.value)} 
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div className="messenger-submit-row">
                <button type="submit" className="btn-send-coach">
                  <Scale size={16} /> Log Fasted Weigh-In
                </button>

                {weighInNotice && (
                  <span className="msg-sent-alert">
                    <CheckCheck size={18} /> Weigh-in recorded and synced with Coach James!
                  </span>
                )}
              </div>
            </form>

            <div className="client-messages-history" style={{ marginTop: '2rem' }}>
              <div className="history-title">Your Weigh-In Progress History ({weighInList.length} Logs)</div>
              {weighInList.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.92rem' }}>No weigh-in records logged yet.</p>
              ) : (
                weighInList.map(w => (
                  <div key={w.id} className="client-message-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary, #155eef)' }}>{w.weight} kg</strong>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#334155' }}>{w.notes}</p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(w.timestamp).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: 13-WEEK TRANSFORMATION TIMELINE */}
      {activeTab === 'weeks' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Your 13-Week Transformation Roadmap</h2>
              <p>Every single week is calculated to push past plateaus and deliver guaranteed results.</p>
            </div>
          </div>

          <div className="weeks-timeline-list">
            {defaultWeeks.map(w => {
              const isSelected = selectedWeek === w.week;
              return (
                <div 
                  key={w.week} 
                  className={`week-row-card ${w.status.includes('Active') ? 'current-week' : ''} ${isSelected ? 'selected-week' : ''}`}
                  onClick={() => setSelectedWeek(w.week)}
                >
                  <div className="week-number-box">
                    <span className="week-label">WEEK</span>
                    <span className="week-num">{String(w.week).padStart(2, '0')}</span>
                  </div>

                  <div className="week-main-details">
                    <div className="week-header-row">
                      <h4>{w.title}</h4>
                      <span className={`status-badge ${w.status.includes('Active') ? 'active' : w.status.toLowerCase()}`}>
                        {w.status}
                      </span>
                    </div>
                    <p>{w.desc}</p>
                  </div>

                  <button className="btn-select-week">
                    {isSelected ? 'Viewing' : 'Select Week'} <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COACH JAMES'S RULES */}
      {activeTab === 'guidelines' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Coach James&apos;s 5 Golden Transformation Rules</h2>
              <p>Standards expected from every client who purchases the 13-Week Transformation Program.</p>
            </div>
          </div>

          <div className="guidelines-list">
            <div className="guideline-card">
              <div className="guide-num">01</div>
              <div className="guide-body">
                <h3>12 Weeks Of Discipline &bull; Zero Excuses</h3>
                <p>Results do not come from motivation; they come from discipline. Never skip a meal, never skip a planned training session, and log your weights every workout.</p>
              </div>
            </div>

            <div className="guideline-card">
              <div className="guide-num">02</div>
              <div className="guide-body">
                <h3>Follow The Meal Plan &bull; You Will Never Be Hungry</h3>
                <p>Do not improvise or starve yourself. High-satiety whole foods, fibrous greens, and calculated protein portions will keep you full all day while stripping body fat.</p>
              </div>
            </div>

            <div className="guideline-card">
              <div className="guide-num">03</div>
              <div className="guide-body">
                <h3>Form Over Weight &bull; Progressive Overload</h3>
                <p>Lifting with ego leads to injury. Execute every repetition with full range of motion and 2-second eccentric control. Calibrate fiber recruitment as demonstrated in the videos.</p>
              </div>
            </div>

            <div className="guideline-card">
              <div className="guide-num">04</div>
              <div className="guide-body">
                <h3>Sleep &amp; Recovery Are Non-Negotiable</h3>
                <p>Your muscles do not grow in the gym; they grow while you sleep. Aim for 7 to 8 hours of uninterrupted rest each night to lower cortisol and optimize fat burn.</p>
              </div>
            </div>

            <div className="guideline-card">
              <div className="guide-num">05</div>
              <div className="guide-body">
                <h3>Weekly Sunday Check-In</h3>
                <p>Send your morning fasted weigh-in and front/side/back physique photos to Coach James every Sunday morning before 10:00 AM for adjustments.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
