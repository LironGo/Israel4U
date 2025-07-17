const express = require('express');
const router = express.Router();
const {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroupRequest,
    handleJoinRequest,
    leaveGroup,
    getGroupPosts,
    getManagedGroupsJoinRequests
} = require('../controllers/groupsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/join', joinGroupRequest);
router.put('/:id/requests/:requestId', handleJoinRequest);
router.delete('/:id/leave', leaveGroup);
router.get('/:id/posts', getGroupPosts);
router.get('/managed/join-requests', getManagedGroupsJoinRequests);

module.exports = router; 