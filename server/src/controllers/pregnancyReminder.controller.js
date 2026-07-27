const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const pregnancyReminderService = require("../services/pregnancyReminder.service");

// Get all reminders
exports.getReminders = asyncHandler(async (req, res) => {
  const reminders = await pregnancyReminderService.getReminders(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { reminders },
      "Pregnancy reminders fetched successfully"
    )
  );
});

// Mark reminder as completed
exports.completeReminder = asyncHandler(async (req, res) => {
  const reminder =
    await pregnancyReminderService.completeReminder(
      req.user._id,
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      { reminder },
      "Reminder marked as completed"
    )
  );
});

exports.getUpcomingReminder = asyncHandler(async (req, res) => {
  const reminder =
    await pregnancyReminderService.getUpcomingReminder(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      { reminder },
      "Upcoming reminder fetched successfully"
    )
  );
});