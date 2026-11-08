const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const notificationService = require("../services/notification.service");
const { emitToUser } = require("../socket/services/socketEmitter");
const SOCKET_EVENTS = require("../constants/socketEvents");

const emitUnreadCount = async (userId) => {
  const unreadCount = await notificationService.getUnreadCount(userId);
  emitToUser(userId, SOCKET_EVENTS.NOTIFICATION_COUNT_UPDATED, { unreadCount });
};

exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getNotifications(req.user._id, {
    limit: req.query.limit,
    unreadOnly: req.query.unreadOnly === "true",
  });

  return res.status(200).json(
    new ApiResponse(200, "Notifications fetched successfully", notifications)
  );
});

exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Unread notification count fetched successfully", { count })
  );
});

exports.markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(
    req.user._id,
    req.params.id
  );

  if (!notification) {
    return res.status(404).json(
      new ApiResponse(404, "Notification not found", null)
    );
  }

  await emitUnreadCount(req.user._id);
  emitToUser(req.user._id, SOCKET_EVENTS.NOTIFICATION_UPDATED, notification);

  return res.status(200).json(
    new ApiResponse(200, "Notification marked as read", notification)
  );
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  await emitUnreadCount(req.user._id);
  emitToUser(req.user._id, SOCKET_EVENTS.NOTIFICATION_UPDATED, { markAllRead: true });

  return res.status(200).json(
    new ApiResponse(200, "All notifications marked as read", null)
  );
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.deleteNotification(
    req.user._id,
    req.params.id
  );

  if (!notification) {
    return res.status(404).json(
      new ApiResponse(404, "Notification not found", null)
    );
  }

  await emitUnreadCount(req.user._id);
  emitToUser(req.user._id, SOCKET_EVENTS.NOTIFICATION_DELETED, { id: req.params.id });

  return res.status(200).json(
    new ApiResponse(200, "Notification deleted successfully", null)
  );
});