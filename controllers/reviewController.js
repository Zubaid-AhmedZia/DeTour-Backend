const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    message: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.postReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const review = await Review.create(req.body);

  res.status(200).json({
    message: 'review added succesfully',
    data: {
      review,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
