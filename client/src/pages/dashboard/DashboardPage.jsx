// DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Repeat,
  Stethoscope,
  Baby,
  MessageCircle,
  HeartHandshake,
  Apple,
  FileText,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
  Plus,
  CalendarClock,
  ChevronRight,
  Sparkles,
  Droplet,
  Moon,
  Activity as ActivityIcon,
  Upload,
  Calendar,
  ShieldCheck,
  ClipboardList,
  Dumbbell,
  Clock,
  Heart,
  Droplets,
  Sun,
  ChevronDown,
  Bot,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getCycleDashboard, getPrediction, getCycles } from "../../services/cycle.service";
import { getAssessmentHistory } from "../../services/pcos.service";
import { getPregnancyDashboard, trimesterLabel } from "../../services/pregnancy.service";

// Keep static stats structure but we'll update values dynamically
const statsConfig = [
  {
    label: "Next Period",
    key: "nextPeriod",
    unit: "",
    sub: "Days Left",
    color: "#F33B7D",
    icon: Calendar,
  },
  {
    label: "Cycle Day",
    key: "cycleDay",
    unit: "",
    sub: "Today",
    color: "#A855F7",
    icon: Repeat,
  },
  {
    label: "PCOS Risk",
    key: "pcosRisk",
    unit: "",
    sub: "Risk Level",
    color: "#22C55E",
    icon: ShieldCheck,
  },
  {
    label: "Pregnancy",
    key: "pregnancy",
    unit: "",
    sub: "Trimester",
    color: "#F59E0B",
    icon: Baby,
  },
  {
    label: "Unread Messages",
    value: "3",
    unit: "",
    sub: "From Doctor",
    color: "#3B82F6",
    icon: MessageCircle,
  },
];

// Keep static insights
const insights = [
  {
    icon: ActivityIcon,
    title: "Stay Active",
    detail: "You've completed 3 workouts this week.",
    tag: "Great",
    tagColor: "#22C55E",
  },
  {
    icon: Droplet,
    title: "Hydration",
    detail: "You drink 6 of 8 glasses of water daily.",
    tag: "Good",
    tagColor: "#3B82F6",
  },
  {
    icon: Apple,
    title: "Nutrition",
    detail: "Keep eating more iron-rich foods.",
    tag: "Improve",
    tagColor: "#F59E0B",
  },
  {
    icon: Moon,
    title: "Sleep",
    detail: "You slept 7h 25m on average.",
    tag: "Good",
    tagColor: "#3B82F6",
  },
];

// Keep static recent activity
const recentActivity = [
  {
    icon: Calendar,
    color: "#F33B7D",
    title: "Period Logged",
    detail: "Flow: Moderate",
    time: "19 May 2025, 9:20 AM",
  },
  {
    icon: ClipboardList,
    color: "#A855F7",
    title: "Report Analyzed",
    detail: "Iron Deficiency",
    time: "18 May 2025, 4:30 PM",
  },
  {
    icon: MessageCircle,
    color: "#22C55E",
    title: "Chat with Dr. Ayesha",
    detail: "Hello Doctor, I have a question...",
    time: "18 May 2025, 10:15 AM",
  },
  {
    icon: Dumbbell,
    color: "#F59E0B",
    title: "Workout Completed",
    detail: "Intensity: Yoga - 30 min",
    time: "17 May 2025, 8:45 AM",
  },
];

// Keep static reminders
const reminders = [
  {
    title: "Doctor Appointment",
    time: "20 May 2025 - 10:00 AM",
    tag: "Upcoming",
    tagColor: "#F59E0B",
  },
  {
    title: "Ayesha Exam",
    time: "25 May 2025 - 11:30 AM",
    tag: "Important",
    tagColor: "#F33B7D",
  },
  {
    title: "Iron Supplement",
    time: "Daily - 9:00 AM",
    tag: "Daily",
    tagColor: "#3B82F6",
  },
  {
    title: "Blood Test",
    time: "30 May 2025 - 9:00 AM",
    tag: "Upcoming",
    tagColor: "#A855F7",
  },
];

// Enhanced Quick Actions with matching background colors
const quickActions = [
  { 
    icon: Calendar, 
    label: "Log Period", 
    path: "/cycle-tracker/log",
    description: "Track your cycle",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: ShieldCheck, 
    label: "PCOS Assessment", 
    path: "/pcos-detection",
    description: "Check your risk",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: Upload, 
    label: "Upload Report", 
    path: "#",
    description: "Analyze health data",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: MessageCircle, 
    label: "Talk to Doctor", 
    path: "#",
    description: "Get expert advice",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: Bot, 
    label: "Gynae Assistant", 
    path: "#",
    description: "AI health guidance",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: BookOpen, 
    label: "Health Education", 
    path: "#",
    description: "Learn more",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: Apple, 
    label: "Diet & Nutrition", 
    path: "#",
    description: "Healthy eating guide",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
  { 
    icon: Dumbbell, 
    label: "Exercise", 
    path: "#",
    description: "Stay active & fit",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB"
  },
];

function Sparkline({ color }) {
  const data = Array.from({ length: 8 }, (_, i) => ({
    v: 10 + Math.abs(Math.sin(i / 1.3 + 0.5) * 8) + 0.5,
  }));

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ label, value, unit, sub, color, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs text-[#8F8C8C]">{label}</p>
      </div>
      <p className="mt-2 font-display text-xl font-semibold text-[#0D0D0D]">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-[#B8AEB2]">{unit}</span>}
      </p>
      <p className="mt-0.5 text-xs text-[#B8AEB2]">{sub}</p>
      <Sparkline color={color} />
    </div>
  );
}

function getRiskColor(risk) {
  const r = (risk || "").toLowerCase();
  if (r.includes("high")) return "#F33B7D";
  if (r.includes("medium") || r.includes("moderate")) return "#F59E0B";
  if (r.includes("low")) return "#22C55E";
  return "#F59E0B";
}

function getRiskLevel(risk) {
  const r = (risk || "").toLowerCase();
  if (r.includes("high")) return "High";
  if (r.includes("medium") || r.includes("moderate")) return "Moderate";
  if (r.includes("low")) return "Low";
  return "Unknown";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // FIRST: Redirect admin users immediately
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
  }, [user?.role, navigate]);

  const [dashboardData, setDashboardData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [cyclesData, setCyclesData] = useState([]);
  const [pcosAssessments, setPcosAssessments] = useState([]);
  const [pregnancyData, setPregnancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasCycleData, setHasCycleData] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    // Don't fetch data if user is admin (they'll be redirected anyway)
    if (user?.role === "admin") {
      return;
    }

    const loadData = async () => {
      try {
        // Load all data in parallel
        const [dashboardRes, predictionRes, cyclesRes, pcosRes, pregnancyRes] = await Promise.all([
          getCycleDashboard().catch(() => ({ data: null })),
          getPrediction().catch(() => ({ data: null })),
          getCycles().catch(() => ({ data: [] })),
          getAssessmentHistory().catch(() => []),
          getPregnancyDashboard().catch(() => ({ data: null })),
        ]);

        const dashboard = dashboardRes.data || dashboardRes || null;
        const prediction = predictionRes.data || predictionRes || null;
        const cycles = cyclesRes.data || cyclesRes.cycles || cyclesRes || [];
        const pcos = Array.isArray(pcosRes) ? pcosRes : [];
        const pregnancy = pregnancyRes?.pregnancy ? pregnancyRes : null;

        setDashboardData(dashboard);
        setPredictionData(prediction);
        setCyclesData(Array.isArray(cycles) ? cycles : []);
        setPcosAssessments(pcos);
        setPregnancyData(pregnancy);
        
        // Check if we have any cycle data
        const hasData = (Array.isArray(cycles) && cycles.length > 0) || 
                       (dashboard && (dashboard.latestCycle || dashboard.prediction));
        setHasCycleData(hasData);
      } catch (err) {
        setError("Could not load data");
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.role]);

  // Get latest PCOS assessment
  const getLatestPCOS = () => {
    if (!pcosAssessments || pcosAssessments.length === 0) {
      return null;
    }
    // Sort by createdAt descending and get the latest
    const sorted = [...pcosAssessments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted[0];
  };

  // Compute dynamic stats
  const getStats = () => {
    const stats = [...statsConfig];

    // Update Pregnancy stat
    if (pregnancyData?.pregnancy) {
      const { currentWeek, trimester } = pregnancyData.pregnancy;
      const weeksRemaining = pregnancyData.weeksRemaining;
      
      // Format the pregnancy display
      const weeksDisplay = currentWeek ? `${currentWeek} Weeks` : "No Data";
      const trimesterDisplay = trimester ? trimesterLabel[trimester] || "Unknown" : "No Data";
      
      stats[3].value = weeksDisplay;
      stats[3].sub = trimesterDisplay;
      
      // Update color based on trimester
      if (trimester === 1) stats[3].color = "#22C55E";
      else if (trimester === 2) stats[3].color = "#F59E0B";
      else if (trimester === 3) stats[3].color = "#F33B7D";
    } else {
      // No pregnancy data
      stats[3].value = "Not Tracking";
      stats[3].sub = "Start tracking";
      stats[3].color = "#8F8C8C";
    }

    if (!hasCycleData) {
      // No cycle data state
      stats[0].value = "-";
      stats[0].sub = "No data";
      stats[1].value = "-";
      stats[1].unit = "";
      stats[1].sub = "No data";
    } else {
      // Update Next Period
      if (predictionData?.nextPeriod) {
        const daysUntil = Math.ceil(
          (new Date(predictionData.nextPeriod) - Date.now()) / (1000 * 60 * 60 * 24)
        );
        stats[0].value = daysUntil > 0 ? daysUntil : 0;
        stats[0].sub = daysUntil > 0 ? "Days Left" : "Due Today";
      } else {
        stats[0].value = "-";
        stats[0].sub = "No data";
      }

      // Update Cycle Day
      if (dashboardData?.prediction?.currentPhase?.cycleDay) {
        const cycleDay = dashboardData.prediction.currentPhase.cycleDay;
        const cycleLength = dashboardData.prediction?.averageCycleLength || 28;
        stats[1].value = cycleDay;
        stats[1].unit = `/${cycleLength}`;
        stats[1].sub = `Day ${cycleDay}`;
      } else if (predictionData?.currentPhase?.cycleDay) {
        const cycleDay = predictionData.currentPhase.cycleDay;
        const cycleLength = predictionData?.averageCycleLength || 28;
        stats[1].value = cycleDay;
        stats[1].unit = `/${cycleLength}`;
        stats[1].sub = `Day ${cycleDay}`;
      }
    }

    // Update PCOS Risk
    const latestPCOS = getLatestPCOS();
    if (latestPCOS) {
      const risk = getRiskLevel(latestPCOS.risk);
      const color = getRiskColor(latestPCOS.risk);
      stats[2].value = risk;
      stats[2].sub = `${Math.round(latestPCOS.probability || 0)}% Probability`;
      stats[2].color = color;
    } else {
      stats[2].value = "No Data";
      stats[2].sub = "Take assessment";
      stats[2].color = "#8F8C8C";
    }

    return stats;
  };

  // Compute cycle pie data
  const getCyclePieData = () => {
    if (!hasCycleData) {
      // Show empty state with greyed out pie
      return [
        { name: "No Data", value: 1, color: "#E5E7EB" },
      ];
    }

    const cycleDay = dashboardData?.prediction?.currentPhase?.cycleDay || 
                    predictionData?.currentPhase?.cycleDay || 1;
    const cycleLength = dashboardData?.prediction?.averageCycleLength || 
                       predictionData?.averageCycleLength || 28;

    return [
      { name: "Current Day", value: cycleDay, color: "#F33B7D" },
      { name: "Remaining", value: Math.max(0, cycleLength - cycleDay), color: "#FBCFE8" },
    ];
  };

  // Get period length from user data
  const getPeriodLength = () => {
    if (!hasCycleData) return 5; // Default if no data
    
    // Try to get from prediction
    if (predictionData?.periodLength) {
      return predictionData.periodLength;
    }
    if (dashboardData?.prediction?.periodLength) {
      return dashboardData.prediction.periodLength;
    }
    
    // Try to get from latest cycle
    if (cyclesData.length > 0) {
      const latestCycle = cyclesData[cyclesData.length - 1];
      if (latestCycle?.periodLength) {
        return latestCycle.periodLength;
      }
    }
    
    return 5; // Default if not found
  };

  // Get ovulation day - calculate it properly from cycle data
  const getOvulationDay = () => {
    if (!hasCycleData) return null;
    
    // If we have a prediction with ovulation date, use it
    if (predictionData?.ovulation) {
      const ovDate = new Date(predictionData.ovulation);
      const day = ovDate.getDate();
      // Validate the ovulation day is reasonable
      if (day >= 10 && day <= 20) {
        return day;
      }
    }
    if (dashboardData?.prediction?.ovulation) {
      const ovDate = new Date(dashboardData.prediction.ovulation);
      const day = ovDate.getDate();
      if (day >= 10 && day <= 20) {
        return day;
      }
    }
    
    // Calculate from cycle length - ovulation typically occurs 14 days before period
    const cycleLength = dashboardData?.prediction?.averageCycleLength || 
                       predictionData?.averageCycleLength || 28;
    
    // Standard calculation: ovulation day = cycle length - 14
    // For a 28-day cycle, this gives day 14
    // For a 30-day cycle, this gives day 16
    const calculatedOvulation = cycleLength - 14;
    
    // Ensure it's within a reasonable range (day 10-20 for most women)
    if (calculatedOvulation >= 10 && calculatedOvulation <= 20) {
      return calculatedOvulation;
    }
    
    // Default to day 14 for a standard 28-day cycle
    return 14;
  };

  // Get current phase name with proper formatting
  const getCurrentPhase = () => {
    if (!hasCycleData) {
      return null;
    }

    let phase = dashboardData?.prediction?.currentPhase?.phase || 
                predictionData?.currentPhase?.phase;
    
    if (!phase) return null;
    
    // Ensure "Phase" is appended if not already present
    const phaseLower = phase.toLowerCase();
    if (phaseLower === "menstrual" || phaseLower === "follicular" || 
        phaseLower === "luteal" || phaseLower === "ovulation") {
      // For ovulation, it's already a phase name without needing "Phase"
      if (phaseLower === "ovulation") {
        return "Ovulation";
      }
      return `${phase} Phase`;
    }
    
    return phase;
  };

  // Get insight
  const getInsight = () => {
    if (!hasCycleData) {
      return "Start logging your periods to get personalized health insights.";
    }

    const insights = dashboardData?.prediction?.health?.insights || 
                    predictionData?.health?.insights || 
                    ["Log your next period to keep predictions accurate."];
    return insights[0] || "Log your next period to keep predictions accurate.";
  };

  // Get dynamic cycle history data
  const getCycleHistoryData = () => {
    if (!cyclesData || cyclesData.length === 0) {
      return [];
    }

    // Sort cycles by periodStart date (oldest to newest)
    const sortedCycles = [...cyclesData]
      .filter(c => c.periodStart)
      .sort((a, b) => new Date(a.periodStart) - new Date(b.periodStart));

    // Take the last 6 cycles or all if less than 6
    const lastSixCycles = sortedCycles.slice(-6);

    // Transform cycle data for the chart
    return lastSixCycles.map((cycle) => {
      const startDate = new Date(cycle.periodStart);
      const month = startDate.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate ovulation day from cycle length
      const cycleLength = cycle.cycleLength || 28;
      const ovulationDay = cycleLength - 14; // Typical ovulation calculation
      
      return {
        month: month,
        period: cycle.periodLength || 5,
        cycle: cycleLength,
        ovulation: Math.max(10, Math.min(20, ovulationDay)), // Clamp between 10-20
      };
    });
  };

  const stats = getStats();
  const cyclePieData = getCyclePieData();
  const ovulationDay = getOvulationDay();
  const periodLength = getPeriodLength();
  const insight = getInsight();
  const cycleHistoryData = getCycleHistoryData();
  const cycleLength = dashboardData?.prediction?.averageCycleLength || 
                     predictionData?.averageCycleLength || 28;
  const currentPhase = getCurrentPhase();
  const latestPCOS = getLatestPCOS();

  // Get user-friendly cycle phase labels and days
  const getCyclePhases = () => {
    if (!hasCycleData || !ovulationDay) {
      return [
        { 
          label: "Menstrual Phase", 
          days: "Log to track", 
          color: "#D1D5DB"
        },
        { 
          label: "Follicular Phase", 
          days: "Log to track", 
          color: "#D1D5DB"
        },
        { 
          label: "Fertile Window", 
          days: "Log to track", 
          color: "#D1D5DB"
        },
        { 
          label: "Ovulation", 
          days: "Log to track", 
          color: "#D1D5DB"
        },
        { 
          label: "Luteal Phase", 
          days: "Log to track", 
          color: "#D1D5DB"
        },
      ];
    }

    const periodStart = 1;
    const periodEnd = periodLength;
    const follicularStart = periodEnd + 1;
    const follicularEnd = ovulationDay - 1;
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay - 1;
    const lutealStart = ovulationDay + 1;
    const lutealEnd = cycleLength;

    return [
      { 
        label: "Menstrual Phase", 
        days: `Day ${periodStart} - ${periodEnd}`, 
        color: "#F33B7D"
      },
      { 
        label: "Follicular Phase", 
        days: `Day ${follicularStart} - ${follicularEnd}`, 
        color: "#FBCFE8"
      },
      { 
        label: "Fertile Window", 
        days: `Day ${fertileStart} - ${fertileEnd}`, 
        color: "#A855F7"
      },
      { 
        label: "Ovulation", 
        days: `Day ${ovulationDay}`, 
        color: "#22C55E"
      },
      { 
        label: "Luteal Phase", 
        days: `Day ${lutealStart} - ${lutealEnd}`, 
        color: "#D1D5DB"
      },
    ];
  };

  const cyclePhases = getCyclePhases();

  if (loading) {
    return (
      <DashboardLayout subtitle="Here's your personalized health overview.">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-[#8F8C8C]">Loading your health data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout subtitle="Here's your personalized health overview.">
      {/* Log Health Data Button */}
      <div className="mb-6 flex justify-end">
        <Link to="/cycle-tracker/log">
          <button className="flex items-center gap-1.5 rounded-full bg-[#FEE4EB] px-4 py-2 text-xs font-semibold text-[#F33B7D] hover:bg-[#FDD5E0] transition-colors">
            <Plus className="h-3.5 w-3.5" /> Log Health Data
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Cycle Overview */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Cycle Overview
            </h2>
            <Link to="/cycle-tracker/history?view=calendar" className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
              View Calendar
            </Link>
          </div>

          <div className="relative mx-auto h-36 w-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cyclePieData}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={64}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {cyclePieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-[#8F8C8C]">Day</p>
              <p className="font-display text-2xl font-semibold text-[#0D0D0D]">
                {hasCycleData ? (dashboardData?.prediction?.currentPhase?.cycleDay || 
                 predictionData?.currentPhase?.cycleDay || "-") : "-"}
              </p>
              <p className="text-xs text-[#8F8C8C]">
                {hasCycleData ? `of ${cycleLength}` : "No data"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {cyclePhases.map(({ label, days, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[#3D3939]">{label}</span>
                </div>
                <span className="text-[#B8AEB2]">{days}</span>
              </div>
            ))}
          </div>

          {hasCycleData && currentPhase && (
            <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3 text-center">
              <p className="text-sm font-bold text-[#F33B7D]">
                {currentPhase}
              </p>
            </div>
          )}

          {!hasCycleData && (
            <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3 text-center">
              <p className="text-xs text-[#3D3939]">
                Log your first period to start tracking your cycle.
              </p>
            </div>
          )}
        </div>

        {/* Health Insights */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Health Insights
            </h2>
            <button className="flex items-center gap-1 text-xs font-medium text-[#8F8C8C] hover:text-[#3D3939] transition-colors">
              This Week <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-4">
            {insights.map(({ icon: Icon, title, detail, tag, tagColor }) => (
              <div key={title} className="flex items-start gap-3">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                  <p className="truncate text-xs text-[#8F8C8C]">{detail}</p>
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
            View Detailed Insights →
          </button>
        </div>

        {/* Upcoming Reminders + Tip */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
                Upcoming Reminders
              </h2>
              <button className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {reminders.map(({ title, time, tag, tagColor }) => (
                <div key={title} className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                  >
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                    <p className="truncate text-xs text-[#8F8C8C]">{time}</p>
                  </div>
                  <span
                    className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
            <p className="text-sm font-semibold">Tip of the Day</p>
            <p className="mt-1 max-w-[70%] text-xs text-white/85">
              {insight}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity - Enhanced Layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick Actions - Now spans 2 columns */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-5">
            <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
              Quick Actions
            </h2>
            <p className="text-sm text-[#8F8C8C]">Manage your health with one tap</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map(({ icon: Icon, label, path, description, iconColor, bgColor }, index) => (
              <Link
                key={label}
                to={path}
                className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{ backgroundColor: bgColor }}
                onMouseEnter={() => setHoveredAction(index)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <div className="relative flex flex-col items-start gap-2.5">
                  {/* Icon - background turns dark pink on hover */}
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm"
                    style={{ 
                      backgroundColor: hoveredAction === index ? '#F33B7D' : bgColor
                    }}
                  >
                    <Icon 
                      className="h-6 w-6 transition-all duration-300" 
                      style={{ 
                        color: hoveredAction === index ? '#FFFFFF' : iconColor,
                        strokeWidth: 1.5 
                      }} 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="w-full">
                    <p className="text-sm font-semibold text-[#0D0D0D] group-hover:text-[#F33B7D] transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-[#8F8C8C]">{description}</p>
                  </div>
                  
                  {/* Arrow indicator on hover */}
                  <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ChevronRight className="h-4 w-4" style={{ color: iconColor }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity - Spans 1 column */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
                Recent Activity
              </h2>
              <p className="text-sm text-[#8F8C8C]">Your latest health updates</p>
            </div>
            <button className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.slice(0, 4).map(({ icon: Icon, color, title, detail, time }) => (
              <div 
                key={title} 
                className="group flex items-center gap-4 rounded-xl p-3 transition-all duration-300 hover:bg-[#FEF4F4] cursor-pointer"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0D0D0D]">{title}</p>
                  <p className="truncate text-xs text-[#8F8C8C]">{detail}</p>
                </div>
                <span className="flex-shrink-0 text-[10px] text-[#B8AEB2] group-hover:text-[#8F8C8C] transition-colors">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cycle History + Premium Banner */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(0,0,0,0.04)] ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-[#0D0D0D]">
              Cycle History <span className="font-normal text-[#8F8C8C]">(Last {Math.min(cycleHistoryData.length, 6)} Cycles)</span>
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-[#8F8C8C]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#F33B7D]" /> Period Days
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#A855F7]" /> Cycle Length
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Ovulation Day
              </span>
            </div>
          </div>

          {cycleHistoryData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-[#8F8C8C]">
              No cycle data available yet. Start logging your cycles to see your history.
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleHistoryData}>
                  <CartesianGrid vertical={false} stroke="#F5EAEF" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#8F8C8C" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8F8C8C" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="period" fill="#F33B7D" radius={[3, 3, 0, 0]} barSize={8} />
                  <Bar dataKey="cycle" fill="#A855F7" radius={[3, 3, 0, 0]} barSize={8} />
                  <Line
                    type="monotone"
                    dataKey="ovulation"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <Link to="/cycle-tracker/history" className="mt-3 block w-full text-center text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
            View Full History →
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#F33B7D] p-5 text-white shadow-[0_20px_40px_-10px_rgba(168,85,247,0.4)]">
          <p className="font-display text-base font-semibold">Flora Premium</p>
          <p className="mt-2 text-xs text-white/85 leading-relaxed">
            Unlock advanced insights, expert consultations and personalized
            health plans.
          </p>
          <button className="mt-4 rounded-full bg-white px-6 py-2 text-xs font-semibold text-[#F33B7D] hover:bg-white/90 transition-colors">
            Explore Premium →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}