"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Lock, 
  Key, 
  Shield,
  ShieldCheck, 
  UserPlus, 
  PlusCircle, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  Utensils, 
  CheckCircle2, 
  Eye,
  MessageSquare,
  Send,
  Reply,
  Calendar,
  Sparkles,
  Flame,
  Scale,
  CheckCheck,
  Award,
  Users,
  Layers,
  Zap,
  FolderOpen,
  History,
  GitCompare,
  RotateCcw,
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  Printer,
  LayoutGrid
} from 'lucide-react';
import './admin.css';

const ADMIN_STORAGE_KEY = 'wfz_admin_auth';
const LOCAL_CLIENTS_KEY = 'wfz_local_clients';
const LOCAL_RESOURCES_KEY = 'wfz_local_resources';
const LOCAL_MESSAGES_KEY = 'wfz_client_messages';
const LOCAL_WEIGHINS_KEY = 'wfz_client_weighins';

// =========================================================================
// SMART MEAL PLAN PARSER FOR ADMIN AUDIT
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
// CLEAN ORGANIZED MEAL SCHEDULE (DAY-BY-DAY & 7-DAY MATRIX)
// =========================================================================
function OrganizedMealSchedule({ plan, client, defaultMatrix = true }) {
  const parsed = useMemo(() => parseCoachMealPlan(plan.content_text), [plan.content_text]);

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()] || 'mon';
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [viewMode, setViewMode] = useState(defaultMatrix ? 'matrix' : 'daily');

  if (!parsed || !parsed.sections || parsed.sections.length === 0) {
    return (
      <div className="custom-written-plan-card">
        <div className="written-plan-badge"><FileText size={14} /> Coach James Custom Directives</div>
        <h3 className="written-plan-title">{plan.title}</h3>
        <div className="written-plan-text">{plan.content_text}</div>
      </div>
    );
  }

  return (
    <div className="organized-meal-schedule-card">
      <div className="schedule-header-wrap">
        <div className="schedule-title-meta">
          <div className="written-plan-badge">
            <Sparkles size={14} /> Coach James Custom Directives &bull; Active Protocol
          </div>
          <h2 className="schedule-main-title">{plan.title || "Week 1 Plan — 7-Day Precision Meal Protocol"}</h2>
          <div className="written-plan-meta">
            <span><strong>Client:</strong> {client.name}</span>
            <span>&bull;</span>
            <span><strong>Daily Target:</strong> {plan.macros_snapshot?.calories || client.calories || 2350} kcal &bull; {plan.macros_snapshot?.protein || client.protein || '185g'} Protein</span>
            <span>&bull;</span>
            <span><strong>Updated:</strong> {new Date(plan.assigned_at || plan.created_at || Date.now()).toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        <div className="schedule-view-switcher">
          <button 
            type="button" 
            className={`schedule-view-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            <Clock size={15} /> 1. Day-by-Day View
          </button>
          <button 
            type="button" 
            className={`schedule-view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
            onClick={() => setViewMode('matrix')}
          >
            <LayoutGrid size={15} /> 2. Full 7-Day Matrix
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

      {viewMode === 'daily' && (
        <div className="daily-view-container">
          <div className="schedule-days-bar">
            <span className="select-day-label">Select Day:</span>
            {parsed.dayKeys.map(dKey => {
              const isSelected = selectedDay === dKey;
              const isToday = todayKey === dKey;

              return (
                <button
                  key={dKey}
                  type="button"
                  className={`day-pill-btn ${isSelected ? 'active' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={() => setSelectedDay(dKey)}
                >
                  {isToday && <span className="today-badge">TODAY</span>}
                  <span className="day-name-full">{parsed.dayNames[dKey]}</span>
                </button>
              );
            })}
          </div>

          <div className="daily-meals-timeline">
            {parsed.sections.map((sec) => {
              const foodText = sec.days[selectedDay] || (parsed.is7Day ? 'No specific meal assigned for this day' : (sec.generalItems.length > 0 ? sec.generalItems.join(', ') : 'Follow daily guidelines'));

              return (
                <div key={sec.id} className="daily-meal-card">
                  <div className="daily-meal-top-row">
                    <div className="meal-time-tag">
                      <Clock size={14} />
                      <strong>{sec.time}</strong>
                      <span className="meal-category-pill">{sec.title}</span>
                    </div>
                  </div>

                  <div className="meal-food-content-row">
                    <div className="food-main-text">
                      <p>{foodText}</p>
                    </div>
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

                      return (
                        <td key={dKey} className={`matrix-food-cell ${dKey === todayKey ? 'today-col' : ''}`}>
                          <div className="matrix-food-text">{item}</div>
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Top Admin Tab Navigation
  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'chat', 'clients', 'weighins', 'resources'

  const [clients, setClients] = useState([]);
  const [resources, setResources] = useState([]);
  const [messages, setMessages] = useState([]);
  const [weighIns, setWeighIns] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Client & Macro Assignment Form
  const [clientFormMode, setClientFormMode] = useState('register'); // 'register' or 'update_macros'
  const [selectedClientToEdit, setSelectedClientToEdit] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPin, setClientPin] = useState('');
  const [clientProgram, setClientProgram] = useState('13-Week Transformation & 30-Day Meal Plan');
  const [clientCalories, setClientCalories] = useState('2450');
  const [clientProtein, setClientProtein] = useState('190g');
  const [clientCarbs, setClientCarbs] = useState('220g');
  const [clientFats, setClientFats] = useState('55g');
  const [clientWater, setClientWater] = useState('3.5L');
  const [clientCurrentWeek, setClientCurrentWeek] = useState(1);

  // New Resource Form
  const [resClientId, setResClientId] = useState('');
  const [resTitle, setResTitle] = useState('');
  const [resFormat, setResFormat] = useState('text'); // text, video, image
  const [resCategory, setResCategory] = useState('meal_plan'); // meal_plan, routine_video, coach_note
  const [resTextContent, setResTextContent] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resChangeNotes, setResChangeNotes] = useState('');
  const [resLayout, setResLayout] = useState('layout_a');
  const [editingResourceId, setEditingResourceId] = useState(null);

  // File Upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Dedicated Chat Active Client Selection
  const [chatActiveClientId, setChatActiveClientId] = useState('demo-client-1');
  const [chatReplyText, setChatReplyText] = useState('');
  
  // Resource Filter
  const [filterResClientId, setFilterResClientId] = useState('');

  // Diet History & Audit Trail State ("Pehle vs Ab")
  const [selectedAuditClientId, setSelectedAuditClientId] = useState('client-zain-1');
  const [diffModal, setDiffModal] = useState({
    isOpen: false,
    prevPlan: null,
    currPlan: null,
    client: null
  });

  useEffect(() => {
    // Check existing session
    const savedAuth = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }

    // Live Cross-Tab Synchronization
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('wfz_')) {
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const cleanPass = passwordInput.trim();
    // Master admin password: wrldfitzone!
    if (
      cleanPass === 'wrldfitzone!' || 
      cleanPass.toLowerCase() === 'wrldfitzone!' || 
      cleanPass.toLowerCase() === 'wrldfitzone' ||
      cleanPass.toLowerCase() === 'worldfitzone!' ||
      cleanPass.toLowerCase() === 'worldfitzone' ||
      cleanPass.toLowerCase() === 'james2026' || 
      cleanPass.toLowerCase() === 'admin123'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setAuthError('');
      fetchData();
    } else {
      setAuthError('Incorrect Admin Password. (Master Password: wrldfitzone!)');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setPasswordInput('');
  };

  const fetchData = async () => {
    setLoading(true);

    let fetchedClients = [];
    let fetchedResources = [];
    let fetchedMessages = [];
    let fetchedWeighIns = [];

    // 1. Try Supabase
    try {
      const { data: cData } = await supabase.from('clients').select('*');
      if (cData && cData.length > 0) fetchedClients = cData;

      const { data: rData } = await supabase.from('resources').select('*');
      if (rData && rData.length > 0) fetchedResources = rData;

      const { data: mData } = await supabase.from('client_messages').select('*').order('timestamp', { ascending: true });
      if (mData && mData.length > 0) fetchedMessages = mData;

      const { data: wData } = await supabase.from('weigh_ins').select('*').order('timestamp', { ascending: false });
      if (wData && wData.length > 0) fetchedWeighIns = wData;
    } catch (err) {
      console.warn("Supabase fetch note:", err);
    }

    // 2. Load LocalStorage fallback records
    const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
    const localResources = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
    const localMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    const localWeighIns = JSON.parse(localStorage.getItem(LOCAL_WEIGHINS_KEY) || '[]');

    // Default demo clients (Marcus T. & Zain)
    if (!localClients.some(c => c.name?.toLowerCase() === 'zain' || c.pin_code === '78601')) {
      localClients.unshift({
        id: "client-zain-1",
        name: "Zain",
        pin_code: "78601",
        program: "13-Week Transformation (Week 1 Active)",
        calories: 2350,
        protein: "185g",
        carbs: "210g",
        fats: "55g",
        water: "3.5L"
      });
      localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(localClients));
    }

    if (!localClients.some(c => c.pin_code === '12345')) {
      localClients.push({
        id: "demo-client-1",
        name: "Marcus T.",
        pin_code: "12345",
        program: "13-Week Transformation & 30-Day Meal Plan",
        calories: 2450,
        protein: "190g",
        carbs: "220g",
        fats: "55g",
        water: "3.5L"
      });
      localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(localClients));
    }

    // Seed Zain's 7-Day Meal Plan (Active Protocol)
    if (!localResources.some(r => r.client_id === 'client-zain-1' && r.title?.includes('Week 1 Plan'))) {
      localResources.unshift({
        id: "res-zain-week1",
        client_id: "client-zain-1",
        title: "Week 1 Plan — 7-Day Precision Meal Protocol",
        category: "meal_plan",
        type: "meal_plan",
        format: "text",
        status: "active",
        version: 2,
        change_notes: "Week 1 progression: 2,350 kcal whole-food split, higher protein (185g) for recovery & timed carbs",
        macros_snapshot: {
          calories: 2350,
          protein: "185g",
          carbs: "210g",
          fats: "55g",
          water: "3.5L"
        },
        assigned_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        content_text: `Coach James Custom Directives
Week 1 Plan — 7-Day Precision Meal Protocol
Assigned to: Zain • Updated: 12/09/2026
Daily Targets: 2,350 kcal | 185g Protein | 210g Carbs | 55g Fats

7:30 AM — Breakfast
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
Milk or plain yogurt if you're hungry.`
      });
      localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(localResources));
    }

    // Seed Zain's Prior Baseline Plan ("Pehle Kya Diya Tha" - Archived Protocol)
    if (!localResources.some(r => r.client_id === 'client-zain-1' && r.title?.includes('Baseline'))) {
      localResources.push({
        id: "res-zain-baseline",
        client_id: "client-zain-1",
        title: "Pre-Transformation Baseline Diet Assessment",
        category: "meal_plan",
        type: "meal_plan",
        format: "text",
        status: "archived",
        version: 1,
        change_notes: "Initial intake assessment: Calibrating baseline metabolic rate before Week 1 deficit",
        macros_snapshot: {
          calories: 2500,
          protein: "165g",
          carbs: "250g",
          fats: "65g",
          water: "3.0L"
        },
        assigned_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
        created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
        content_text: `Initial Intake Baseline Diet:
Breakfast (8:00 AM): 3 Whole eggs scrambled + 2 whole wheat roti + chai
Lunch (1:30 PM): Chicken curry (150g) + 2 roti + mixed cucumber salad
Snack (5:00 PM): 1 Apple + 15 almonds
Dinner (8:30 PM): Daal or grilled chicken + 1 roti + fresh salad
Hydration: 3.0 Litres water daily`
      });
      localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(localResources));
    }

    // Seed a demo message if empty
    if (localMessages.length === 0) {
      localMessages.push({
        id: "msg-demo-1",
        client_id: "demo-client-1",
        client_name: "Marcus T.",
        client_pin: "12345",
        sender: "client",
        sender_name: "Marcus T.",
        text: "Coach James, Sunday weigh-in was 79.4kg (down 1.2kg). Leg session was intense. Should I keep carbs at 220g or lower on rest days?",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: "Delivered"
      });
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(localMessages));
    }

    // Seed a demo weigh-in if empty
    if (localWeighIns.length === 0) {
      localWeighIns.push({
        id: "w-1",
        client_id: "demo-client-1",
        client_name: "Marcus T.",
        weight: "79.4",
        notes: "Morning fasted weigh-in. Down from 80.6kg baseline.",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      });
      localStorage.setItem(LOCAL_WEIGHINS_KEY, JSON.stringify(localWeighIns));
    }

    const combinedClients = [...fetchedClients, ...localClients.filter(lc => !fetchedClients.some(fc => fc.id === lc.id || fc.pin_code === lc.pin_code))];
    const combinedResources = [...fetchedResources, ...localResources.filter(lr => !fetchedResources.some(fr => fr.id === lr.id))];
    const combinedMessages = [...fetchedMessages, ...localMessages.filter(lm => !fetchedMessages.some(fm => fm.id === lm.id))];
    const combinedWeighIns = [...fetchedWeighIns, ...localWeighIns.filter(lw => !fetchedWeighIns.some(fw => fw.id === lw.id))];

    setClients(combinedClients);
    setResources(combinedResources);
    setMessages(combinedMessages);
    setWeighIns(combinedWeighIns);

    if (combinedClients.length > 0 && !resClientId) {
      setResClientId(combinedClients[0].id);
    }
    if (combinedClients.length > 0 && !chatActiveClientId) {
      setChatActiveClientId(combinedClients[0].id);
    }

    setLoading(false);
  };

  // Quick Macro Presets
  const applyMacroPreset = (type) => {
    if (type === 'cut') {
      setClientCalories('1950');
      setClientProtein('200g');
      setClientCarbs('160g');
      setClientFats('50g');
      setClientWater('3.5L');
    } else if (type === 'recomp') {
      setClientCalories('2450');
      setClientProtein('190g');
      setClientCarbs('220g');
      setClientFats('55g');
      setClientWater('3.5L');
    } else if (type === 'bulk') {
      setClientCalories('2900');
      setClientProtein('210g');
      setClientCarbs('340g');
      setClientFats('70g');
      setClientWater('4.0L');
    }
  };

  // Quick Diet Plan Templates
  const applyDietTemplate = (templateType) => {
    if (templateType === 'standard') {
      setResTitle('Week 4 Complete Daily Meal Protocol');
      setResFormat('text');
      setResCategory('meal_plan');
      setResTextContent(`MEAL 1 (08:00 AM) — Metabolic Kickstart:
• 4 Whole Organic Eggs scramble
• 80g Rolled Oats with Blueberries & Cinnamon
• 1 Scoop Whey Isolate in Water
Macros: 45g Protein | 55g Carbs | 14g Fats (520 kcal)

MEAL 2 (12:30 PM) — High-Performance Lunch:
• 200g Grilled Chicken Breast
• 160g Steamed Jasmine Rice
• Steamed Broccoli & 1/2 Avocado
Macros: 52g Protein | 62g Carbs | 12g Fats (560 kcal)

MEAL 3 (04:30 PM) — Post-Workout Refuel:
• 1 Scoop Whey Isolate with Almond Milk
• 2 Salted Rice Cakes with Raw Organic Honey
• 1 Medium Banana
Macros: 32g Protein | 46g Carbs | 3g Fats (340 kcal)

MEAL 4 (08:00 PM) — Lean Recovery Dinner:
• 220g Wild Scottish Salmon or Lean Sirloin
• 200g Roasted Sweet Potato with Olive Oil
• Grilled Green Asparagus spears
Macros: 50g Protein | 42g Carbs | 18g Fats (530 kcal)

DAILY STANDARD:
• 3.5 Litres of Clean Water
• 5g Creatine Monohydrate with Meal 3
• Minimum 7.5 hours deep sleep`);
    } else if (templateType === 'lowcarb') {
      setResTitle('Rest Day Fat-Shred Low-Carb Protocol');
      setResFormat('text');
      setResCategory('meal_plan');
      setResTextContent(`REST DAY LOW-CARB MEAL PLAN:
Meal 1: 5 Egg Omelette with Spinach & 30g Feta (40g P / 4g C / 20g F)
Meal 2: 220g Rump Steak with Asparagus & Olive Oil Salad (55g P / 6g C / 22g F)
Meal 3: 200g Greek Yogurt 0% with 30g Crushed Walnuts (28g P / 10g C / 18g F)
Meal 4: 250g White Fish (Cod or Sea Bass) with Steamed Greens (52g P / 5g C / 8g F)

Cardio: 45 minutes fasted zone 2 incline walking.
Water: 4 Litres minimum today.`);
    } else if (templateType === 'refeed') {
      setResTitle('High-Carb Glycogen Super-Compensation Refeed');
      setResFormat('text');
      setResCategory('meal_plan');
      setResTextContent(`REFEED DAY NUTRITION DIRECTIVE:
Today we re-saturate your muscle glycogen stores.
Keep fats under 35g for the entire day.

Meal 1: 100g Cream of Rice with 1 Scoop Whey & 1 Sliced Banana (35g P / 85g C / 3g F)
Meal 2: 220g Chicken Breast with 220g Cooked White Jasmine Rice (50g P / 70g C / 4g F)
Meal 3 (Post-Lift): 60g Dextrose or Gummy Bears with 40g Whey Isolate (36g P / 65g C / 1g F)
Meal 4: 200g Lean Turkey Mince with 350g Baked White Potato (48g P / 75g C / 5g F)

Drink plenty of water with sea salt to pull water directly into the muscle belly!`);
    } else if (templateType === 'zain_week1') {
      setResTitle('Week 1 Plan — 7-Day Precision Meal Protocol');
      setResFormat('text');
      setResCategory('meal_plan');
      setResTextContent(`Coach James Custom Directives
Week 1 Plan — 7-Day Precision Meal Protocol
Assigned to: Zain • Updated: 12/09/2026
Daily Targets: 2,350 kcal | 185g Protein | 210g Carbs | 55g Fats

7:30 AM — Breakfast
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
Milk or plain yogurt if you're hungry.`);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!clientName || !clientPin) return;

    const normGram = (val, def) => {
      if (!val || !val.toString().trim()) return def;
      const clean = val.toString().trim();
      return /^\d+(\.\d+)?$/.test(clean) ? clean + 'g' : clean;
    };

    const normWater = (val, def) => {
      if (!val || !val.toString().trim()) return def;
      const clean = val.toString().trim();
      return /^\d+(\.\d+)?$/.test(clean) ? clean + 'L' : clean;
    };

    const targetCalories = parseInt(clientCalories) || 2450;
    const targetProtein = normGram(clientProtein, "190g");
    const targetCarbs = normGram(clientCarbs, "220g");
    const targetFats = normGram(clientFats, "55g");
    const targetWater = normWater(clientWater, "3.5L");
    const targetCurrentWeek = parseInt(clientCurrentWeek) || 1;

    if (clientFormMode === 'update_macros') {
      const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
      let targetFound = false;
      const updatedList = localClients.map(c => {
        if (c.id === selectedClientToEdit || c.pin_code === clientPin || (c.name?.toLowerCase() === clientName.toLowerCase())) {
          targetFound = true;
          return {
            ...c,
            name: clientName.trim(),
            pin_code: clientPin.trim(),
            program: clientProgram,
            current_week: targetCurrentWeek,
            calories: targetCalories,
            protein: targetProtein,
            carbs: targetCarbs,
            fats: targetFats,
            water: targetWater
          };
        }
        return c;
      });

      if (!targetFound) {
        updatedList.push({
          id: selectedClientToEdit || ("client_" + Date.now()),
          name: clientName.trim(),
          pin_code: clientPin.trim(),
          program: clientProgram,
          current_week: targetCurrentWeek,
          calories: targetCalories,
          protein: targetProtein,
          carbs: targetCarbs,
          fats: targetFats,
          water: targetWater,
          coach: "Head Coach James (London)"
        });
      }

      localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(updatedList));

      try {
        await supabase.from('clients')
          .update({ 
            name: clientName.trim(),
            pin_code: clientPin.trim(),
            program: clientProgram,
            current_week: targetCurrentWeek,
            calories: targetCalories,
            protein: targetProtein,
            carbs: targetCarbs,
            fats: targetFats,
            water: targetWater
          })
          .or(`id.eq.${selectedClientToEdit},pin_code.eq.${clientPin.trim()}`);
      } catch (err) {}

      window.dispatchEvent(new Event('storage'));
      fetchData();

      alert(`✅ Macros & Nutrition Targets assigned to "${clientName}"!\n\n• Transformation Stage: Week ${targetCurrentWeek} of 13\n• Target Calories: ${targetCalories} kcal / day\n• Protein: ${targetProtein}\n• Carbs: ${targetCarbs}\n• Healthy Fats: ${targetFats}\n• Water: ${targetWater}\n\nClient portal (/resources with PIN ${clientPin}) updated immediately!`);
      return;
    }

    const newClient = {
      id: "client_" + Date.now(),
      name: clientName.trim(),
      pin_code: clientPin.trim(),
      program: clientProgram,
      current_week: targetCurrentWeek,
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fats: targetFats,
      water: targetWater,
      coach: "Head Coach James (London)"
    };

    try {
      const { error } = await supabase.from('clients').insert([newClient]);
      if (error) console.warn("Supabase insert note:", error.message);
    } catch (e) {
      console.warn("Supabase insert catch:", e);
    }

    // Save to localStorage for instant reliability
    const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
    localClients.push(newClient);
    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(localClients));

    window.dispatchEvent(new Event('storage'));
    alert(`Client "${newClient.name}" created! PIN: ${newClient.pin_code} with customized macros (${newClient.calories} kcal, Week ${newClient.current_week}). Saved directly to database!`);
    setClientName('');
    setClientPin('');
    setClientCurrentWeek(1);
    fetchData();
  };

  const handleEditClientMacros = (clientObj) => {
    setAdminTab('overview');
    setClientFormMode('update_macros');
    setSelectedClientToEdit(clientObj.id);
    setClientName(clientObj.name);
    setClientPin(clientObj.pin_code);
    setClientProgram(clientObj.program || '13-Week Transformation & 30-Day Meal Plan');
    setClientCurrentWeek(Number(clientObj.current_week) || 1);
    setClientCalories(String(clientObj.calories || 2450));
    setClientProtein(clientObj.protein || '190g');
    setClientCarbs(clientObj.carbs || '220g');
    setClientFats(clientObj.fats || '55g');
    setClientWater(clientObj.water || '3.5L');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateClientWeek = async (clientId, newWeek) => {
    const weekNum = Number(newWeek) || 1;
    // 1. Update state
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, current_week: weekNum } : c));

    // 2. Update LocalStorage
    const localClients = JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || '[]');
    const updated = localClients.map(c => c.id === clientId ? { ...c, current_week: weekNum } : c);
    localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(updated));

    // 3. Update Supabase
    try {
      await supabase.from('clients').update({ current_week: weekNum }).eq('id', clientId);
    } catch (err) {
      console.warn("Supabase week update note:", err);
    }

    window.dispatchEvent(new Event('storage'));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fitness_resources')
        .upload(filePath, file);

      if (uploadError) {
        const localUrl = URL.createObjectURL(file);
        setResUrl(localUrl);
        alert("Local file preview loaded. (Supabase Storage note: " + uploadError.message + ")");
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('fitness_resources')
          .getPublicUrl(filePath);
        setResUrl(publicUrlData.publicUrl);
        alert("File uploaded successfully! URL populated.");
      }
    } catch (err) {
      alert("Upload note: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!resTitle || !resClientId) {
      alert("Please enter a title and select a client.");
      return;
    }

    if (resFormat === 'text' && !resTextContent.trim()) {
      alert("Please write the text instructions / meal plan in the text box.");
      return;
    }

    const selectedClientObj = clients.find(c => c.id === resClientId);
    const isZainSelected = selectedClientObj?.name?.toLowerCase().trim() === 'zain' || selectedClientObj?.pin_code === '78601' || selectedClientObj?.pin_code === '8989';

    const clientMacrosSnapshot = selectedClientObj ? {
      calories: selectedClientObj.calories || 2450,
      protein: selectedClientObj.protein || '190g',
      carbs: selectedClientObj.carbs || '220g',
      fats: selectedClientObj.fats || '55g',
      water: selectedClientObj.water || '3.5L'
    } : null;

    const localResources = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
    
    // Check existing meal plans for this client
    const clientMealPlans = localResources.filter(r => {
      const matches = r.client_id === resClientId || 
        (r.client_pin && selectedClientObj?.pin_code && r.client_pin === selectedClientObj.pin_code) ||
        (isZainSelected && (r.client_id === 'client-zain-1' || r.client_name?.toLowerCase().trim() === 'zain' || r.id?.includes('zain') || r.title?.toLowerCase().includes('zain')));
      return matches && (r.category === 'meal_plan' || r.type === 'meal_plan');
    });

    // If publishing a new meal plan, archive previously active plans for this client (NEVER DELETE)
    let updatedLocalResources = localResources;
    if (!editingResourceId && resCategory === 'meal_plan') {
      updatedLocalResources = localResources.map(r => {
        const matches = r.client_id === resClientId || 
          (r.client_pin && selectedClientObj?.pin_code && r.client_pin === selectedClientObj.pin_code) ||
          (isZainSelected && (r.client_id === 'client-zain-1' || r.client_name?.toLowerCase().trim() === 'zain' || r.id?.includes('zain') || r.title?.toLowerCase().includes('zain')));
        
        if (matches && (r.category === 'meal_plan' || r.type === 'meal_plan') && r.status === 'active') {
          return { ...r, status: 'archived', archived_at: new Date().toISOString() };
        }
        return r;
      });
    }

    const newResource = {
      id: editingResourceId || ("res_" + Date.now()),
      client_id: resClientId,
      client_name: selectedClientObj?.name || '',
      client_pin: selectedClientObj?.pin_code || '',
      title: resTitle.trim(),
      type: resCategory,
      category: resCategory,
      format: resFormat,
      status: resCategory === 'meal_plan' ? 'active' : 'published',
      version: clientMealPlans.length + 1,
      change_notes: resChangeNotes.trim() || (resCategory === 'meal_plan' ? 'Updated nutrition directives by Head Coach James' : ''),
      macros_snapshot: clientMacrosSnapshot,
      content_text: resTextContent.trim(),
      content_url: resUrl.trim() || '',
      layout_type: resLayout,
      assigned_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingResourceId) {
      const existingRes = localResources.find(r => r.id === editingResourceId);
      if (existingRes) {
        newResource.created_at = existingRes.created_at; // Keep original creation date
        newResource.version = existingRes.version; // Keep original version
      }
    }

    try {
      if (editingResourceId) {
        const { error } = await supabase.from('resources').update({
          client_id: newResource.client_id,
          client_name: newResource.client_name,
          client_pin: newResource.client_pin,
          title: newResource.title,
          category: newResource.category,
          type: newResource.type,
          format: newResource.format,
          status: newResource.status,
          change_notes: newResource.change_notes,
          content_text: newResource.content_text,
          content_url: newResource.content_url,
          layout_type: newResource.layout_type,
          updated_at: newResource.updated_at
        }).eq('id', editingResourceId);
        if (error) console.warn("Supabase resource update note:", error.message);
      } else {
        const { error } = await supabase.from('resources').insert([{
          id: newResource.id,
          client_id: newResource.client_id,
          client_name: newResource.client_name,
          client_pin: newResource.client_pin,
          title: newResource.title,
          category: newResource.category,
          type: newResource.type,
          format: newResource.format,
          status: newResource.status,
          version: newResource.version,
          change_notes: newResource.change_notes,
          content_text: newResource.content_text,
          content_url: newResource.content_url,
          layout_type: newResource.layout_type,
          assigned_at: newResource.assigned_at,
          created_at: newResource.created_at,
          updated_at: newResource.updated_at
        }]);
        if (error) console.warn("Supabase resource insert note:", error.message);
      }
    } catch (err) {}

    // Save to localStorage
    if (editingResourceId) {
      updatedLocalResources = updatedLocalResources.map(r => r.id === editingResourceId ? newResource : r);
    } else {
      updatedLocalResources.unshift(newResource);
    }
    localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(updatedLocalResources));

    alert(
      editingResourceId 
        ? `🟢 "${newResource.title}" updated successfully!`
        : (resCategory === 'meal_plan'
            ? `🟢 "${newResource.title}" published as CURRENT ACTIVE PROTOCOL for ${selectedClientObj ? selectedClientObj.name : 'client'}!\nPrevious plan safely archived in history.`
            : `Resource "${newResource.title}" published to ${selectedClientObj ? selectedClientObj.name : 'client'}!`)
    );

    cancelEditResource();
    fetchData();
  };

  const handleEditResourceSetup = (resource) => {
    setEditingResourceId(resource.id);
    setResClientId(resource.client_id);
    setResTitle(resource.title);
    setResCategory(resource.category || 'meal_plan');
    setResFormat(resource.format || 'text');
    setResTextContent(resource.content_text || '');
    setResUrl(resource.content_url || '');
    setResChangeNotes(resource.change_notes || '');
    setAdminTab('add_resource');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditResource = () => {
    setEditingResourceId(null);
    setResTitle('');
    setResTextContent('');
    setResChangeNotes('');
    setResUrl('');
  };

  const handleReactivatePlan = (targetPlanId, clientId) => {
    const clientObj = clients.find(c => c.id === clientId);
    const clientName = clientObj ? clientObj.name : 'Client';
    const isZain = clientName?.toLowerCase().trim() === 'zain' || clientObj?.pin_code === '78601' || clientObj?.pin_code === '8989' || clientId === 'client-zain-1';

    if (!confirm(`Reactivate this previous plan as ${clientName}'s CURRENT ACTIVE PROTOCOL? The current plan will be moved to archived history.`)) return;

    const allRes = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
    const updated = allRes.map(r => {
      const matchesClient = r.client_id === clientId || 
        (r.client_pin && clientObj?.pin_code && r.client_pin === clientObj.pin_code) ||
        (isZain && (r.client_id === 'client-zain-1' || r.client_name?.toLowerCase().trim() === 'zain' || r.id?.includes('zain') || r.title?.toLowerCase().includes('zain')));

      if (matchesClient && (r.category === 'meal_plan' || r.type === 'meal_plan')) {
        if (r.id === targetPlanId) {
          return { ...r, status: 'active', assigned_at: new Date().toISOString() };
        } else {
          return { ...r, status: 'archived' };
        }
      }
      return r;
    });

    localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(updated));
    setResources(updated);
    alert(`Protocol reactivated as CURRENT ACTIVE for ${clientName}! Client portal will update instantly.`);
  };

  const handleOpenDiff = (prevPlan, currPlan, clientObj) => {
    setDiffModal({
      isOpen: true,
      prevPlan,
      currPlan,
      client: clientObj
    });
  };

  const handleCloseDiff = () => {
    setDiffModal({
      isOpen: false,
      prevPlan: null,
      currPlan: null,
      client: null
    });
  };

  const handleDeleteResource = async (id) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await supabase.from('resources').delete().eq('id', id);
      } catch (e) {}

      const localResources = JSON.parse(localStorage.getItem(LOCAL_RESOURCES_KEY) || '[]');
      const filtered = localResources.filter(r => r.id !== id);
      localStorage.setItem(LOCAL_RESOURCES_KEY, JSON.stringify(filtered));

      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  // Dedicated Chat Reply
  const handleSendDedicatedChatReply = (e) => {
    e.preventDefault();
    if (!chatReplyText.trim()) return;

    const activeClient = clients.find(c => c.id === chatActiveClientId) || { id: "demo-client-1", name: "Marcus T.", pin_code: "12345" };

    const newCoachMsg = {
      id: "msg_coach_" + Date.now(),
      client_id: activeClient.id,
      client_name: activeClient.name,
      client_pin: activeClient.pin_code,
      sender: "coach",
      sender_name: "Head Coach James",
      text: chatReplyText.trim(),
      timestamp: new Date().toISOString(),
      status: "Sent by Coach James"
    };

    try {
      supabase.from('client_messages').insert([{
        id: newCoachMsg.id,
        client_id: newCoachMsg.client_id,
        client_name: newCoachMsg.client_name,
        client_pin: newCoachMsg.client_pin,
        sender: newCoachMsg.sender,
        sender_name: newCoachMsg.sender_name,
        text: newCoachMsg.text,
        timestamp: newCoachMsg.timestamp,
        status: newCoachMsg.status
      }]).then();
    } catch (e) {}

    const allMsgs = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    allMsgs.push(newCoachMsg);
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(allMsgs));

    setChatReplyText('');
    setMessages(allMsgs);
  };

  const handleDeleteMessage = (msgId) => {
    const localMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
    const filtered = localMessages.filter(m => m.id !== msgId);
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(filtered));
    setMessages(filtered);
  };

  // PASSWORD LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-shield-icon">
            <Lock size={32} />
          </div>
          <h2>Coach James &bull; Admin Portal</h2>
          <p>Enter the secure master password to manage clients, meal plans, written routines, and training videos.</p>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-input-wrap">
              <Key size={18} className="input-key-icon" />
              <input 
                type="password" 
                placeholder="Enter Admin Password" 
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)} 
                required 
                autoFocus
              />
            </div>

            {authError && <p className="admin-error-msg">{authError}</p>}

            <button type="submit" className="btn-admin-submit">
              Unlock Trainer Dashboard &rarr;
            </button>
          </form>

          <div className="admin-hint-tag">
            <ShieldCheck size={14} />
            <span>Authorized access only &bull; Master Password: <strong>wrldfitzone!</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Active chat client object & conversation
  const currentChatClient = clients.find(c => c.id === chatActiveClientId) || clients[0] || { id: "demo-client-1", name: "Marcus T.", pin_code: "12345" };
  const currentChatMessages = messages.filter(m => m.client_id === currentChatClient.id || m.client_pin === currentChatClient.pin_code);

  return (
    <div className="admin-dashboard-wrapper">
      
      {/* CLEAN TOP BRAND & HEADER */}
      <div className="admin-nav-bar">
        <div className="admin-brand-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="admin-pill">HEAD COACH JAMES &bull; ADMIN COMMAND CENTER</span>
            <span className="coach-live-indicator"><span className="live-dot"></span> SYSTEM ACTIVE</span>
          </div>
          <h1>World Fitness Zone &bull; Trainer Portal</h1>
          <p>Assign customized meal plans, written diet routines, training videos, and respond to client check-ins.</p>
        </div>

        <div className="admin-header-actions">
          <a 
            href="/resources" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-preview-portal"
          >
            <Eye size={16} /> Open Client Portal (PIN: 12345)
          </a>
          <button onClick={handleAdminLogout} className="btn-admin-logout">
            <LogOut size={16} /> Lock / Logout
          </button>
        </div>
      </div>

      {/* DASHBOARD TOP STATS ROW */}
      <div className="admin-stats-summary-strip">
        <div className="admin-stat-card" onClick={() => setAdminTab('clients')}>
          <div className="admin-stat-icon clients"><Users size={20} /></div>
          <div>
            <span className="admin-stat-number">{clients.length}</span>
            <span className="admin-stat-label">Active Clients</span>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setAdminTab('chat')}>
          <div className="admin-stat-icon messages"><MessageSquare size={20} /></div>
          <div>
            <span className="admin-stat-number">{messages.length}</span>
            <span className="admin-stat-label">Total Messages</span>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setAdminTab('weighins')}>
          <div className="admin-stat-icon weighin"><Scale size={20} /></div>
          <div>
            <span className="admin-stat-number">{weighIns.length}</span>
            <span className="admin-stat-label">Weigh-In Logs</span>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setAdminTab('resources')}>
          <div className="admin-stat-icon plans"><FolderOpen size={20} /></div>
          <div>
            <span className="admin-stat-number">{resources.length}</span>
            <span className="admin-stat-label">Assigned Content</span>
          </div>
        </div>
      </div>

      {/* MAIN ADMIN NAVIGATION TABS */}
      <div className="admin-section-tabs">
        <button 
          className={`admin-sec-tab ${adminTab === 'overview' ? 'active' : ''}`}
          onClick={() => setAdminTab('overview')}
        >
          <Layers size={17} /> 1. Create &amp; Assign Workspaces
        </button>

        <button 
          className={`admin-sec-tab ${adminTab === 'chat' ? 'active' : ''}`}
          onClick={() => setAdminTab('chat')}
        >
          <MessageSquare size={17} /> 2. Live 2-Way Chat Inbox ({messages.length})
        </button>

        <button 
          className={`admin-sec-tab ${adminTab === 'clients' ? 'active' : ''}`}
          onClick={() => setAdminTab('clients')}
        >
          <Users size={17} /> 3. Client Profiles &amp; Macros ({clients.length})
        </button>

        <button 
          className={`admin-sec-tab ${adminTab === 'weighins' ? 'active' : ''}`}
          onClick={() => setAdminTab('weighins')}
        >
          <Scale size={17} /> 4. Fasted Weigh-In History ({weighIns.length})
        </button>

        <button 
          className={`admin-sec-tab ${adminTab === 'resources' ? 'active' : ''}`}
          onClick={() => setAdminTab('resources')}
        >
          <FolderOpen size={17} /> 5. Published Plans Library ({resources.length})
        </button>

        <button 
          className={`admin-sec-tab ${adminTab === 'history' ? 'active' : ''}`}
          onClick={() => setAdminTab('history')}
        >
          <History size={17} /> 6. Diet Plan History &amp; Audit Trail (&ldquo;Pehle vs Ab&rdquo;)
        </button>
      </div>

      {/* =========================================================================
         TAB 1: WORKSPACE (BALANCED 50/50 GRID - NO OVERFLOW OR CROPPING)
         ========================================================================= */}
      {adminTab === 'overview' && (
        <div className="admin-grid-layout">
          
          {/* CARD 1: CREATE NEW CLIENT WITH QUICK MACROS OR ASSIGN TO EXISTING */}
          <div className="admin-panel-card">
            <div className="panel-title-row">
              <UserPlus size={20} className="panel-icon-gold" />
              <h2>1. Client Registration &amp; Macro Assignment</h2>
            </div>
            <p className="panel-sub">Assign daily calories, protein, carbs, healthy fats, and water to new or existing clients.</p>

            {/* MODE SWITCHER: REGISTER NEW VS UPDATE EXISTING */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '12px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  background: clientFormMode === 'register' ? '#ffffff' : 'transparent',
                  color: clientFormMode === 'register' ? '#071a2b' : '#64748b',
                  boxShadow: clientFormMode === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setClientFormMode('register');
                  setClientName('');
                  setClientPin('');
                  setSelectedClientToEdit('');
                  setClientCurrentWeek(1);
                }}
              >
                ➕ Register New Client
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  background: clientFormMode === 'update_macros' ? '#ffffff' : 'transparent',
                  color: clientFormMode === 'update_macros' ? '#155eef' : '#64748b',
                  boxShadow: clientFormMode === 'update_macros' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setClientFormMode('update_macros');
                  if (clients.length > 0) {
                    const first = clients[0];
                    setSelectedClientToEdit(first.id);
                    setClientName(first.name);
                    setClientPin(first.pin_code);
                    setClientProgram(first.program || '13-Week Transformation & 30-Day Meal Plan');
                    setClientCurrentWeek(Number(first.current_week) || 1);
                    setClientCalories(String(first.calories || 2450));
                    setClientProtein(first.protein || '190g');
                    setClientCarbs(first.carbs || '220g');
                    setClientFats(first.fats || '55g');
                    setClientWater(first.water || '3.5L');
                  }
                }}
              >
                🎯 Assign to Existing Client ({clients.length})
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="panel-form">
              {clientFormMode === 'update_macros' ? (
                <div className="form-group" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', marginBottom: '1rem' }}>
                  <label style={{ color: '#071a2b', fontWeight: '800' }}>Select Target Client to Assign / Update Macros:</label>
                  <select 
                    value={selectedClientToEdit}
                    onChange={(e) => {
                      const cId = e.target.value;
                      setSelectedClientToEdit(cId);
                      const target = clients.find(c => c.id === cId);
                      if (target) {
                        setClientName(target.name);
                        setClientPin(target.pin_code);
                        setClientProgram(target.program || '13-Week Transformation & 30-Day Meal Plan');
                        setClientCurrentWeek(Number(target.current_week) || 1);
                        setClientCalories(String(target.calories || 2450));
                        setClientProtein(target.protein || '190g');
                        setClientCarbs(target.carbs || '220g');
                        setClientFats(target.fats || '55g');
                        setClientWater(target.water || '3.5L');
                      }
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '700', fontSize: '0.9rem', color: '#071a2b' }}
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (PIN: {c.pin_code}) &bull; Week {c.current_week || 1} &bull; {c.calories || 2450} kcal, {c.protein || '190g'} P, {c.carbs || '220g'} C
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Client Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marcus Thomas" 
                    value={clientName} 
                    onChange={e => setClientName(e.target.value)} 
                    required 
                  />
                </div>
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label>Private PIN Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 54321" 
                    value={clientPin} 
                    onChange={e => setClientPin(e.target.value)} 
                    maxLength={8}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Assigned Program</label>
                  <select value={clientProgram} onChange={e => setClientProgram(e.target.value)}>
                    <option value="13-Week Transformation & 30-Day Meal Plan">13-Week Transformation</option>
                    <option value="12-Week Lean Bulk & Hypertrophy">12-Week Lean Bulk</option>
                    <option value="30-Day Rapid Six-Pack Shred">30-Day Rapid Shred</option>
                    <option value="8-Week Female Recomposition">8-Week Recomposition</option>
                  </select>
                </div>
              </div>

              {/* REAL-TIME 13-WEEK ROADMAP SELECTOR */}
              <div className="form-group" style={{ marginBottom: '1.25rem', background: '#f0f9ff', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#0369a1', fontWeight: '800' }}>Active 13-Week Transformation Stage:</span>
                  <span style={{ fontSize: '0.8rem', background: '#0284c7', color: '#fff', padding: '0.15rem 0.55rem', borderRadius: '6px', fontWeight: '800' }}>
                    Week {clientCurrentWeek} of 13
                  </span>
                </label>
                <select 
                  value={clientCurrentWeek} 
                  onChange={e => setClientCurrentWeek(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1.5px solid #7dd3fc', fontWeight: '700', fontSize: '0.9rem', color: '#071a2b', background: '#ffffff' }}
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map(w => (
                    <option key={w} value={w}>
                      Week {w} of 13 {w === 1 ? '— Metabolic Reset & Baseline Testing' : w === 2 ? '— Fat Burning Engine Ignition' : w === 3 ? '— Lower Abdominal Shredding' : w === 4 ? '— Mid-Program Recomposition (Active)' : w === 6 ? '— 6-Week Milestone & Photo Check-in' : w === 10 ? '— Stage-Conditioning Shred' : w === 13 ? '— Peak Longevity & Permanent Standard' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* QUICK MACRO PRESETS */}
              <div className="admin-macros-subpanel">
                <div className="subpanel-header-row">
                  <span className="subpanel-title"><Flame size={15} /> Daily Calories &amp; Macronutrients</span>
                  <div className="macro-preset-pills">
                    <button type="button" onClick={() => applyMacroPreset('cut')} className="btn-preset-pill">Cut (1,950)</button>
                    <button type="button" onClick={() => applyMacroPreset('recomp')} className="btn-preset-pill active">Recomp (2,450)</button>
                    <button type="button" onClick={() => applyMacroPreset('bulk')} className="btn-preset-pill">Bulk (2,900)</button>
                  </div>
                </div>

                {/* FEATURED CALORIES ROW */}
                <div className="calories-featured-row">
                  <div className="calories-label-group">
                    <Flame size={16} className="cal-fire-icon" />
                    <span>Total Daily Target Calories:</span>
                  </div>
                  <div className="calories-input-wrap">
                    <input 
                      type="number" 
                      value={clientCalories} 
                      onChange={e => setClientCalories(e.target.value)} 
                      placeholder="2000" 
                    />
                    <span className="cal-unit-tag">kcal / day</span>
                  </div>
                </div>

                {/* 4 BALANCED MACRO COLUMNS */}
                <div className="macros-four-grid">
                  <div className="macro-cell">
                    <label>🍗 Protein</label>
                    <input type="text" value={clientProtein} onChange={e => setClientProtein(e.target.value)} placeholder="250g" />
                  </div>
                  <div className="macro-cell">
                    <label>🍚 Carbs</label>
                    <input type="text" value={clientCarbs} onChange={e => setClientCarbs(e.target.value)} placeholder="20g" />
                  </div>
                  <div className="macro-cell">
                    <label>🥑 Healthy Fats</label>
                    <input type="text" value={clientFats} onChange={e => setClientFats(e.target.value)} placeholder="5g" />
                  </div>
                  <div className="macro-cell">
                    <label>💧 Water</label>
                    <input type="text" value={clientWater} onChange={e => setClientWater(e.target.value)} placeholder="3.5L" />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary-action">
                {clientFormMode === 'update_macros' ? (
                  <>
                    <Flame size={17} /> 💾 Save &amp; Assign Macros to {clientName || 'Client'}
                  </>
                ) : (
                  <>
                    <UserPlus size={17} /> Register Client with PIN &amp; Macros
                  </>
                )}
              </button>
            </form>
          </div>

          {/* CARD 2: ASSIGN CONTENT & DIET PLANS */}
          <div className="admin-panel-card">
            <div className="panel-title-row">
              <PlusCircle size={20} className="panel-icon-gold" />
              <h2>2. Assign Meal Plan, Video or Text</h2>
            </div>
            <p className="panel-sub">Coach James ki marzi: aap written diet text likh sakte hain, video add kar sakte hain, ya image/sheet upload kar sakte hain.</p>

            <form onSubmit={handleCreateResource} className="panel-form">
              
              <div className="form-row-2">
                <div className="form-group">
                  <label>Select Target Client</label>
                  <select value={resClientId} onChange={e => setResClientId(e.target.value)} required>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (PIN: {c.pin_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={resCategory} onChange={e => setResCategory(e.target.value)}>
                    <option value="meal_plan">🥗 Meal Plan of the Day</option>
                    <option value="routine_video">🎥 Exercise &amp; Routine Video</option>
                    <option value="coach_note">📋 Coach James Directives &amp; Protocol</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Title / Directive Heading</label>
                <input 
                  type="text" 
                  placeholder="e.g. Week 4 Fat Loss Diet Protocol OR Deadlift Cues" 
                  value={resTitle} 
                  onChange={e => setResTitle(e.target.value)} 
                  required 
                />
              </div>

              {/* FORMAT SELECTOR: TEXT, VIDEO, OR IMAGE */}
              <div className="format-toggle-box">
                <label>Content Format (Coach&apos;s Choice):</label>
                <div className="toggle-options">
                  <button 
                    type="button" 
                    className={`format-btn ${resFormat === 'text' ? 'active' : ''}`}
                    onClick={() => setResFormat('text')}
                  >
                    <FileText size={16} /> 📝 Written Text / Diet
                  </button>
                  <button 
                    type="button" 
                    className={`format-btn ${resFormat === 'video' ? 'active' : ''}`}
                    onClick={() => setResFormat('video')}
                  >
                    <Video size={16} /> 🎥 Video Tutorial
                  </button>
                  <button 
                    type="button" 
                    className={`format-btn ${resFormat === 'image' ? 'active' : ''}`}
                    onClick={() => setResFormat('image')}
                  >
                    <ImageIcon size={16} /> 🖼️ Image / Sheet
                  </button>
                </div>
              </div>

              {/* CONDITIONAL INPUT: TEXT AREA FOR WRITTEN DIET */}
              {(resFormat === 'text' || resFormat === 'mixed') && (
                <>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label>Written Meal Plan Instructions</label>
                      <div className="template-quick-buttons">
                        <button type="button" onClick={() => applyDietTemplate('zain_week1')} className="btn-tmpl-pill active" title="Load Zain's Week 1 7-Day Schedule">⚡ Zain&apos;s 7-Day Plan</button>
                        <button type="button" onClick={() => applyDietTemplate('standard')} className="btn-tmpl-pill">⚡ 4-Meal Plan</button>
                        <button type="button" onClick={() => applyDietTemplate('lowcarb')} className="btn-tmpl-pill">🥩 Low Carb</button>
                        <button type="button" onClick={() => applyDietTemplate('refeed')} className="btn-tmpl-pill">⚡ Refeed</button>
                      </div>
                    </div>
                    <textarea 
                      rows={6}
                      placeholder="Write or paste the client's custom routine or click a template above..."
                      value={resTextContent}
                      onChange={e => setResTextContent(e.target.value)}
                    />
                  </div>

                  {resCategory === 'meal_plan' && (
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#071a2b', fontWeight: 700 }}>
                        <History size={14} color="#155eef" /> Protocol Progression / Change Notes (for Audit Trail)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Week 2 progression: reduced carbs by 20g, introduced evening fruit"
                        value={resChangeNotes}
                        onChange={e => setResChangeNotes(e.target.value)}
                      />
                      <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.2rem', display: 'block' }}>
                        ℹ️ This will be saved in the client&apos;s chronological timeline so Coach James and the client know exactly what changed from previous plans.
                      </small>
                    </div>
                  )}
                </>
              )}

              {/* CONDITIONAL INPUT: VIDEO OR IMAGE MEDIA */}
              {(resFormat === 'video' || resFormat === 'image') && (
                <div className="upload-box">
                  <label>Upload File ({resFormat === 'video' ? 'Video MP4' : 'Image PNG/JPG'})</label>
                  <input type="file" onChange={handleFileUpload} disabled={uploading} />
                  {uploading && <span className="uploading-badge">Uploading file to server...</span>}
                  
                  <div className="or-divider">OR Media URL</div>
                  <input 
                    type="text" 
                    placeholder={resFormat === 'video' ? "/canuzunnn__pindown.io_1787244520.mp4" : "https://... or /images/..."} 
                    value={resUrl} 
                    onChange={e => setResUrl(e.target.value)} 
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary-action" disabled={uploading}>
                  <CheckCircle2 size={17} /> {editingResourceId ? "Update Resource & Notify" : "Publish Content to Client Portal"}
                </button>
                {editingResourceId && (
                  <button type="button" onClick={cancelEditResource} className="btn-cancel-edit" style={{ padding: '0.85rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      )}

      {/* =========================================================================
         TAB 2: MODERN 2-WAY LIVE CHAT INBOX (CLEAN MESSENGER DRAWER)
         ========================================================================= */}
      {adminTab === 'chat' && (
        <div className="admin-chat-messenger-layout">
          {/* LEFT: CLIENTS LIST */}
          <div className="chat-clients-sidebar">
            <div className="sidebar-header">
              <h3><Users size={18} /> Client Inboxes</h3>
              <span>{clients.length} Clients</span>
            </div>

            <div className="sidebar-clients-list">
              {clients.map(c => {
                const clientMsgs = messages.filter(m => m.client_id === c.id || m.client_pin === c.pin_code);
                const lastMsg = clientMsgs[clientMsgs.length - 1];
                const isSelected = c.id === chatActiveClientId;

                return (
                  <div 
                    key={c.id} 
                    className={`sidebar-client-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setChatActiveClientId(c.id)}
                  >
                    <div className="sidebar-avatar">{c.name.substring(0, 2).toUpperCase()}</div>
                    <div className="sidebar-meta">
                      <div className="sidebar-name-row">
                        <strong>{c.name}</strong>
                        <code className="sidebar-pin">PIN: {c.pin_code}</code>
                      </div>
                      <p className="sidebar-last-msg">
                        {lastMsg ? lastMsg.text.substring(0, 45) + '...' : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: CHAT CONVERSATION WINDOW */}
          <div className="chat-active-window">
            <div className="chat-active-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="active-chat-avatar">{currentChatClient.name.substring(0, 2).toUpperCase()}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#071a2b' }}>{currentChatClient.name}</h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    PIN: <strong>{currentChatClient.pin_code}</strong> &bull; {currentChatClient.program || '13-Week Transformation'}
                  </span>
                </div>
              </div>

              <a 
                href="/resources" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-preview-portal" 
                style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
              >
                <Eye size={14} /> Open Portal as Client
              </a>
            </div>

            {/* MESSAGES LIST */}
            <div className="chat-messages-scroll-area">
              {currentChatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.5 }} />
                  <p>No messages with {currentChatClient.name} yet. Send the first check-in below!</p>
                </div>
              ) : (
                currentChatMessages.map(m => {
                  const isCoach = m.sender === 'coach';
                  return (
                    <div key={m.id} className={`admin-chat-bubble-row ${isCoach ? 'from-coach' : 'from-client'}`}>
                      <div className="admin-bubble-content">
                        <div className="admin-bubble-meta">
                          <strong>{isCoach ? '👑 You (Head Coach James)' : currentChatClient.name}</strong>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(m.timestamp).toLocaleDateString('en-GB')}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* REPLY BOX */}
            <form onSubmit={handleSendDedicatedChatReply} className="chat-reply-input-bar">
              <input 
                type="text" 
                placeholder={`Type direct response to ${currentChatClient.name}...`}
                value={chatReplyText}
                onChange={e => setChatReplyText(e.target.value)}
                required
              />
              <button type="submit" className="btn-chat-send">
                <Send size={15} /> Send Reply
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 3: CLIENT PROFILES & MACRO ASSIGNMENTS TABLE
         ========================================================================= */}
      {adminTab === 'clients' && (
        <div className="admin-table-section">
          <div className="table-header">
            <h2>Active Client Roster &amp; Macro Targets</h2>
            <span className="total-badge">{clients.length} Clients Registered</span>
          </div>

          <div className="table-responsive">
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Private PIN</th>
                  <th>Purchased Program</th>
                  <th>Transformation Stage</th>
                  <th>Calories Target</th>
                  <th>Macros Breakdown (P / C / F)</th>
                  <th>Quick Action</th>
                  <th>Diet Audit &amp; History</th>
                  <th>Direct Login</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => {
                  const clientMealPlans = resources.filter(r => r.client_id === c.id && (r.category === 'meal_plan' || r.type === 'meal_plan'));
                  return (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td><code className="pin-tag">{c.pin_code}</code></td>
                      <td>{c.program || "13-Week Transformation"}</td>
                      <td>
                        <select
                          value={c.current_week || 1}
                          onChange={(e) => handleUpdateClientWeek(c.id, e.target.value)}
                          style={{
                            padding: '0.35rem 0.55rem',
                            borderRadius: '6px',
                            border: '1.5px solid #0284c7',
                            background: '#f0f9ff',
                            color: '#0369a1',
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                          title="Change client transformation week (1-13)"
                        >
                          {Array.from({ length: 13 }, (_, i) => i + 1).map(w => (
                            <option key={w} value={w}>Week {w} of 13</option>
                          ))}
                        </select>
                      </td>
                      <td><span className="calorie-badge">{c.calories || 2450} kcal</span></td>
                      <td>
                        <span className="macro-summary-tag">
                          {c.protein || '190g'} P &bull; {c.carbs || '220g'} C &bull; {c.fats || '55g'} F
                        </span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="btn-table-edit-macros"
                          onClick={() => handleEditClientMacros(c)}
                          style={{
                            background: '#eff6ff',
                            color: '#155eef',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Flame size={13} color="#f59e0b" /> Assign / Edit Macros
                        </button>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="btn-table-history"
                          onClick={() => {
                            setSelectedAuditClientId(c.id);
                            setAdminTab('history');
                          }}
                          title="Inspect what diet was given previously vs what is active now"
                        >
                          <History size={13} /> View Audit ({clientMealPlans.length} Plans)
                        </button>
                      </td>
                      <td>
                        <a 
                          href={`/resources`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="table-link"
                        >
                          Launch Portal (PIN: {c.pin_code}) <ExternalLink size={13} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 4: FASTED WEIGH-IN HISTORY TRACKER
         ========================================================================= */}
      {adminTab === 'weighins' && (
        <div className="admin-table-section">
          <div className="table-header">
            <h2>Sunday Morning Fasted Weigh-In History</h2>
            <span className="total-badge">{weighIns.length} Records Logged</span>
          </div>

          <div className="table-responsive">
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Bodyweight (kg)</th>
                  <th>Client Condition Notes</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {weighIns.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No weigh-in logs submitted yet. Clients can log their weight inside <code>/resources</code>.
                    </td>
                  </tr>
                ) : (
                  weighIns.map(w => (
                    <tr key={w.id}>
                      <td><strong>{w.client_name}</strong></td>
                      <td>
                        <span className="weigh-val-pill">
                          <Scale size={13} /> {w.weight} kg
                        </span>
                      </td>
                      <td><span style={{ color: '#475569', fontSize: '0.9rem' }}>{w.notes || 'Routine check-in'}</span></td>
                      <td><small style={{ color: '#64748b' }}>{new Date(w.timestamp).toLocaleString('en-GB')}</small></td>
                      <td><span className="badge-cat" style={{ background: '#ecfdf5', color: '#059669' }}>Recorded</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 5: PUBLISHED RESOURCES & DIET SHEETS
         ========================================================================= */}
      {adminTab === 'resources' && (
        <div className="admin-table-section">
          <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>Assigned Content, Videos &amp; Written Directives</h2>
              <span className="total-badge">{resources.length} Published Items</span>
            </div>
            <div>
              <select 
                value={filterResClientId} 
                onChange={e => setFilterResClientId(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 600
                }}
              >
                <option value="">All Clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (PIN: {c.pin_code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th>Content Summary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No custom resources created yet. Use Tab 1 to give written text plans or videos!
                    </td>
                  </tr>
                ) : (
                  resources
                    .filter(r => filterResClientId ? r.client_id === filterResClientId : true)
                    .map(r => {
                      const clientObj = clients.find(c => c.id === r.client_id);
                    const isMeal = r.category === 'meal_plan' || r.type === 'meal_plan';
                    const isActive = r.status === 'active';

                    return (
                      <tr key={r.id}>
                        <td><strong>{clientObj ? clientObj.name : 'Marcus T.'}</strong></td>
                        <td>{r.title}</td>
                        <td><span className="badge-cat">{r.type || 'Meal Plan'}</span></td>
                        <td><span className="badge-fmt">{r.format === 'text' ? '📝 Written Text' : r.format === 'video' ? '🎥 Video' : '🖼️ Image'}</span></td>
                        <td>
                          {isMeal ? (
                            <span 
                              className={`status-pill ${isActive ? 'active-pill' : 'archived-pill'}`}
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.3rem', 
                                padding: '0.2rem 0.6rem', 
                                borderRadius: '50px', 
                                fontSize: '0.75rem', 
                                fontWeight: 800,
                                background: isActive ? '#ecfdf5' : '#f1f5f9',
                                color: isActive ? '#059669' : '#64748b'
                              }}
                            >
                              {isActive ? '🟢 Active' : '⚪ Archived'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Published</span>
                          )}
                        </td>
                        <td className="content-cell">
                          {r.content_text ? (
                            <span title={r.content_text}>
                              {r.content_text.substring(0, 75)}...
                            </span>
                          ) : (
                            <span className="url-preview">{r.content_url || 'Media File'}</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {isMeal && clientObj && (
                              <button 
                                type="button"
                                className="btn-table-history"
                                onClick={() => {
                                  setSelectedAuditClientId(clientObj.id);
                                  setAdminTab('history');
                                }}
                                title="Open this client's Diet Audit Timeline"
                                style={{ padding: '0.4rem 0.65rem', fontSize: '0.76rem' }}
                              >
                                <History size={12} /> Audit
                              </button>
                            )}
                            <button onClick={() => handleEditResourceSetup(r)} className="btn-table-edit" title="Edit" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 600 }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteResource(r.id)} className="btn-row-del" title="Delete">
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* =========================================================================
         TAB 6: CLIENT DIET PLAN HISTORY & AUDIT TRAIL ("PEHLE VS AB")
         ========================================================================= */}
      {adminTab === 'history' && (() => {
        const activeAuditClient = clients.find(c => c.id === selectedAuditClientId) || clients[0] || { id: "client-zain-1", name: "Zain", pin_code: "78601" };
        const isZain = activeAuditClient.name?.toLowerCase().trim() === 'zain' || activeAuditClient.pin_code === '78601' || activeAuditClient.pin_code === '8989' || activeAuditClient.id === 'client-zain-1';

        const clientMealPlans = resources.filter(r => {
          if (r.category !== 'meal_plan' && r.type !== 'meal_plan') return false;
          if (r.client_id === activeAuditClient.id) return true;
          if (r.client_pin && activeAuditClient.pin_code && r.client_pin === activeAuditClient.pin_code) return true;
          if (isZain && (r.client_id === 'client-zain-1' || r.client_name?.toLowerCase().trim() === 'zain' || r.id?.includes('zain') || r.title?.toLowerCase().includes('zain'))) return true;
          return false;
        });

        // Ensure default Week 1 plan is included for Zain if not already in the array
        if (isZain && !clientMealPlans.some(m => m.id === 'res-zain-week1')) {
          clientMealPlans.push({
            id: "res-zain-week1",
            client_id: activeAuditClient.id,
            title: "Week 1 Plan — 7-Day Precision Meal Protocol",
            category: "meal_plan",
            type: "meal_plan",
            format: "text",
            status: clientMealPlans.some(m => m.status === 'active') ? 'archived' : 'active',
            version: 1,
            change_notes: "Initial 7-day baseline protocol assigned by Coach James",
            macros_snapshot: {
              calories: 2350,
              protein: "185g",
              carbs: "210g",
              fats: "55g",
              water: "3.5L"
            },
            assigned_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
            created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
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
Milk or plain yogurt if you're hungry.`
          });
        }
        
        // Find current active protocol
        const activeProtocol = clientMealPlans.find(r => r.status === 'active') || clientMealPlans[0];
        // All archived protocols sorted newest first
        const archivedProtocols = clientMealPlans.filter(r => r.id !== activeProtocol?.id);

        return (
          <div className="admin-audit-section">
            
            {/* TOP HEADER WITH CLIENT SELECTOR */}
            <div className="audit-header-banner">
              <div className="audit-header-info">
                <div className="audit-pill-badge">
                  <History size={14} /> ZERO MISUNDERSTANDING AUDIT RECORD
                </div>
                <h2>Client Diet Plan History (&ldquo;Pehle Kya Diya Tha vs Ab Kya Diya Hai&rdquo;)</h2>
                <p>
                  Chronological timeline of all diet protocols, macro targets, and directive changes given to this client by Head Coach James.
                </p>
              </div>

              {/* CLIENT SELECTOR */}
              <div className="audit-client-selector-box">
                <label><Users size={15} /> Viewing Timeline For:</label>
                <select 
                  value={activeAuditClient.id} 
                  onChange={e => setSelectedAuditClientId(e.target.value)}
                  className="audit-client-select"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (PIN: {c.pin_code})
                    </option>
                  ))}
                </select>
                <div className="audit-client-quick-meta">
                  <span>Program: <strong>{activeAuditClient.program || '13-Week Transformation'}</strong></span>
                  <span>PIN: <code>{activeAuditClient.pin_code}</code></span>
                </div>
              </div>
            </div>

            {/* AUDIT SUMMARY STATS */}
            <div className="audit-stats-grid">
              <div className="audit-stat-card active-card">
                <span className="audit-stat-tag">Current Protocol</span>
                <h3>{activeProtocol ? activeProtocol.title : 'None Active'}</h3>
                <span className="audit-stat-sub">
                  Assigned: {activeProtocol ? new Date(activeProtocol.assigned_at || activeProtocol.created_at || Date.now()).toLocaleDateString('en-GB') : 'N/A'}
                </span>
              </div>

              <div className="audit-stat-card">
                <span className="audit-stat-tag">Historical Versions</span>
                <h3>{clientMealPlans.length} Total Protocols</h3>
                <span className="audit-stat-sub">{archivedProtocols.length} Previous Archived Plans</span>
              </div>

              <div className="audit-stat-card">
                <span className="audit-stat-tag">Active Calorie Target</span>
                <h3>{activeAuditClient.calories || 2350} kcal</h3>
                <span className="audit-stat-sub">{activeAuditClient.protein || '185g'} P &bull; {activeAuditClient.carbs || '210g'} C &bull; {activeAuditClient.fats || '55g'} F</span>
              </div>
            </div>

            {/* SECTION 1: "AB KYA DIYA HAI" - CURRENT ACTIVE PROTOCOL */}
            <div className="audit-active-protocol-box">
              <div className="audit-box-header">
                <div className="audit-badge-active">
                  <span className="dot-pulse"></span> 🟢 AB KYA DIYA HAI &bull; CURRENT ACTIVE PROTOCOL
                </div>
                <div className="audit-header-actions">
                  <a 
                    href="/resources" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-audit-preview"
                  >
                    <Eye size={14} /> Open in Client Portal
                  </a>
                </div>
              </div>

              {activeProtocol ? (
                <div className="active-protocol-inner">
                  <div className="protocol-meta-row">
                    <div>
                      <h3 className="protocol-title">{activeProtocol.title}</h3>
                      <div className="protocol-time-meta">
                        <span><Clock size={14} /> Assigned: <strong>{new Date(activeProtocol.assigned_at || activeProtocol.created_at || Date.now()).toLocaleString('en-GB')}</strong></span>
                        {activeProtocol.version && <span>&bull; Version #{activeProtocol.version}</span>}
                      </div>
                    </div>

                    {/* MACROS SNAPSHOT */}
                    <div className="protocol-macros-snapshot">
                      <div className="snap-pill cal">
                        <Flame size={14} /> {activeProtocol.macros_snapshot?.calories || activeAuditClient.calories || 2350} kcal
                      </div>
                      <div className="snap-pill p">
                        🍗 {activeProtocol.macros_snapshot?.protein || activeAuditClient.protein || '185g'} P
                      </div>
                      <div className="snap-pill c">
                        🍚 {activeProtocol.macros_snapshot?.carbs || activeAuditClient.carbs || '210g'} C
                      </div>
                      <div className="snap-pill f">
                        🥑 {activeProtocol.macros_snapshot?.fats || activeAuditClient.fats || '55g'} F
                      </div>
                    </div>
                  </div>

                  {activeProtocol.change_notes && (
                    <div className="protocol-change-note">
                      <strong>Coach James Directive Note:</strong> {activeProtocol.change_notes}
                    </div>
                  )}

                  {/* ORGANIZED 7-DAY MEAL SCHEDULE & DAY-BY-DAY VIEW */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <OrganizedMealSchedule 
                      plan={activeProtocol} 
                      client={activeAuditClient} 
                      defaultMatrix={true} 
                    />
                  </div>
                </div>
              ) : (
                <div className="audit-empty-state">
                  <Utensils size={32} />
                  <p>No active meal plan assigned to {activeAuditClient.name} yet. Use Tab 1 to assign one!</p>
                </div>
              )}
            </div>

            {/* SECTION 2: "PEHLE KYA DIYA THA" - CHRONOLOGICAL ARCHIVE TIMELINE */}
            <div className="audit-history-timeline-section">
              <div className="timeline-header-row">
                <div className="timeline-title-group">
                  <History size={20} color="#64748b" />
                  <div>
                    <h3>Pehle Kya Diya Tha &bull; Previous Protocols History</h3>
                    <p>Chronological record of earlier meal plans given to {activeAuditClient.name}. Click &ldquo;Compare&rdquo; to see exact differences.</p>
                  </div>
                </div>
                <span className="archived-count-pill">{archivedProtocols.length} Previous Protocols Logged</span>
              </div>

              {archivedProtocols.length === 0 ? (
                <div className="audit-single-plan-note">
                  <Sparkles size={20} color="#ffc928" />
                  <div>
                    <strong>This is {activeAuditClient.name}&apos;s First Assigned Protocol</strong>
                    <p>Whenever you assign an updated meal plan from Tab 1, the current plan will automatically be archived here with its date stamp and macro snapshot so you have a complete audit history.</p>
                  </div>
                </div>
              ) : (
                <div className="timeline-cards-list">
                  {archivedProtocols.map((prev, index) => (
                    <div key={prev.id} className="timeline-archived-card">
                      <div className="timeline-card-left">
                        <div className="timeline-node">
                          <span className="node-number">{archivedProtocols.length - index}</span>
                        </div>
                        <div className="timeline-card-content">
                          <div className="timeline-badge-row">
                            <span className="badge-archived">⚪ PREVIOUS PROTOCOL (ARCHIVED)</span>
                            <span className="timeline-date">
                              <Clock size={13} /> Given: {new Date(prev.assigned_at || prev.created_at || Date.now()).toLocaleDateString('en-GB')}
                            </span>
                            {prev.version && <span className="timeline-ver">v{prev.version}</span>}
                          </div>

                          <h4 className="timeline-plan-title">{prev.title}</h4>

                          {/* HISTORICAL MACROS SNAPSHOT */}
                          {prev.macros_snapshot && (
                            <div className="timeline-macros-row">
                              <span className="t-macro-pill cal"><Flame size={12} /> {prev.macros_snapshot.calories} kcal</span>
                              <span className="t-macro-pill">🍗 {prev.macros_snapshot.protein}</span>
                              <span className="t-macro-pill">🍚 {prev.macros_snapshot.carbs}</span>
                              <span className="t-macro-pill">🥑 {prev.macros_snapshot.fats}</span>
                            </div>
                          )}

                          {prev.change_notes && (
                            <p className="timeline-notes">
                              <strong>Historical Note:</strong> {prev.change_notes}
                            </p>
                          )}

                          {/* SNIPPET PREVIEW */}
                          <div className="timeline-snippet-preview">
                            <code>{prev.content_text?.substring(0, 180)}...</code>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS: COMPARE OR REACTIVATE */}
                      <div className="timeline-card-actions">
                        <button 
                          type="button" 
                          className="btn-action-compare"
                          onClick={() => handleOpenDiff(prev, activeProtocol, activeAuditClient)}
                          title="Compare this previous plan with current active plan"
                        >
                          <GitCompare size={15} /> Compare Pehle vs Ab
                        </button>

                        <button 
                          type="button" 
                          className="btn-action-reactivate"
                          onClick={() => handleReactivatePlan(prev.id, activeAuditClient.id)}
                          title="Reactivate this plan as the active protocol"
                        >
                          <RotateCcw size={14} /> Reactivate as Active
                        </button>

                        <button 
                          type="button" 
                          className="btn-action-del-history"
                          onClick={() => handleDeleteResource(prev.id)}
                          title="Delete from history"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* =========================================================================
         SIDE-BY-SIDE DIFF MODAL: "PEHLE VS AB"
         ========================================================================= */}
      {diffModal.isOpen && diffModal.prevPlan && diffModal.currPlan && (
        <div className="diet-diff-modal-backdrop" onClick={handleCloseDiff}>
          <div className="diet-diff-modal-window" onClick={e => e.stopPropagation()}>
            
            {/* MODAL HEADER */}
            <div className="diff-modal-header">
              <div className="diff-modal-title-group">
                <div className="diff-icon-badge"><GitCompare size={20} /></div>
                <div>
                  <h3>Diet Plan Audit Comparison &bull; Client: {diffModal.client?.name}</h3>
                  <p>Comparing: <strong>Pehle Kya Diya Tha</strong> (Previous) vs <strong>Ab Kya Diya Hai</strong> (Active Current)</p>
                </div>
              </div>
              <button type="button" className="btn-close-diff-modal" onClick={handleCloseDiff}>
                <X size={20} />
              </button>
            </div>

            {/* MACRO DELTA COMPARISON STRIP */}
            {(() => {
              const prevCal = parseInt(diffModal.prevPlan.macros_snapshot?.calories) || 2500;
              const currCal = parseInt(diffModal.currPlan.macros_snapshot?.calories) || (diffModal.client?.calories || 2350);
              const calDelta = currCal - prevCal;

              return (
                <div className="diff-macro-delta-strip">
                  <div className="delta-stat-cell">
                    <span className="delta-label">Daily Calories</span>
                    <div className="delta-vals-row">
                      <span className="val-prev">{prevCal} kcal</span>
                      <ArrowRight size={14} />
                      <span className="val-curr">{currCal} kcal</span>
                      <span className={`delta-badge ${calDelta <= 0 ? 'deficit' : 'surplus'}`}>
                        {calDelta > 0 ? `+${calDelta} kcal` : `${calDelta} kcal`}
                      </span>
                    </div>
                  </div>

                  <div className="delta-stat-cell">
                    <span className="delta-label">Protein Target</span>
                    <div className="delta-vals-row">
                      <span className="val-prev">{diffModal.prevPlan.macros_snapshot?.protein || '165g'}</span>
                      <ArrowRight size={14} />
                      <span className="val-curr">{diffModal.currPlan.macros_snapshot?.protein || (diffModal.client?.protein || '185g')}</span>
                    </div>
                  </div>

                  <div className="delta-stat-cell">
                    <span className="delta-label">Carbs Target</span>
                    <div className="delta-vals-row">
                      <span className="val-prev">{diffModal.prevPlan.macros_snapshot?.carbs || '250g'}</span>
                      <ArrowRight size={14} />
                      <span className="val-curr">{diffModal.currPlan.macros_snapshot?.carbs || (diffModal.client?.carbs || '210g')}</span>
                    </div>
                  </div>

                  <div className="delta-stat-cell">
                    <span className="delta-label">Fats Target</span>
                    <div className="delta-vals-row">
                      <span className="val-prev">{diffModal.prevPlan.macros_snapshot?.fats || '65g'}</span>
                      <ArrowRight size={14} />
                      <span className="val-curr">{diffModal.currPlan.macros_snapshot?.fats || (diffModal.client?.fats || '55g')}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SIDE-BY-SIDE COLUMNS */}
            <div className="diff-columns-grid">
              
              {/* LEFT COLUMN: PEHLE KYA DIYA THA */}
              <div className="diff-column col-prev">
                <div className="diff-col-header">
                  <span className="col-badge badge-prev">⚪ PEHLE KYA DIYA THA (ARCHIVED)</span>
                  <h4>{diffModal.prevPlan.title}</h4>
                  <div className="col-meta-tag">
                    <Clock size={12} /> Assigned: {new Date(diffModal.prevPlan.assigned_at || diffModal.prevPlan.created_at || Date.now()).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {diffModal.prevPlan.change_notes && (
                  <div className="diff-note-box prev">
                    <strong>Directive Note:</strong> {diffModal.prevPlan.change_notes}
                  </div>
                )}

                <div className="diff-body-text">
                  <pre>{diffModal.prevPlan.content_text}</pre>
                </div>
              </div>

              {/* RIGHT COLUMN: AB KYA DIYA HAI */}
              <div className="diff-column col-curr">
                <div className="diff-col-header">
                  <span className="col-badge badge-curr">🟢 AB KYA DIYA HAI (CURRENT ACTIVE)</span>
                  <h4>{diffModal.currPlan.title}</h4>
                  <div className="col-meta-tag">
                    <Clock size={12} /> Assigned: {new Date(diffModal.currPlan.assigned_at || diffModal.currPlan.created_at || Date.now()).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {diffModal.currPlan.change_notes && (
                  <div className="diff-note-box curr">
                    <strong>Directive Note:</strong> {diffModal.currPlan.change_notes}
                  </div>
                )}

                <div className="diff-body-text">
                  <pre>{diffModal.currPlan.content_text}</pre>
                </div>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="diff-modal-footer">
              <button 
                type="button" 
                className="btn-diff-print" 
                onClick={() => window.print()}
              >
                <Printer size={15} /> Print / Save Audit PDF
              </button>
              <button 
                type="button" 
                className="btn-diff-close" 
                onClick={handleCloseDiff}
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
