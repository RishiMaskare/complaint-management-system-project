const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

// Priority keywords for auto-detection
const priorityKeywords = {
  High: ['urgent', 'emergency', 'danger', 'electric shock', 'fire', 'flood', 'leak', 'broken', 'not working', 'outage'],
  Medium: ['issue', 'problem', 'repair', 'fix', 'maintenance', 'cleaning', 'noise'],
  Low: ['suggestion', 'improvement', 'request', 'feedback'],
};

// Auto-detect priority based on keywords
const detectPriority = (description) => {
  const lowerDesc = description.toLowerCase();
  
  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return priority;
    }
  }
  
  return 'Low'; // Default priority
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, category } = req.body;

    // Auto-detect priority based on description
    const priority = detectPriority(description);

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      // If using Cloudinary
      if (req.file.path) {
        imageUrl = req.file.path;
      } else {
        // If using local storage
        imageUrl = `/uploads/${req.file.filename}`;
      }
    }

    // Create complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    // If user is student, only show their complaints
    if (req.user.role === 'student') {
      query.createdBy = req.user.id;
    }
    // If admin, can filter by any criteria

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if user owns this complaint or is admin
    if (
      req.user.role !== 'admin' &&
      complaint.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
const updateComplaint = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Build update object
    const updateData = {};
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;
    
    // If status is being changed to Resolved, set resolvedAt
    if (status === 'Resolved' && complaint.status !== 'Resolved') {
      updateData.resolvedAt = new Date();
    }

    // Update complaint
    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint (Admin only)
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
};
