const Cycle = require("../models/Cycle");
const Pregnancy = require("../models/Pregnancy");
const PCOSAssessment = require("../models/PCOSAssessment");
const MedicalReport = require("../models/MedicalReport");
const Chat = require("../models/Chat");

const { calculateAverageCycleLength } = require("../utils/cyclePrediction");

const toDate = (value) => (value ? new Date(value) : null);

const formatDate = (value) => {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeDate = (value) => {
  const date = toDate(value);
  if (!date || Number.isNaN(date.getTime())) return "Unknown time";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs >= 0) {
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
  }

  return formatDate(date);
};

const getCycleInsight = ({ latestCycle, averageCycleLength, pregnancy }) => {
  if (pregnancy) {
    return {
      id: "cycle",
      type: "cycle",
      title: "Cycle Tracking",
      detail: "Cycle tracking is currently paused while pregnancy tracking is active.",
      tag: "Paused",
      date: pregnancy.updatedAt || pregnancy.createdAt,
    };
  }

  if (!latestCycle) {
    return {
      id: "cycle",
      type: "cycle",
      title: "Cycle Tracking",
      detail: "No period has been logged yet. Your cycle insights will appear here after your first entry.",
      tag: "No Data",
      date: null,
    };
  }

  const periodStart = formatDate(latestCycle.periodStart);
  const cycleLength = latestCycle.cycleLength || averageCycleLength || 28;
  const symptomCount = Array.isArray(latestCycle.symptoms)
    ? latestCycle.symptoms.filter((symptom) => symptom !== "none").length
    : 0;

  return {
    id: "cycle",
    type: "cycle",
    title: "Cycle Tracking",
    detail: `Latest period started ${periodStart} • Recorded cycle length ${cycleLength} days${
      symptomCount ? ` • ${symptomCount} symptom${symptomCount === 1 ? "" : "s"} logged` : ""
    }.`,
    tag: symptomCount ? "Tracked" : "Active",
    date: latestCycle.updatedAt || latestCycle.createdAt || latestCycle.periodStart,
  };
};

const getPcosInsight = (latestAssessment) => {
  if (!latestAssessment) {
    return {
      id: "pcos",
      type: "pcos",
      title: "PCOS Screening",
      detail: "No PCOS assessment has been completed yet.",
      tag: "No Data",
      date: null,
    };
  }

  const probability = Math.round(Number(latestAssessment.probability) || 0);
  const risk = latestAssessment.risk || "Unknown";

  return {
    id: "pcos",
    type: "pcos",
    title: "PCOS Screening",
    detail: `Latest screening: ${risk} risk (${probability}% probability), completed ${formatDate(
      latestAssessment.createdAt
    )}.`,
    tag: risk,
    date: latestAssessment.createdAt,
  };
};

const getMedicalInsight = (reports, totalReports) => {
  if (!reports.length) {
    return {
      id: "medical-report",
      type: "medical-report",
      title: "Medical Reports",
      detail: "No medical reports have been uploaded yet.",
      tag: "No Data",
      date: null,
    };
  }

  const latestReport = reports[0];
  const reportCount = totalReports || reports.length;
  const status = latestReport.processingStatus || "uploaded";
  const readableStatus = status.replace(/_/g, " ");
  const reportType = latestReport.reportType || "Medical report";
  const latestAbnormalCount = Array.isArray(latestReport.abnormalResults)
    ? latestReport.abnormalResults.length
    : 0;

  let detail = `${reportCount} report${reportCount === 1 ? "" : "s"} on your account. Latest: ${reportType} (${readableStatus}) uploaded ${formatDate(
    latestReport.createdAt
  )}.`;

  if (latestAbnormalCount > 0) {
    detail += ` Latest analysis contains ${latestAbnormalCount} abnormal result${latestAbnormalCount === 1 ? "" : "s"}.`;
  }

  return {
    id: "medical-report",
    type: "medical-report",
    title: "Medical Reports",
    detail,
    tag: latestAbnormalCount > 0 ? "Review" : status === "completed" ? "Analyzed" : "Processing",
    date: latestReport.updatedAt || latestReport.createdAt,
  };
};

const getConsultationInsight = (chats, activeCount, pendingCount) => {
  if (!chats.length) {
    return {
      id: "consultation",
      type: "consultation",
      title: "Doctor Care",
      detail: "No doctor consultations have been started yet.",
      tag: "No Data",
      date: null,
    };
  }

  const latest = chats[0];
  const doctorName = latest.doctor?.fullName || "your doctor";

  const statusParts = [];
  if (activeCount) statusParts.push(`${activeCount} active`);
  if (pendingCount) statusParts.push(`${pendingCount} pending`);
  if (!statusParts.length) statusParts.push("No active consultations");

  return {
    id: "consultation",
    type: "consultation",
    title: "Doctor Care",
    detail: `${statusParts.join(", ")} consultation${chats.length === 1 ? "" : "s"}. Latest: ${doctorName}.`,
    tag: activeCount ? "Active" : pendingCount ? "Pending" : "History",
    date: latest.lastMessageAt || latest.updatedAt || latest.createdAt,
  };
};

const buildRecentActivity = ({ cycles, assessments, reports, chats }) => {
  const activity = [];

  cycles.forEach((cycle) => {
    activity.push({
      id: `cycle-${cycle._id}`,
      type: "cycle",
      title: "Period Logged",
      detail: `Period started ${formatDate(cycle.periodStart)}${
        cycle.periodLength ? ` • ${cycle.periodLength}-day flow` : ""
      }${
        cycle.symptoms?.length
          ? ` • ${cycle.symptoms.length} symptom${cycle.symptoms.length === 1 ? "" : "s"}`
          : ""
      }.`,
      createdAt: cycle.updatedAt || cycle.createdAt || cycle.periodStart,
      link: `/cycle-tracker/${cycle._id}`,
    });
  });

  assessments.forEach((assessment) => {
    activity.push({
      id: `pcos-${assessment._id}`,
      type: "pcos",
      title: "PCOS Assessment Completed",
      detail: `${assessment.risk || "Unknown"} risk • ${Math.round(
        Number(assessment.probability) || 0
      )}% probability.`,
      createdAt: assessment.createdAt,
      link: `/pcos-detection/${assessment._id}`,
    });
  });

  reports.forEach((report) => {
    const status = report.processingStatus || "uploaded";
    const title = status === "completed" ? "Medical Report Analyzed" : "Medical Report Uploaded";
    const resultCount = Array.isArray(report.abnormalResults) ? report.abnormalResults.length : 0;

    activity.push({
      id: `report-${report._id}`,
      type: "medical-report",
      title,
      detail: `${report.reportType || "Medical report"}${
        resultCount ? ` • ${resultCount} abnormal result${resultCount === 1 ? "" : "s"}` : ""
      } • ${status.replace(/_/g, " ")}.`,
      createdAt: report.updatedAt || report.createdAt,
      link: `/medical-reports/${report._id}`,
    });
  });

  chats.forEach((chat) => {
    const doctorName = chat.doctor?.fullName || "your doctor";
    const lastMessageText = chat.lastMessage?.message?.trim();
    const isMessageEvent = Boolean(chat.lastMessageAt && lastMessageText);

    activity.push({
      id: `consultation-${chat._id}`,
      type: "consultation",
      title: isMessageEvent ? `Message with ${doctorName}` : "Consultation Updated",
      detail: isMessageEvent
        ? lastMessageText
        : `Consultation status: ${(chat.status || "unknown").replace(/_/g, " ")}.`,
      createdAt: chat.lastMessageAt || chat.updatedAt || chat.createdAt,
      link: "/chat",
    });
  });

  return activity
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((item) => ({
      ...item,
      timeLabel: formatRelativeDate(item.createdAt),
    }));
};

const getDashboardSummary = async (userId) => {
  const [
    cycles,
    assessments,
    reports,
    totalReports,
    chats,
    activeConsultations,
    pendingConsultations,
    pregnancy,
  ] = await Promise.all([
    Cycle.find({ user: userId })
      .sort({ updatedAt: -1, periodStart: -1 })
      .limit(6)
      .lean(),
    PCOSAssessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    MedicalReport.find({ user: userId })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(6)
      .select("fileName reportType processingStatus abnormalResults createdAt updatedAt")
      .lean(),
    MedicalReport.countDocuments({ user: userId }),
    Chat.find({ patient: userId })
      .sort({ lastMessageAt: -1, updatedAt: -1, createdAt: -1 })
      .limit(6)
      .populate("doctor", "fullName profilePicture specialization")
      .populate("lastMessage", "message createdAt sender")
      .lean(),
    Chat.countDocuments({ patient: userId, status: "active" }),
    Chat.countDocuments({ patient: userId, status: "pending" }),
    Pregnancy.findOne({ user: userId, isActive: true })
      .select("lastPeriodDate dueDate currentWeek trimester createdAt updatedAt")
      .lean(),
  ]);

  const cycleHistoryForAverage = [...cycles].sort(
    (a, b) => new Date(a.periodStart) - new Date(b.periodStart)
  );
  const averageCycleLength = cycleHistoryForAverage.length
    ? calculateAverageCycleLength(cycleHistoryForAverage)
    : 28;
  const latestCycle = cycles[0] || null;
  const latestAssessment = assessments[0] || null;
  return {
    generatedAt: new Date(),
    insights: [
      getCycleInsight({ latestCycle, averageCycleLength, pregnancy }),
      getPcosInsight(latestAssessment),
      getMedicalInsight(reports, totalReports),
      getConsultationInsight(chats, activeConsultations, pendingConsultations),
    ].map((insight) => ({
      ...insight,
      timeLabel: insight.date ? formatRelativeDate(insight.date) : null,
    })),
    recentActivity: buildRecentActivity({ cycles, assessments, reports, chats }),
  };
};

module.exports = {
  getDashboardSummary,
};
