"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  History,
  X,
  Bell
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

  const dayIndexMap = {
    'day 1': 'mon', 'day1': 'mon', 'mon': 'mon', 'monday': 'mon',
    'day 2': 'tue', 'day2': 'tue', 'tue': 'tue', 'tuesday': 'tue',
    'day 3': 'wed', 'day3': 'wed', 'wed': 'wed', 'wednesday': 'wed',
    'day 4': 'thu', 'day4': 'thu', 'thu': 'thu', 'thursday': 'thu',
    'day 5': 'fri', 'day5': 'fri', 'fri': 'fri', 'friday': 'fri',
    'day 6': 'sat', 'day6': 'sat', 'sat': 'sat', 'saturday': 'sat',
    'day 7': 'sun', 'day7': 'sun', 'sun': 'sun', 'sunday': 'sun'
  };

  // Check if text is organized by Day (e.g. Day 1, Day 2... or Monday, Tuesday...)
  const isDayBased = /(?:[\*\#_]*\b)(?:day\s*[1-7]|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:[\*\#_]*\b)/i.test(text);

  if (isDayBased) {
    // 1. Split text into Day blocks and Guidelines
    const dayRegex = /(?:[\*\#_]*\b(day\s*[1-7]|monday|tuesday|wednesday|thursday|friday|saturday|sunday|daily\s+guidelines?|guidelines?)\b[\*\#_]*\s*[:,\-–—]*)/gi;

    let matches = [];
    let match;
    while ((match = dayRegex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        header: match[1].toLowerCase().trim(),
        fullMatchLength: match[0].length
      });
    }

    const dayBlocks = {};
    const guidelines = [];

    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const startIdx = current.index + current.fullMatchLength;
      const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : text.length;
      const content = text.substring(startIdx, endIdx).trim();

      const normalizedHeader = current.header.replace(/\s+/g, ' ');
      if (normalizedHeader.includes('guideline')) {
        guidelines.push(content);
      } else {
        const dKey = dayIndexMap[normalizedHeader];
        if (dKey) {
          dayBlocks[dKey] = content;
        }
      }
    }

    // 2. Parse meals inside each day block
    const mealRegex = /(?:^|[\n,;]|\*+)\s*(Breakfast|Morning\s*Meal|Lunch|Afternoon\s*Meal|Dinner|Evening\s*Meal|Night\s*Meal|Snack\s*\d?|Meal\s*\d?|Pre[- ]?Workout|Post[- ]?Workout)\s*[:\-–—]\s*/gi;

    const parsedDays = {};
    let maxSnacksObserved = 1;

    for (const dKey of dayKeys) {
      parsedDays[dKey] = {};
      const block = dayBlocks[dKey];
      if (!block) continue;

      let mMatches = [];
      let mMatch;
      while ((mMatch = mealRegex.exec(block)) !== null) {
        mMatches.push({
          index: mMatch.index,
          mealType: mMatch[1].trim(),
          fullMatchLength: mMatch[0].length
        });
      }

      if (mMatches.length === 0) {
        parsedDays[dKey]['general'] = block.replace(/^[•\-\*,\s]+/, '').trim();
        continue;
      }

      let snackCount = 0;
      let mealCount = 0;

      for (let j = 0; j < mMatches.length; j++) {
        const curM = mMatches[j];
        const mStart = curM.index + curM.fullMatchLength;
        const mEnd = (j + 1 < mMatches.length) ? mMatches[j + 1].index : block.length;
        let mealContent = block.substring(mStart, mEnd).trim().replace(/^[,;\*\s]+|[,;\*\s]+$/g, '');

        const typeLower = curM.mealType.toLowerCase();
        if (typeLower.includes('breakfast') || typeLower.includes('morning meal')) {
          parsedDays[dKey]['breakfast'] = mealContent;
        } else if (typeLower.includes('lunch') || typeLower.includes('afternoon meal')) {
          parsedDays[dKey]['lunch'] = mealContent;
        } else if (typeLower.includes('dinner') || typeLower.includes('evening meal') || typeLower.includes('night meal')) {
          parsedDays[dKey]['dinner'] = mealContent;
        } else if (typeLower.includes('snack')) {
          snackCount++;
          if (snackCount > maxSnacksObserved) maxSnacksObserved = snackCount;
          parsedDays[dKey][`snack_${snackCount}`] = mealContent;
        } else if (typeLower.includes('meal')) {
          mealCount++;
          parsedDays[dKey][`meal_${mealCount}`] = mealContent;
        } else {
          parsedDays[dKey][typeLower.replace(/[^a-z0-9]/g, '_')] = mealContent;
        }
      }
    }

    const hasBreakfast = dayKeys.some(k => !!parsedDays[k]?.breakfast);
    const hasLunch = dayKeys.some(k => !!parsedDays[k]?.lunch);
    const hasDinner = dayKeys.some(k => !!parsedDays[k]?.dinner);

    const slotDefinitions = [];

    if (hasBreakfast) {
      slotDefinitions.push({
        id: 'breakfast',
        title: 'Breakfast',
        time: '07:30 – 08:30 AM',
        icon: 'sunrise'
      });
    }

    if (dayKeys.some(k => !!parsedDays[k]?.snack_1)) {
      slotDefinitions.push({
        id: 'snack_1',
        title: maxSnacksObserved > 1 ? 'Mid-Morning Snack' : 'Daily Snack',
        time: '10:30 – 11:00 AM',
        icon: 'apple'
      });
    }

    if (hasLunch) {
      slotDefinitions.push({
        id: 'lunch',
        title: 'Lunch',
        time: '01:00 – 02:00 PM',
        icon: 'sun'
      });
    }

    if (dayKeys.some(k => !!parsedDays[k]?.snack_2)) {
      slotDefinitions.push({
        id: 'snack_2',
        title: 'Afternoon Snack',
        time: '04:30 – 05:00 PM',
        icon: 'coffee'
      });
    }

    if (hasDinner) {
      slotDefinitions.push({
        id: 'dinner',
        title: 'Dinner',
        time: '07:30 – 08:30 PM',
        icon: 'moon'
      });
    }

    for (let s = 3; s <= maxSnacksObserved; s++) {
      if (dayKeys.some(k => !!parsedDays[k]?.[`snack_${s}`])) {
        slotDefinitions.push({
          id: `snack_${s}`,
          title: `Evening Snack ${s}`,
          time: '09:30 – 10:00 PM',
          icon: 'coffee'
        });
      }
    }

    if (slotDefinitions.length === 0) {
      for (let m = 1; m <= 6; m++) {
        if (dayKeys.some(k => !!parsedDays[k]?.[`meal_${m}`])) {
          slotDefinitions.push({
            id: `meal_${m}`,
            title: `Meal ${m}`,
            time: `Meal Window ${m}`,
            icon: 'utensils'
          });
        }
      }
    }

    if (slotDefinitions.length === 0) {
      slotDefinitions.push({
        id: 'general_daily',
        title: 'Daily Meal Protocol',
        time: 'Prescribed Routine',
        icon: 'utensils'
      });
    }

    const sections = slotDefinitions.map(slot => {
      const days = {};
      for (const dKey of dayKeys) {
        if (parsedDays[dKey]) {
          days[dKey] = parsedDays[dKey][slot.id] || (slot.id === 'general_daily' ? parsedDays[dKey]['general'] : '');
        }
      }
      return {
        id: slot.id,
        time: slot.time,
        title: slot.title,
        days: days,
        generalItems: []
      };
    });

    return {
      is7Day: true,
      sections,
      dayKeys,
      dayNames,
      guidelines: guidelines.join('\n').replace(/^[,;\s]+/, '').trim()
    };
  }

  // -------------------------------------------------------------
  // FALLBACK: TIME-FIRST OR GENERIC FORMAT
  // -------------------------------------------------------------
  const lines = text.split('\n');
  const sections = [];
  let currentSection = null;

  const timeOrMealRegex = /^(\d{1,2}:\d{2}(?:\s*[-–—]\s*\d{1,2}:\d{2})?\s*(?:am|pm)?)\s*[-—:]\s*(.+)|^meal\s*\d+\s*(?:\([^)]+\))?\s*[-—:]?\s*(.*)/i;

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

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
        time: 'Scheduled Routine',
        title: 'Prescribed Meals',
        days: {},
        generalItems: []
      };
    }

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
    dayNames,
    guidelines: ''
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
              const foodText = sec.days[selectedDay] || (parsed.is7Day ? 'No specific meal assigned for this day' : (sec.generalItems.length > 0 ? sec.generalItems.join(', ') : 'Follow daily guidelines'));
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

          {/* COACH DIRECTIVES & GUIDELINES BANNER */}
          {parsed.guidelines && (
            <div className="schedule-guidelines-banner">
              <div className="guidelines-banner-header">
                <Shield size={16} color="#ffc928" />
                <h4>Coach James Daily Directives &amp; Guidelines</h4>
              </div>
              <div className="guidelines-list">
                {parsed.guidelines.split(/[.\n]/).map(g => g.trim().replace(/^[,;\*\-•\s]+/, '')).filter(Boolean).map((item, idx) => (
                  <div key={idx} className="guideline-pill-item">
                    <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                      const item = sec.days[dKey] || (parsed.is7Day ? '—' : (sec.generalItems.length > 0 ? sec.generalItems.join(', ') : '—'));
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

          {/* COACH DIRECTIVES & GUIDELINES BANNER IN MATRIX VIEW */}
          {parsed.guidelines && (
            <div className="schedule-guidelines-banner">
              <div className="guidelines-banner-header">
                <Shield size={16} color="#ffc928" />
                <h4>Coach James Daily Directives &amp; Guidelines</h4>
              </div>
              <div className="guidelines-list">
                {parsed.guidelines.split(/[.\n]/).map(g => g.trim().replace(/^[,;\*\-•\s]+/, '')).filter(Boolean).map((item, idx) => (
                  <div key={idx} className="guideline-pill-item">
                    <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
// CLIENT RESOURCES EXTRACTOR (Strict Isolation: Only returns resources for the authenticated client)
// =========================================================================
function extractClientResources(allResources, clientObj) {
  if (!clientObj || !clientObj.id) return [];

  // Strictly match resources assigned to this specific client
  const list = (allResources || []).filter(r => {
    if (!r) return false;
    if (r.client_id && String(r.client_id) === String(clientObj.id)) return true;
    if (r.client_pin && clientObj.pin_code && String(r.client_pin).trim() === String(clientObj.pin_code).trim()) return true;
    return false;
  });

  // Deduplicate by ID, keeping the most recently updated version
  const map = new Map();
  list.forEach(item => {
    if (item && item.id) {
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, item);
      } else {
        const existingTime = new Date(existing.updated_at || existing.created_at || 0).getTime();
        const newTime = new Date(item.updated_at || item.created_at || 0).getTime();
        if (newTime > existingTime) {
          map.set(item.id, item);
        }
      }
    }
  });

  return Array.from(map.values());
}

// =========================================================================
// CRISP AUDIO CHIME FOR REAL-TIME COACH DIRECTIVES & UPLOADS
// =========================================================================
function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First note: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.32);

    // Second note: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);
  } catch (e) {
    // Non-blocking fallback
  }
}

export default function ResourcesPage() {
  const [pin, setPin] = useState('');
  const [client, setClient] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('meal_plan'); // meal_plan, videos, messenger, weeks, guidelines
  const activeTabRef = useRef('meal_plan');

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Live Toast & Audio Notification State
  const [liveNotice, setLiveNotice] = useState(null); // { id, title, subtitle, targetTab, icon }
  const [notifications, setNotifications] = useState([]);
  const seenResourceIdsRef = useRef(new Set());
  const seenMessageIdsRef = useRef(new Set());

  // Client to Coach Messenger State
  const [clientMsgText, setClientMsgText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [msgSentNotice, setMsgSentNotice] = useState(false);

  // Daily Meal Checklist & Adherence State
  const [eatenMeals, setEatenMeals] = useState({});

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

  // Real-time synchronization of Coach uploads, weekly roadmap & 2-way chat messages
  const syncData = async () => {
    if (!client) return;

    try {
      // 1. Live Fetch Resources from Supabase & LocalStorage
      let dbRes = [];
      try {
        const { data } = await supabase
          .from('resources')
          .select('*')
          .or(`client_id.eq.${client.id},client_pin.eq.${client.pin_code}`)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) dbRes = data;
      } catch (e) { }

      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const combinedRes = extractClientResources([...dbRes, ...localRes], client);

      // Load seen resources from local storage if empty to support offline missed notifications
      if (seenResourceIdsRef.current.size === 0) {
        const savedSeenRes = JSON.parse(localStorage.getItem('wfz_seen_res_' + client.id) || '[]');
        savedSeenRes.forEach(id => seenResourceIdsRef.current.add(id));
      }

      // Check if Coach James just uploaded a new Meal Plan or Exercise Video or Edited one!
      if (seenResourceIdsRef.current.size > 0) {
        // Collect ALL newly added items since last login
        const newlyAddedItems = combinedRes.filter(r => {
          if (!r || !r.id) return false;
          const trackingKey = r.id + "_" + (r.updated_at || r.created_at || "");
          return !seenResourceIdsRef.current.has(trackingKey);
        });

        if (newlyAddedItems.length > 0) {
          playNotificationSound();
          
          // Add them all to notification history
          newlyAddedItems.forEach((newlyAdded, index) => {
            const isMealPlan = newlyAdded.category === 'meal_plan' || newlyAdded.format === 'text' || newlyAdded.type === 'meal_plan';
            const isVideo = newlyAdded.format === 'video' || newlyAdded.type === 'routine_video';
            const targetTab = isMealPlan ? 'meal_plan' : (isVideo ? 'videos' : 'meal_plan');
            const title = isMealPlan
              ? "Coach James updated your Meal Plan!"
              : (isVideo ? "New Exercise Video Uploaded!" : "New Coaching Directive Assigned!");
            const icon = isMealPlan ? "🥗" : (isVideo ? "🎥" : "⚡");

            const noticeObj = {
              id: newlyAdded.id + "_" + Date.now(),
              title,
              subtitle: newlyAdded.title || "Tap here to review your newly assigned protocol immediately.",
              targetTab,
              icon
            };

            // Only show the live popup for the first/most recent one
            if (index === 0) setLiveNotice(noticeObj);

            setNotifications(prev => {
              const updated = [{ ...noticeObj, timestamp: new Date().toISOString(), isRead: false }, ...prev].slice(0, 50);
              localStorage.setItem('LOCAL_NOTIFS_' + client.id, JSON.stringify(updated));
              return updated;
            });
          });
        }
      }

      // Update seen resources and save to localStorage
      combinedRes.forEach(r => {
        if (r?.id) {
          const trackingKey = r.id + "_" + (r.updated_at || r.created_at || "");
          seenResourceIdsRef.current.add(trackingKey);
        }
      });
      localStorage.setItem('wfz_seen_res_' + client.id, JSON.stringify(Array.from(seenResourceIdsRef.current)));

      setResources(combinedRes);

      // 2. Live Fetch Messages from Supabase & LocalStorage (Never delete any message history!)
      let dbMsgs = [];
      try {
        const { data } = await supabase
          .from('client_messages')
          .select('*')
          .or(`client_id.eq.${client.id},client_pin.eq.${client.pin_code}`)
          .order('timestamp', { ascending: true });
        if (data && data.length > 0) dbMsgs = data;
      } catch (e) { }

      const localMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      const filteredLocalMsgs = localMsgs.filter(m => m.client_pin === client.pin_code || m.client_id === client.id);

      const msgMap = new Map();
      [...filteredLocalMsgs, ...dbMsgs].forEach(m => {
        if (m && m.id) msgMap.set(m.id, m);
      });
      const combinedMsgs = Array.from(msgMap.values()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Load seen messages from local storage if empty to support offline missed notifications
      if (seenMessageIdsRef.current.size === 0) {
        const savedSeenMsgs = JSON.parse(localStorage.getItem('wfz_seen_msg_' + client.id) || '[]');
        savedSeenMsgs.forEach(id => seenMessageIdsRef.current.add(id));
      }

      // Check if Coach James just sent a direct reply!
      if (seenMessageIdsRef.current.size > 0) {
        // Collect ALL newly added coach messages since last login
        const newCoachMsgs = combinedMsgs.filter(m => m && m.id && m.sender === 'coach' && !seenMessageIdsRef.current.has(m.id));
        
        if (newCoachMsgs.length > 0) {
          if (activeTabRef.current !== 'messenger') {
            playNotificationSound();
            
            newCoachMsgs.forEach((newCoachMsg, index) => {
              const noticeObj = {
                id: newCoachMsg.id,
                title: "New Message from Coach James!",
                subtitle: newCoachMsg.text ? (newCoachMsg.text.length > 60 ? newCoachMsg.text.slice(0, 60) + '...' : newCoachMsg.text) : "Direct message received in your private thread.",
                targetTab: 'messenger',
                icon: "💬"
              };

              if (index === 0) setLiveNotice(noticeObj);

              setNotifications(prev => {
                const exists = prev.some(n => n.id === noticeObj.id);
                if (exists) return prev;
                const updated = [{ ...noticeObj, timestamp: new Date().toISOString(), isRead: false }, ...prev].slice(0, 50);
                localStorage.setItem('LOCAL_NOTIFS_' + client.id, JSON.stringify(updated));
                return updated;
              });
            });
          }
        }
      }

      combinedMsgs.forEach(m => {
        if (m && m.id) seenMessageIdsRef.current.add(m.id);
      });
      localStorage.setItem('wfz_seen_msg_' + client.id, JSON.stringify(Array.from(seenMessageIdsRef.current)));

      setChatMessages(combinedMsgs);

      // 3. Live Sync Client Macros & Real-time Transformation Week
      let dbClient = null;
      try {
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('pin_code', client.pin_code)
          .single();
        if (data) dbClient = data;
      } catch (e) { }

      const allClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
      const localUpdatedClient = allClients.find(c => c.pin_code === client.pin_code || c.id === client.id);
      const activeData = dbClient || localUpdatedClient;

      if (activeData) {
        let profileChanged = false;
        let changeDetails = "Your profile has been updated by Coach James.";

        if (
          client.calories !== activeData.calories ||
          client.protein !== activeData.protein ||
          client.carbs !== activeData.carbs ||
          client.fats !== activeData.fats ||
          client.water !== activeData.water
        ) {
          profileChanged = true;
          changeDetails = "Coach James updated your daily macronutrient targets.";
        } else if (client.current_week !== activeData.current_week) {
          profileChanged = true;
          changeDetails = `You have progressed to Week ${activeData.current_week}!`;
        }

        if (profileChanged) {
          playNotificationSound();
          const noticeObj = {
            id: 'client_update_' + Date.now(),
            title: "Profile & Targets Updated",
            subtitle: changeDetails,
            targetTab: 'weeks',
            icon: "🔥"
          };
          setLiveNotice(noticeObj);
          setNotifications(prev => {
            const updated = [{ ...noticeObj, timestamp: new Date().toISOString(), isRead: false }, ...prev].slice(0, 50);
            localStorage.setItem('LOCAL_NOTIFS_' + client.id, JSON.stringify(updated));
            return updated;
          });
        }

        setClient(prev => {
          if (!prev) return activeData;
          if (
            prev.calories !== activeData.calories ||
            prev.protein !== activeData.protein ||
            prev.carbs !== activeData.carbs ||
            prev.fats !== activeData.fats ||
            prev.water !== activeData.water ||
            prev.current_week !== activeData.current_week ||
            prev.name !== activeData.name
          ) {
            if (activeData.current_week && activeData.current_week !== prev.current_week) {
              setSelectedWeek(Number(activeData.current_week));
            }
            return { ...prev, ...activeData };
          }
          return prev;
        });
      }

      const savedEaten = JSON.parse(localStorage.getItem('wfz_eaten_' + client.id) || '{}');
      setEatenMeals(savedEaten);

    } catch (err) {
      console.warn("syncData error note:", err);
    }
  };

  useEffect(() => {
    syncData();

    // Fast polling every 5 seconds for instant cross-device updates
    const pollInterval = setInterval(() => {
      syncData();
    }, 5000);

    // Cross-tab real-time sync with Admin Dashboard
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('wfz_')) {
        syncData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [client]);

  // Live notice will now persist until the user explicitly clicks it or dismisses it
  useEffect(() => {
    // Intentionally removed auto-dismiss timeout based on user feedback
  }, [liveNotice]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanPin = pin.trim();
    if (!cleanPin) {
      setErrorMsg('Please enter your private PIN code.');
      setLoading(false);
      return;
    }

    // 1. Check Supabase
    try {
      const { data: clientRows, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('pin_code', cleanPin);

      if (!clientError && clientRows && clientRows.length > 0) {
        const clientData = clientRows[0];
        const activeClientObj = {
          ...clientData,
          current_week: Number(clientData.current_week) || 1,
          coach: clientData.coach || "Head Coach James (London)"
        };
        setClient(activeClientObj);

        // Fetch Resources
        const { data: resData } = await supabase
          .from('resources')
          .select('*')
          .or(`client_id.eq.${clientData.id},client_pin.eq.${clientData.pin_code}`)
          .order('created_at', { ascending: false });

        const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
        const clientLocalRes = extractClientResources([...(resData || []), ...localRes], activeClientObj);
        setResources(clientLocalRes);

        // Don't mark items created/updated in the last 60 seconds as 'seen', so they trigger a notification upon login!
        const seenIds = clientLocalRes
          .filter(r => (Date.now() - new Date(r.updated_at || r.created_at).getTime()) > 60000)
          .map(r => r.id + "_" + (r.updated_at || r.created_at || ""));
        seenResourceIdsRef.current = new Set(seenIds);

        // Fetch Messages without deleting any history
        const { data: mData } = await supabase
          .from('client_messages')
          .select('*')
          .or(`client_id.eq.${clientData.id},client_pin.eq.${clientData.pin_code}`)
          .order('timestamp', { ascending: true });

        const localMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
        const filteredLocalMsgs = localMsgs.filter(m => m.client_pin === clientData.pin_code || m.client_id === clientData.id);
        const msgMap = new Map();
        [...filteredLocalMsgs, ...(mData || [])].forEach(m => {
          if (m && m.id) msgMap.set(m.id, m);
        });
        const combinedMsgs = Array.from(msgMap.values()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setChatMessages(combinedMsgs);
        seenMessageIdsRef.current = new Set(combinedMsgs.map(m => m.id));

        setSelectedWeek(Number(activeClientObj.current_week) || 1);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Supabase lookup note:", err?.message);
    }

    // 2. Check LocalStorage registered clients
    const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
    const matchedClient = localClients.find(c => c.pin_code === cleanPin);

    if (matchedClient) {
      const activeClientObj = {
        ...matchedClient,
        current_week: Number(matchedClient.current_week) || 1,
        coach: matchedClient.coach || "Head Coach James (London)"
      };
      setClient(activeClientObj);

      // Load notifications for local client
      const storedNotifs = JSON.parse(localStorage.getItem('LOCAL_NOTIFS_' + matchedClient.id) || '[]');
      setNotifications(storedNotifs);

      const localRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const clientLocalRes = extractClientResources(localRes, activeClientObj);
      setResources(clientLocalRes);

      // Don't mark items created/updated in the last 60 seconds as 'seen', so they trigger a notification upon login!
      const seenIds = clientLocalRes
        .filter(r => (Date.now() - new Date(r.updated_at || r.created_at).getTime()) > 60000)
        .map(r => r.id + "_" + (r.updated_at || r.created_at || ""));
      seenResourceIdsRef.current = new Set(seenIds);

      const localMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      const filteredLocalMsgs = localMsgs.filter(m => m.client_pin === matchedClient.pin_code || m.client_id === matchedClient.id);
      setChatMessages(filteredLocalMsgs);
      seenMessageIdsRef.current = new Set(filteredLocalMsgs.map(m => m.id));

      setSelectedWeek(Number(activeClientObj.current_week) || 1);
      setLoading(false);
      return;
    }

    // 3. Strict: Invalid PIN (No accidental logins into someone else's account!)
    setErrorMsg('Invalid PIN code. Please enter the private PIN code assigned to you by Coach James.');
    setLoading(false);
  };

  const handleLogout = () => {
    setClient(null);
    setResources([]);
    setPin('');
    seenResourceIdsRef.current = new Set();
    seenMessageIdsRef.current = new Set();
    setLiveNotice(null);
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
    } catch (e) { }

    const allMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    allMsgs.push(newMsg);
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(allMsgs));

    setChatMessages(prev => [...prev, newMsg]);
    setClientMsgText('');
    setMsgSentNotice(true);
    setTimeout(() => setMsgSentNotice(false), 4000);
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
                placeholder="Enter your 4-6 digit private PIN"
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

          <div className="login-security-notice" style={{ marginTop: '1.25rem', padding: '0.8rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Shield size={18} color="#155eef" />
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
              Encrypted Private Access &bull; Use the personal PIN provided by Coach James.
            </span>
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

      {/* REAL-TIME AUDIO & VISUAL NOTIFICATION TOAST */}
      {liveNotice && (
        <div
          className="live-notification-toast"
          onClick={() => {
            setActiveTab(liveNotice.targetTab);
            setLiveNotice(null);
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }}
          role="alert"
        >
          <div className="live-toast-icon-wrap">
            <span className="live-toast-emoji">{liveNotice.icon || "🔔"}</span>
            <span className="live-toast-ping"></span>
          </div>
          <div className="live-toast-content">
            <div className="live-toast-header">
              <strong>{liveNotice.title}</strong>
              <span className="live-toast-tag">NEW DIRECTIVE</span>
            </div>
            <p className="live-toast-subtitle">{liveNotice.subtitle}</p>
            <div className="live-toast-cta">
              <span>Click to view {liveNotice.targetTab === 'meal_plan' ? 'Meal Plan' : liveNotice.targetTab === 'videos' ? 'Exercise Videos' : 'Messages'} immediately &rarr;</span>
            </div>
          </div>
          <button
            type="button"
            className="live-toast-dismiss"
            onClick={(e) => {
              e.stopPropagation();
              setLiveNotice(null);
            }}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

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

          <button
            className="btn-print-plan"
            onClick={() => {
              setActiveTab('notifications');
              setNotifications(prev => {
                const updated = prev.map(n => ({ ...n, isRead: true }));
                localStorage.setItem('LOCAL_NOTIFS_' + client.id, JSON.stringify(updated));
                return updated;
              });
            }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '50px', background: '#fff', color: '#475569', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            title="View Notification History"
          >
            <Bell size={15} /> Notifications
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '0.15rem 0.35rem', fontSize: '0.6rem', fontWeight: 'bold', border: '2px solid #fff' }}>
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
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

      {/* TAB CONTENT 6: NOTIFICATIONS HISTORY */}
      {activeTab === 'notifications' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Your Notification History</h2>
              <p>Keep track of all new plans, changes, and messages from Coach James.</p>
            </div>
            {notifications.length > 0 && (
              <button onClick={() => {
                setNotifications([]);
                localStorage.removeItem('LOCAL_NOTIFS_' + client.id);
              }} style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Clear All
              </button>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px' }}>
                <Bell size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} onClick={() => setActiveTab(n.targetTab)} style={{ background: n.isRead ? '#f8fafc' : '#fff', border: n.isRead ? '1px solid #e2e8f0' : '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: n.isRead ? 'none' : '0 4px 12px rgba(59,130,246,0.08)' }}>
                  <div style={{ fontSize: '1.5rem' }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0f172a' }}>{n.title}</strong>
                      <small style={{ color: '#94a3b8' }}>{new Date(n.timestamp).toLocaleString()}</small>
                    </div>
                    <p style={{ margin: '0.3rem 0 0.5rem 0', color: '#475569', fontSize: '0.9rem' }}>{n.subtitle}</p>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      View Details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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

      {/* TAB CONTENT: 13-WEEK TRANSFORMATION TIMELINE (DYNAMIC REAL-TIME PROGRESSION) */}
      {activeTab === 'weeks' && (
        <div className="tab-pane-container">
          <div className="pane-header">
            <div>
              <h2>Your 13-Week Transformation Roadmap</h2>
              <p>Current Stage: <strong>Week {Number(client?.current_week) || 1} of 13</strong> &bull; Every single week is calculated to push past plateaus and deliver guaranteed results.</p>
            </div>
            <div className="coach-quote-pill">
              <Sparkles size={16} />
              <span>{client?.name}&apos;s Active Routine &bull; Week {Number(client?.current_week) || 1}</span>
            </div>
          </div>

          <div className="weeks-timeline-list">
            {defaultWeeks.map(w => {
              const currentWeekNum = Number(client?.current_week) || 1;
              const isSelected = selectedWeek === w.week;
              const isCurrent = w.week === currentWeekNum;
              const isCompleted = w.week < currentWeekNum;

              let weekStatus = 'Upcoming';
              if (isCompleted) weekStatus = 'Completed';
              if (isCurrent) weekStatus = 'Active (Current)';

              return (
                <div
                  key={w.week}
                  className={`week-row-card ${isCurrent ? 'current-week' : ''} ${isCompleted ? 'completed-week' : ''} ${isSelected ? 'selected-week' : ''}`}
                  onClick={() => setSelectedWeek(w.week)}
                >
                  <div className="week-number-box">
                    <span className="week-label">WEEK</span>
                    <span className="week-num">{String(w.week).padStart(2, '0')}</span>
                  </div>

                  <div className="week-main-details">
                    <div className="week-header-row">
                      <h4>{w.title}</h4>
                      <span className={`status-badge ${isCurrent ? 'active' : (isCompleted ? 'completed' : 'upcoming')}`}>
                        {weekStatus}
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
