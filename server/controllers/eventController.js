const Event = require('../models/Event');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { getPaginationParams, buildPaginationMeta } = require('../utils/paginate');
const logger = require('../config/logger');

exports.getEvents = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (q) filter.$text = { $search: q };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('creator', 'fullName username')
        .populate('club', 'name logoUrl')
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Events fetched successfully', events, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'fullName username')
      .populate('club', 'name logoUrl')
      .lean();

    if (!event) {
      return sendError(res, 404, 'Event not found');
    }

    return sendSuccess(res, 200, 'Event fetched successfully', event);
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, category, image_url, club_id } = req.body;

    const event = await Event.create({
      title,
      description,
      startDate: date,
      venue,
      category,
      imageUrl: image_url,
      club: club_id,
      creator: req.user._id,
    });

    logger.info('Event created', { eventId: event._id, creator: req.user._id });
    return sendSuccess(res, 201, 'Event created successfully', event);
  } catch (err) {
    next(err);
  }
};
