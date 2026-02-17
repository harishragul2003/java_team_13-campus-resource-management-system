const express = require('express');
const router = express.Router();
const {
  createResource,
  getAllResources,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');

router.post('/', createResource);
router.get('/', getAllResources);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;
