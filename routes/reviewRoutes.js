const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //merge params true for enabling this route access params of tourId route and less repetitive code

router.route('/').get(reviewController.getReviews);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.postReview,
  );

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
