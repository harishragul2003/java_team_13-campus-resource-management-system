const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingsByUser,
  getBookingsByResource
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.put('/:id', updateBookingStatus);
router.get('/user/:userId', getBookingsByUser);
router.get('/resource/:resourceId', getBookingsByResource);

module.exports = router;
