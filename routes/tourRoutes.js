const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const reviewRoute = require('./reviewRoutes'); // to access code of review post route

const router = express.Router();

// router.param('id', tourController.checkID);
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.postReview,
//   );
router.use('/:tourId/reviews', reviewRoute); //router is a middleware so we can use 'use' which is doing mounting here just like in app.js

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.tourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
