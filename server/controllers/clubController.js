const Club = require('../models/Club');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');
const { getPaginationParams, buildPaginationMeta } = require('../utils/paginate');
const logger = require('../config/logger');

exports.getClubs = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const { page, limit, skip } = getPaginationParams(req.query);

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (q) filter.$text = { $search: q };

    const [clubs, total] = await Promise.all([
      Club.find(filter)
        .populate('creator', 'fullName username')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Club.countDocuments(filter),
    ]);

    return sendPaginated(res, 'Clubs fetched successfully', clubs, buildPaginationMeta(page, limit, total));
  } catch (err) {
    next(err);
  }
};

exports.getClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('creator', 'fullName username')
      .populate('members', 'fullName username avatar')
      .lean();

    if (!club) {
      return sendError(res, 404, 'Club not found');
    }

    return sendSuccess(res, 200, 'Club fetched successfully', club);
  } catch (err) {
    next(err);
  }
};

exports.createClub = async (req, res, next) => {
  try {
    const { name, bio, category, logo_url, banner_url } = req.body;

    const club = await Club.create({
      name,
      description: bio,
      category,
      logoUrl: logo_url,
      bannerUrl: banner_url,
      creator: req.user._id,
      members: [req.user._id],
    });

    logger.info('Club created', { clubId: club._id, creator: req.user._id });
    return sendSuccess(res, 201, 'Club created successfully', club);
  } catch (err) {
    next(err);
  }
};
