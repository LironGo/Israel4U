const asyncHandler = require('express-async-handler');
const Group = require('../models/Group');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Create a group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
    const { name, description, city, region, isEvacuee, isInjured, isReservist, isRegularSoldier } = req.body;

    const group = await Group.create({
        name,
        description,
        city,
        region,
        manager: req.user._id,
        isEvacuee,
        isInjured,
        isReservist,
        isRegularSoldier,
        members: [req.user._id] // Creator is automatically a member
    });

    // Add group to user's groups and managed groups
    req.user.groups.push(group._id);
    req.user.managedGroups.push(group._id);
    req.user.isGroupManager = true;
    await req.user.save();

    const populatedGroup = await Group.findById(group._id)
        .populate('manager', 'fullName')
        .populate('members', 'fullName profilePicture');

    res.status(201).json(populatedGroup);
});

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
    const { q, region, city, category } = req.query;
    
    let query = {};

    // Text search
    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { city: { $regex: q, $options: 'i' } }
        ];
    }

    // Region filter
    if (region) {
        query.region = region;
    }

    // City filter
    if (city) {
        query.city = { $regex: city, $options: 'i' };
    }

    // Category filters
    if (category) {
        const categories = category.split(',');
        const categoryQuery = {};
        
        categories.forEach(cat => {
            switch (cat) {
                case 'evacuee':
                    categoryQuery.isEvacuee = true;
                    break;
                case 'injured':
                    categoryQuery.isInjured = true;
                    break;
                case 'reservist':
                    categoryQuery.isReservist = true;
                    break;
                case 'regularSoldier':
                    categoryQuery.isRegularSoldier = true;
                    break;
            }
        });
        
        if (Object.keys(categoryQuery).length > 0) {
            query.$or = Object.keys(categoryQuery).map(key => ({ [key]: categoryQuery[key] }));
        }
    }

    const groups = await Group.find(query)
        .populate('manager', 'fullName')
        .populate('members', 'fullName profilePicture')
        .sort({ createdAt: -1 });

    res.json(groups);
});

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id)
        .populate('manager', 'fullName')
        .populate('members', 'fullName profilePicture')
        .populate('joinRequests.user', 'fullName profilePicture');

    if (group) {
        res.json(group);
    } else {
        res.status(404);
        throw new Error('Group not found');
    }
});

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is the manager
    if (group.manager.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this group');
    }

    group.name = req.body.name || group.name;
    group.description = req.body.description || group.description;
    group.city = req.body.city || group.city;
    group.region = req.body.region || group.region;
    group.isEvacuee = req.body.isEvacuee !== undefined ? req.body.isEvacuee : group.isEvacuee;
    group.isInjured = req.body.isInjured !== undefined ? req.body.isInjured : group.isInjured;
    group.isReservist = req.body.isReservist !== undefined ? req.body.isReservist : group.isReservist;
    group.isRegularSoldier = req.body.isRegularSoldier !== undefined ? req.body.isRegularSoldier : group.isRegularSoldier;

    const updatedGroup = await group.save();

    const populatedGroup = await Group.findById(updatedGroup._id)
        .populate('manager', 'fullName')
        .populate('members', 'fullName profilePicture');

    res.json(populatedGroup);
});

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is the manager
    if (group.manager.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this group');
    }

    // Remove group from all members
    for (const memberId of group.members) {
        const member = await User.findById(memberId);
        if (member) {
            member.groups = member.groups.filter(id => id.toString() !== group._id.toString());
            if (member.managedGroups.includes(group._id)) {
                member.managedGroups = member.managedGroups.filter(id => id.toString() !== group._id.toString());
            }
            await member.save();
        }
    }

    await Group.findByIdAndDelete(req.params.id);

    res.json({ message: 'Group removed' });
});

// @desc    Join group request
// @route   POST /api/groups/:id/join
// @access  Private
const joinGroupRequest = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if already a member
    if (group.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already a member of this group');
    }

    // Check if already has a pending request
    const existingRequest = group.joinRequests.find(
        request => request.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
        res.status(400);
        throw new Error('Join request already exists');
    }

    group.joinRequests.push({
        user: req.user._id,
        status: 'pending'
    });

    await group.save();

    res.json({ message: 'Join request sent' });
});

// @desc    Approve/Reject join request
// @route   PUT /api/groups/:id/requests/:requestId
// @access  Private
const handleJoinRequest = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is the manager
    if (group.manager.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to handle join requests');
    }

    const request = group.joinRequests.id(req.params.requestId);
    if (!request) {
        res.status(404);
        throw new Error('Join request not found');
    }

    request.status = status;

    if (status === 'approved') {
        // Only add if not already a member
        if (!group.members.some(id => id.toString() === request.user.toString())) {
            group.members.push(request.user);
        }
        // Add group to user's groups if not already present
        const user = await User.findById(request.user);
        if (user) {
            if (!user.groups.some(id => id.toString() === group._id.toString())) {
                user.groups.push(group._id);
                try {
                    await user.save();
                } catch (err) {
                    console.error('Failed to save user after join approval:', err);
                }
            }
        } else {
            console.error('User not found when approving join request:', request.user);
        }
    }

    // Remove the request
    group.joinRequests = group.joinRequests.filter(
        req => req._id.toString() !== req.params.requestId
    );

    await group.save();

    res.json({ message: `Join request ${status}` });
});

// @desc    Leave group
// @route   DELETE /api/groups/:id/leave
// @access  Private
const leaveGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is a member
    if (!group.members.includes(req.user._id)) {
        res.status(400);
        throw new Error('Not a member of this group');
    }

    // Remove from members
    group.members = group.members.filter(id => id.toString() !== req.user._id.toString());

    // Remove group from user's groups
    req.user.groups = req.user.groups.filter(id => id.toString() !== group._id.toString());
    if (req.user.managedGroups.includes(group._id)) {
        req.user.managedGroups = req.user.managedGroups.filter(id => id.toString() !== group._id.toString());
    }
    await req.user.save();

    await group.save();

    res.json({ message: 'Left group successfully' });
});

// @desc    Get group posts
// @route   GET /api/groups/:id/posts
// @access  Private
const getGroupPosts = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    // Check if user is a member
    if (!group.members.includes(req.user._id)) {
        res.status(401);
        throw new Error('Not authorized to view group posts');
    }

    const posts = await Post.find({ groups: req.params.id })
        .populate('author', 'fullName profilePicture')
        .populate('groups', 'name')
        .sort({ createdAt: -1 });

    res.json(posts);
});

// @desc    Get join requests for groups managed by the current user
// @route   GET /api/groups/managed/join-requests
// @access  Private
const getManagedGroupsJoinRequests = asyncHandler(async (req, res) => {
    // Find all groups where the current user is the manager
    const groups = await Group.find({ manager: req.user._id })
        .populate('joinRequests.user', 'fullName profilePicture email')
        .select('name joinRequests');

    // Collect all join requests with group info
    const joinRequests = [];
    groups.forEach(group => {
        group.joinRequests.forEach(request => {
            if (request.status === 'pending') {
                joinRequests.push({
                    groupId: group._id,
                    groupName: group.name,
                    requestId: request._id,
                    user: request.user,
                    status: request.status,
                    requestDate: request.requestDate
                });
            }
        });
    });

    res.json(joinRequests);
});

module.exports = {
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
}; 