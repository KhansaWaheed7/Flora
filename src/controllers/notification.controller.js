const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const notificationService = require("../services/notification.service");

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

  return res.status(200).json(
    new ApiResponse(200, "Notification marked as read", notification)
  );
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "All notifications marked as read", null)
  );
});
