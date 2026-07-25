/**
 * Phoenix V21: Hackathon Phase & Deadline Notifications Service
 * Calculates countdown metrics and priority alerts.
 */

const ragService = require('./rag_service');

class HackathonNotificationService {
  /**
   * Evaluates active deadlines and builds dynamic alerts
   */
  getDeadlineAlerts() {
    const hackathons = ragService.getCatalog();
    const alerts = [];

    hackathons.forEach(hack => {
      const now = new Date();
      const startObj = new Date(hack.startDate);
      const deadlineObj = new Date(hack.deadlineDate);

      // Verify date validity to prevent NaN calculations
      if (isNaN(startObj.getTime()) || isNaN(deadlineObj.getTime())) {
          return;
      }

      const timeToStart = startObj - now;
      const timeToDeadline = deadlineObj - now;

      // Calculate time metrics in hours/days
      const startDays = Math.ceil(timeToStart / (1000 * 60 * 60 * 24));
      const deadlineDays = Math.ceil(timeToDeadline / (1000 * 60 * 60 * 24));

      if (timeToDeadline < 0) {
        alerts.push({
          hackathonId: hack.id,
          name: hack.name,
          event: "Submission Overdue",
          message: `The submission portal for ${hack.name} closed on ${new Date(hack.deadlineDate).toDateString()}`,
          severity: "critical",
          timeString: "Expired"
        });
      } else if (timeToDeadline <= 2 * 24 * 60 * 60 * 1000) { // less than 2 days
        alerts.push({
          hackathonId: hack.id,
          name: hack.name,
          event: "Submission Closing Soon",
          message: `🚨 URGENT: Less than 48 hours left to submit ideas/code for ${hack.name}!`,
          severity: "high",
          timeString: `${deadlineDays} day(s) left`
        });
      } else if (timeToStart > 0 && timeToStart <= 3 * 24 * 60 * 60 * 1000) { // starts in less than 3 days
        alerts.push({
          hackathonId: hack.id,
          name: hack.name,
          event: "Kickoff Approaching",
          message: `🚀 Prepare your stack! ${hack.name} starts in ${startDays} day(s).`,
          severity: "medium",
          timeString: `${startDays} day(s) until start`
        });
      } else {
        alerts.push({
          hackathonId: hack.id,
          name: hack.name,
          event: "Upcoming",
          message: `${hack.name} is scheduled for registration. Check details soon.`,
          severity: "low",
          timeString: `${deadlineDays} day(s) remaining`
        });
      }
    });

    return alerts;
  }
}

const notificationInstance = new HackathonNotificationService();

module.exports = notificationInstance;
