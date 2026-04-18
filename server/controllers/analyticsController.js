const Complaint = require('../models/Complaint');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res, next) => {
  try {
    // Get total complaints count
    const totalComplaints = await Complaint.countDocuments();

    // Get complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get complaints by status
    const complaintsByStatus = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get complaints by priority
    const complaintsByPriority = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get complaints over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaintsOverTime = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);

    // Format complaints over time for chart
    const formattedTimeData = complaintsOverTime.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(
        item._id.day
      ).padStart(2, '0')}`,
      count: item.count,
    }));

    // Get recent activity (last 5 complaints)
    const recentActivity = await Complaint.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt createdBy');

    // Calculate resolution rate
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const resolutionRate = totalComplaints > 0 
      ? Math.round((resolvedCount / totalComplaints) * 100) 
      : 0;

    // Get average resolution time (for resolved complaints)
    const resolutionTimes = await Complaint.aggregate([
      {
        $match: {
          status: 'Resolved',
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionTime: {
            $subtract: ['$resolvedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTime' },
        },
      },
    ]);

    const avgResolutionTime = resolutionTimes.length > 0 
      ? Math.round(resolutionTimes[0].avgResolutionTime / (1000 * 60 * 60 * 24)) // Convert to days
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalComplaints,
        resolutionRate,
        avgResolutionTime,
        complaintsByCategory: complaintsByCategory.map((item) => ({
          category: item._id,
          count: item.count,
        })),
        complaintsByStatus: complaintsByStatus.map((item) => ({
          status: item._id,
          count: item.count,
        })),
        complaintsByPriority: complaintsByPriority.map((item) => ({
          priority: item._id,
          count: item.count,
        })),
        complaintsOverTime: formattedTimeData,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
