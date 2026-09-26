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
import { getConversations } from "../../services/chat.service";
import { getAssessmentHistory } from "../../services/pcos.service";
import { getPregnancyDashboard, trimesterLabel } from "../../services/pregnancy.service";
import { getNotifications } from "../../services/notification.service";

// Pink-toned neutral palette (replaces the old dead-grey tones)
//   primaryText  : #3D2A33  (deep plum-grey, softer than pure black)
//   secondaryText: #A8849A  (muted mauve-pink for labels/subtext)
//   tertiaryText : #C9A8B8  (soft rose for hints/units)
//   placeholder  : #D9BFCB  (blush for empty states)
//   divider      : #F5E4EC  (warm pink divider)
//   softFill     : #FDF2F7  (very light pink for backgrounds)

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
    key: "unreadMessages",
    value: 0,
    unit: "",
    sub: "From Doctor",
    color: "#3B82F6",
    icon: MessageCircle,
  },
];

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

const quickActions = [
  {
    icon: Calendar,
    label: "Log Period",
    path: "/cycle-tracker/log",
    description: "Track your cycle",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: ShieldCheck,
    label: "PCOS Assessment",
    path: "/pcos-detection",
    description: "Check your risk",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: Upload,
    label: "Upload Report",
    path: "#",
    description: "Analyze health data",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: MessageCircle,
    label: "Talk to Doctor",
    path: "#",
    description: "Get expert advice",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: Bot,
    label: "Gynae Assistant",
    path: "#",
    description: "AI health guidance",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: BookOpen,
    label: "Health Education",
    path: "#",
    description: "Learn more",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: Apple,
    label: "Diet & Nutrition",
    path: "#",
    description: "Healthy eating guide",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
  {
    icon: Dumbbell,
    label: "Exercise",
    path: "#",
    description: "Stay active & fit",
    iconColor: "#F33B7D",
    bgColor: "#FEE4EB",
  },
];

// Normalizes notification responses so we handle both plain arrays
// and wrapped payloads ({ data: [] } or { notifications: [] }) consistently.
const normalizeNotifications = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.notifications)) return res.notifications;
  return [];
};

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
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs text-[#A8849A]">{label}</p>
      </div>
      <p className="mt-2 font-display text-xl font-semibold text-[#3D2A33]">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-[#C9A8B8]">{unit}</span>}
      </p>
      <p className="mt-0.5 text-xs text-[#C9A8B8]">{sub}</p>
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

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
  }, [user?.role, navigate]);

  const [dashboardData, setDashboardData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [latestNotifications, setLatestNotifications] = useState([]);
  const [cyclesData, setCyclesData] = useState([]);
  const [pcosAssessments, setPcosAssessments] = useState([]);
  const [pregnancyData, setPregnancyData] = useState(null);
  const cycleTrackingPaused = !!pregnancyData?.pregnancy;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasCycleData, setHasCycleData] = useState(false);
  const [cycleNeedsNewEntry, setCycleNeedsNewEntry] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      return;
    }

    const loadData = async () => {
      try {
        const [
          dashboardRes,
          predictionRes,
          cyclesRes,
          pcosRes,
          pregnancyRes,
          conversationsRes,
          notificationsRes,
        ] = await Promise.all([
          getCycleDashboard().catch(() => ({ data: null })),
          getPrediction().catch(() => ({ data: null })),
          getCycles().catch(() => ({ data: [] })),
          getAssessmentHistory().catch(() => []),
          getPregnancyDashboard().catch(() => ({ data: null })),
          getConversations().catch(() => []),
          getNotifications({ limit: 6 }).catch(() => []),
        ]);

        const dashboard = dashboardRes.data || dashboardRes || null;
        const prediction = predictionRes.data || predictionRes || null;
        const cycles = cyclesRes.data || cyclesRes.cycles || cyclesRes || [];
        const pcos = Array.isArray(pcosRes) ? pcosRes : [];
        const pregnancy = pregnancyRes?.pregnancy ? pregnancyRes : null;

        const conversations = Array.isArray(conversationsRes)
          ? conversationsRes
          : [];

        const totalUnread = conversations.reduce(
          (total, chat) => total + (chat?.unreadCount || 0),
          0
        );

        setDashboardData(dashboard);
        setPredictionData(prediction);
        setCyclesData(Array.isArray(cycles) ? cycles : []);
        setPcosAssessments(pcos);
        setPregnancyData(pregnancy);
        setUnreadMessages(totalUnread);
        setLatestNotifications(normalizeNotifications(notificationsRes));

        const requiresNewCycle =
          dashboard?.prediction?.requiresNewCycle === true ||
          dashboard?.prediction?.reason === "needs_new_cycle";

        setCycleNeedsNewEntry(requiresNewCycle);

        const hasData =
          !requiresNewCycle &&
          ((Array.isArray(cycles) && cycles.length > 0) ||
            (dashboard && (dashboard.latestCycle || dashboard.prediction)));
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

  useEffect(() => {
    if (!user?._id || user?.role === "admin") return;

    const refreshNotifications = async () => {
      try {
        const res = await getNotifications({ limit: 6 });
        setLatestNotifications(normalizeNotifications(res));
      } catch (err) {
        console.error("Could not refresh dashboard notifications:", err);
      }
    };

    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?._id, user?.role]);

  const getLatestPCOS = () => {
    if (!pcosAssessments || pcosAssessments.length === 0) {
      return null;
    }
    const sorted = [...pcosAssessments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted[0];
  };

  const getStats = () => {
    const stats = [...statsConfig];

    stats[4].value = unreadMessages;
    stats[4].sub = unreadMessages === 1 ? "Unread Message" : "Unread Messages";

    if (pregnancyData?.pregnancy) {
      const { currentWeek, trimester } = pregnancyData.pregnancy;

      const weeksDisplay = currentWeek ? `${currentWeek} Weeks` : "No Data";
      const trimesterDisplay = trimester
        ? trimesterLabel[trimester] || "Unknown"
        : "No Data";

      stats[3].value = weeksDisplay;
      stats[3].sub = trimesterDisplay;

      if (trimester === 1) stats[3].color = "#22C55E";
      else if (trimester === 2) stats[3].color = "#F59E0B";
      else if (trimester === 3) stats[3].color = "#F33B7D";
    } else {
      stats[3].value = "Not Tracking";
      stats[3].sub = "Start tracking";
      stats[3].color = "#C9A8B8";
    }

    if (cycleTrackingPaused) {
      stats[0].value = "Paused";
      stats[0].unit = "";
      stats[0].sub = "Pregnancy tracking";

      stats[1].value = "Paused";
      stats[1].unit = "";
      stats[1].sub = "Pregnancy tracking";
    } else if (cycleNeedsNewEntry) {
      stats[0].value = "No tracking";
      stats[0].unit = "";
      stats[0].sub = "Log your new period";

      stats[1].value = "No tracking";
      stats[1].unit = "";
      stats[1].sub = "Log your new period";
    } else if (!hasCycleData) {
      stats[0].value = "No data";
      stats[0].unit = "";
      stats[0].sub = "Log your period";

      stats[1].value = "No data";
      stats[1].unit = "";
      stats[1].sub = "Log your period";
    } else {
      if (predictionData?.nextPeriod) {
        const daysUntil = Math.ceil(
          (new Date(predictionData.nextPeriod) - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        stats[0].value = daysUntil > 0 ? daysUntil : 0;
        stats[0].sub = daysUntil > 0 ? "Days Left" : "Due Today";
      } else {
        stats[0].value = "No data";
        stats[0].sub = "Log your period";
      }

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
      } else {
        stats[1].value = "No data";
        stats[1].unit = "";
        stats[1].sub = "Log your period";
      }
    }

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
      stats[2].color = "#C9A8B8";
    }

    return stats;
  };

  const getCyclePieData = () => {
    if (cycleTrackingPaused || cycleNeedsNewEntry || !hasCycleData) {
      return [{ name: "No Data", value: 1, color: "#F3DCE7" }];
    }

    const cycleDay =
      dashboardData?.prediction?.currentPhase?.cycleDay ||
      predictionData?.currentPhase?.cycleDay ||
      1;
    const cycleLength =
      dashboardData?.prediction?.averageCycleLength ||
      predictionData?.averageCycleLength ||
      28;

    return [
      { name: "Current Day", value: cycleDay, color: "#F33B7D" },
      {
        name: "Remaining",
        value: Math.max(0, cycleLength - cycleDay),
        color: "#FBCFE8",
      },
    ];
  };

  const getPeriodLength = () => {
    if (!hasCycleData) return 5;

    if (predictionData?.periodLength) {
      return predictionData.periodLength;
    }
    if (dashboardData?.prediction?.periodLength) {
      return dashboardData.prediction.periodLength;
    }

    if (cyclesData.length > 0) {
      const latestCycle = cyclesData[cyclesData.length - 1];
      if (latestCycle?.periodLength) {
        return latestCycle.periodLength;
      }
    }

    return 5;
  };

  const getOvulationDay = () => {
    if (!hasCycleData) return null;

    if (predictionData?.ovulation) {
      const ovDate = new Date(predictionData.ovulation);
      const day = ovDate.getDate();
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

    const cycleLength =
      dashboardData?.prediction?.averageCycleLength ||
      predictionData?.averageCycleLength ||
      28;

    const calculatedOvulation = cycleLength - 14;

    if (calculatedOvulation >= 10 && calculatedOvulation <= 20) {
      return calculatedOvulation;
    }

    return 14;
  };

  const getCurrentPhase = () => {
    if (!hasCycleData) {
      return null;
    }

    let phase =
      dashboardData?.prediction?.currentPhase?.phase ||
      predictionData?.currentPhase?.phase;

    if (!phase) return null;

    const phaseLower = phase.toLowerCase();
    if (
      phaseLower === "menstrual" ||
      phaseLower === "follicular" ||
      phaseLower === "luteal" ||
      phaseLower === "ovulation"
    ) {
      if (phaseLower === "ovulation") {
        return "Ovulation";
      }
      return `${phase} Phase`;
    }

    return phase;
  };

  const getInsight = () => {
    if (!hasCycleData) {
      return "Start logging your periods to get personalized health insights.";
    }

    const insights =
      dashboardData?.prediction?.health?.insights ||
      predictionData?.health?.insights ||
      ["Log your next period to keep predictions accurate."];
    return insights[0] || "Log your next period to keep predictions accurate.";
  };

  const getCycleHistoryData = () => {
    if (!cyclesData || cyclesData.length === 0) {
      return [];
    }

    const sortedCycles = [...cyclesData]
      .filter((c) => c.periodStart)
      .sort((a, b) => new Date(a.periodStart) - new Date(b.periodStart));

    const lastSixCycles = sortedCycles.slice(-6);

    return lastSixCycles.map((cycle) => {
      const startDate = new Date(cycle.periodStart);
      const month = startDate.toLocaleDateString("en-US", { month: "short" });

      const cycleLength = cycle.cycleLength || 28;
      const ovulationDay = cycleLength - 14;

      return {
        month: month,
        period: cycle.periodLength || 5,
        cycle: cycleLength,
        ovulation: Math.max(10, Math.min(20, ovulationDay)),
      };
    });
  };

  const stats = getStats();
  const cyclePieData = getCyclePieData();
  const ovulationDay = getOvulationDay();
  const periodLength = getPeriodLength();
  const insight = getInsight();
  const cycleHistoryData = getCycleHistoryData();
  const cycleLength =
    dashboardData?.prediction?.averageCycleLength ||
    predictionData?.averageCycleLength ||
    28;
  const currentPhase = getCurrentPhase();
  const latestPCOS = getLatestPCOS();

  const getCyclePhases = () => {
    if (cycleTrackingPaused) {
      return [
        { label: "Menstrual Phase", days: "Paused", color: "#EBD0DC" },
        { label: "Follicular Phase", days: "Paused", color: "#EBD0DC" },
        { label: "Fertile Window", days: "Paused", color: "#EBD0DC" },
        { label: "Ovulation", days: "Paused", color: "#EBD0DC" },
        { label: "Luteal Phase", days: "Paused", color: "#EBD0DC" },
      ];
    }

    if (cycleNeedsNewEntry) {
      return [
        { label: "Menstrual Phase", days: "Log new period", color: "#EBD0DC" },
        { label: "Follicular Phase", days: "Log new period", color: "#EBD0DC" },
        { label: "Fertile Window", days: "Log new period", color: "#EBD0DC" },
        { label: "Ovulation", days: "Log new period", color: "#EBD0DC" },
        { label: "Luteal Phase", days: "Log new period", color: "#EBD0DC" },
      ];
    }

    if (!hasCycleData || !ovulationDay) {
      return [
        { label: "Menstrual Phase", days: "Log to track", color: "#EBD0DC" },
        { label: "Follicular Phase", days: "Log to track", color: "#EBD0DC" },
        { label: "Fertile Window", days: "Log to track", color: "#EBD0DC" },
        { label: "Ovulation", days: "Log to track", color: "#EBD0DC" },
        { label: "Luteal Phase", days: "Log to track", color: "#EBD0DC" },
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
        color: "#F33B7D",
      },
      {
        label: "Follicular Phase",
        days: `Day ${follicularStart} - ${follicularEnd}`,
        color: "#FBCFE8",
      },
      {
        label: "Fertile Window",
        days: `Day ${fertileStart} - ${fertileEnd}`,
        color: "#A855F7",
      },
      { label: "Ovulation", days: `Day ${ovulationDay}`, color: "#22C55E" },
      {
        label: "Luteal Phase",
        days: `Day ${lutealStart} - ${lutealEnd}`,
        color: "#EBD0DC",
      },
    ];
  };

  const cyclePhases = getCyclePhases();

  if (loading) {
    return (
      <DashboardLayout subtitle="Here's your personalized health overview.">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-[#A8849A]">Loading your health data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout subtitle="Here's your personalized health overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Cycle Overview */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#3D2A33]">
              Cycle Overview
            </h2>
            <Link
              to="/cycle-tracker/history?view=calendar"
              className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors"
            >
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
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              {cycleTrackingPaused ? (
                <>
                  <p className="font-display text-sm font-semibold text-[#A8849A]">
                    Paused
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#C9A8B8]">
                    Pregnancy tracking
                  </p>
                </>
              ) : cycleNeedsNewEntry ? (
                <>
                  <p className="font-display text-sm font-semibold text-[#A8849A]">
                    No tracking
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#C9A8B8]">
                    Log your new period
                  </p>
                </>
              ) : hasCycleData ? (
                <>
                  <p className="text-xs text-[#A8849A]">Day</p>
                  <p className="font-display text-2xl font-semibold text-[#3D2A33]">
                    {dashboardData?.prediction?.currentPhase?.cycleDay ||
                      predictionData?.currentPhase?.cycleDay ||
                      "-"}
                  </p>
                  <p className="text-xs text-[#A8849A]">of {cycleLength}</p>
                </>
              ) : (
                <>
                  <p className="font-display text-sm font-semibold text-[#A8849A]">
                    No data
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#C9A8B8]">
                    Log your period
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {cyclePhases.map(({ label, days, color }) => (
              <div
                key={label}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[#3D2A33]">{label}</span>
                </div>
                <span className="text-[#C9A8B8]">{days}</span>
              </div>
            ))}
          </div>

          {cycleTrackingPaused && (
            <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3 text-center">
              <p className="text-sm font-bold text-[#F33B7D]">
                Cycle Tracking Paused
              </p>
              <p className="mt-1 text-xs text-[#3D2A33]">
                Cycle tracking is paused while pregnancy is being tracked.
              </p>
            </div>
          )}

          {!cycleTrackingPaused && cycleNeedsNewEntry && (
            <div className="mt-4 rounded-2xl border border-[#F0DCE4] bg-[#FFF7FA] p-4">
              <h3 className="text-sm font-semibold text-[#3D2A33]">
                Start a new cycle
              </h3>
              <p className="mt-1 text-xs text-[#A8849A]">
                Your pregnancy tracking has ended. Please enter your latest
                period details to start menstrual cycle tracking again.
              </p>
              <Link
                to="/cycle-tracker/log"
                className="mt-3 inline-flex rounded-full bg-[#F33B7D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d92b6b] transition-colors"
              >
                Log New Period
              </Link>
            </div>
          )}

          {!cycleTrackingPaused && !cycleNeedsNewEntry && hasCycleData && currentPhase && (
            <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3 text-center">
              <p className="text-sm font-bold text-[#F33B7D]">{currentPhase}</p>
            </div>
          )}

          {!cycleTrackingPaused && !cycleNeedsNewEntry && !hasCycleData && (
            <div className="mt-4 rounded-xl bg-[#FEE4EB] p-3 text-center">
              <p className="text-xs text-[#3D2A33]">
                Log your first period to start tracking your cycle.
              </p>
            </div>
          )}
        </div>

        {/* Health Insights */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_-6px_rgba(243,59,125,0.10),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-[#F5E4EC]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#3D2A33]">
              Health Insights
            </h2>
            <button className="flex items-center gap-1 text-xs font-medium text-[#A8849A] hover:text-[#F33B7D] transition-colors">
              This Week <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-[#F5E4EC]">
            {insights.map(({ icon: Icon, title, detail, tag, tagColor }) => (
              <div
                key={title}
                className="group flex items-start gap-3 px-2 py-3 -mx-2 first:pt-0 last:pb-0 rounded-xl transition-all duration-200 hover:bg-[#FEF4F4] hover:shadow-[0_2px_8px_rgba(243,59,125,0.06)]"
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-[#F5E4EC] transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#3D2A33]">
                    {title}
                  </p>
                  <p className="truncate text-xs text-[#A8849A]">{detail}</p>
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ring-1 ring-[#F5E4EC]"
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

        {/* Latest Notifications + Tip */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_-6px_rgba(243,59,125,0.10),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-[#F5E4EC]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#3D2A33]">
                Latest Notifications
              </h2>
              <Link
                to="/notifications"
                className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b]"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-[#F5E4EC]">
              {latestNotifications.length > 0 ? (
                latestNotifications.slice(0, 5).map((notification) => (
                  <Link
                    key={notification._id}
                    to={notification.link || "/notifications"}
                    className="group relative flex items-center gap-3 px-2 py-3 -mx-2 first:pt-0 last:pb-0 rounded-xl transition-all duration-200 hover:bg-[#FEF4F4] hover:shadow-[0_2px_8px_rgba(243,59,125,0.06)]"
                  >
                    {!notification.read && (
                      <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#F33B7D] shadow-[0_0_0_3px_rgba(243,59,125,0.15)]" />
                    )}
                    <span className="ml-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#FEE4EB] text-[#F33B7D] shadow-sm ring-1 ring-[#F5E4EC] transition-transform duration-200 group-hover:scale-105">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#3D2A33]">
                        {notification.title}
                      </p>
                      <p className="truncate text-xs text-[#A8849A]">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#F33B7D] shadow-[0_0_0_3px_rgba(243,59,125,0.15)]" />
                    )}
                  </Link>
                ))
              ) : (
                <div className="py-5 text-center text-xs text-[#C9A8B8]">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#F33B7D] p-4 text-white shadow-[0_10px_24px_-4px_rgba(243,59,125,0.4)]">
            <p className="text-sm font-semibold">Tip of the Day</p>
            <p className="mt-1 max-w-[70%] text-xs text-white/85">{insight}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity - Enhanced Layout */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick Actions - Now spans 2 columns */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC] lg:col-span-2">
          <div className="mb-5">
            <h2 className="font-display text-lg font-semibold text-[#3D2A33]">
              Quick Actions
            </h2>
            <p className="text-sm text-[#A8849A]">
              Manage your health with one tap
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map(
              (
                { icon: Icon, label, path, description, iconColor, bgColor },
                index
              ) => (
                <Link
                  key={label}
                  to={path}
                  className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{ backgroundColor: bgColor }}
                  onMouseEnter={() => setHoveredAction(index)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <div className="relative flex flex-col items-start gap-2.5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm"
                      style={{
                        backgroundColor:
                          hoveredAction === index ? "#F33B7D" : bgColor,
                      }}
                    >
                      <Icon
                        className="h-6 w-6 transition-all duration-300"
                        style={{
                          color:
                            hoveredAction === index ? "#FFFFFF" : iconColor,
                          strokeWidth: 1.5,
                        }}
                      />
                    </div>

                    <div className="w-full">
                      <p className="text-sm font-semibold text-[#3D2A33] group-hover:text-[#F33B7D] transition-colors">
                        {label}
                      </p>
                      <p className="text-xs text-[#A8849A]">{description}</p>
                    </div>

                    <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ChevronRight
                        className="h-4 w-4"
                        style={{ color: iconColor }}
                      />
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Recent Activity - Spans 1 column */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_-6px_rgba(243,59,125,0.10),0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-[#F5E4EC]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#3D2A33]">
                Recent Activity
              </h2>
              <p className="text-sm text-[#A8849A]">
                Your latest health updates
              </p>
            </div>
            <button className="text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors">
              View All
            </button>
          </div>

          <div className="divide-y divide-[#F5E4EC]">
            {recentActivity
              .slice(0, 4)
              .map(({ icon: Icon, color, title, detail, time }) => (
                <div
                  key={title}
                  className="group relative flex items-center gap-4 px-3 py-3.5 -mx-3 first:pt-0 last:pb-0 rounded-xl transition-all duration-300 hover:bg-[#FEF4F4] hover:shadow-[0_2px_8px_rgba(243,59,125,0.06)] cursor-pointer"
                >
                  <span
                    className="absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-[#F5E4EC] transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#3D2A33]">
                      {title}
                    </p>
                    <p className="truncate text-xs text-[#A8849A]">{detail}</p>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-[#FDF2F7] px-2 py-0.5 text-[10px] font-medium text-[#C9A8B8] transition-colors group-hover:bg-white group-hover:text-[#A8849A]">
                    {time}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Cycle History + Premium Banner */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_14px_rgba(243,59,125,0.06)] ring-1 ring-[#F5E4EC] lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-semibold text-[#3D2A33]">
              Cycle History{" "}
              <span className="font-normal text-[#A8849A]">
                {cycleHistoryData.length > 0
                  ? `(Last ${Math.min(cycleHistoryData.length, 6)} Cycles)`
                  : "(No data yet)"}
              </span>
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-[#A8849A]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#F33B7D]" /> Period
                Days
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#A855F7]" /> Cycle
                Length
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Ovulation
                Day
              </span>
            </div>
          </div>

          {cycleHistoryData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-[#A8849A]">
              No cycle data available yet. Start logging your cycles to see your
              history.
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleHistoryData}>
                  <CartesianGrid vertical={false} stroke="#F5E4EC" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#A8849A" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#A8849A" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="period"
                    fill="#F33B7D"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
                  <Bar
                    dataKey="cycle"
                    fill="#A855F7"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                  />
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

          <Link
            to="/cycle-tracker/history"
            className="mt-3 block w-full text-center text-xs font-semibold text-[#F33B7D] hover:text-[#d92b6b] transition-colors"
          >
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