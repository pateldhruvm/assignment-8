const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('../models/models');
const path = require('path');

const router = express.Router();

// POST /user/create
router.post('/create', async (req, res) => {
    const { fullName, email, password } = req.body;
    // Add validation logic here for fullName, email, password strength.
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({ fullName, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /user/edit`
router.put('/edit', async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.fullName = fullName;
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /user/delete
router.delete('/delete', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /user/getAll
router.get('/getAll', async (req, res) => {
    try {
        const users = await User.find({}, 'fullName email password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// First, modify the multer storage configuration (before the route)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/')
    },
    filename: function(req, file, cb) {
        // Get file extension from original filename
        const ext = path.extname(file.originalname);
        // Create filename with timestamp and extension
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage: storage });
// POST /user/uploadImage
router.post('/uploadImage', upload.single('image'), async (req, res) => {
    const { email } = req.body;
    const { file } = req;
    try {
        if (!file || !['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file format' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.image = file.path;
        await user.save();
        res.status(200).json({ message: 'Image uploaded successfully', path: file.path });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
