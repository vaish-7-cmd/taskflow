const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @route GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({
      title, description, status, priority, dueDate,
      user: req.user._id,
    });

    res.status(201).json({ task, message: 'Task created.' });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const { title, description, status, priority, dueDate } = req.body;
    Object.assign(task, { title, description, status, priority, dueDate });
    await task.save();

    res.json({ task, message: 'Task updated.' });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    res.json({ message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/tasks/stats
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result = { todo: 0, 'in-progress': 0, done: 0 };
    stats.forEach((s) => { result[s._id] = s.count; });
    result.total = result.todo + result['in-progress'] + result.done;

    res.json({ stats: result });
  } catch (err) {
    next(err);
  }
};