const User = require('../../model/userModel/User');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { userType, role, name, email, password, organizationType, team, employeeType, orgAdmins, professionType, orgEntity, crm, ecom, payroll } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        // Validate professionType based on userType
        if (userType === 'Business' && professionType) {
            return res.status(400).json({ message: 'professionType should be null for Business userType.' });
        }

        if (userType === 'Professional' && !professionType) {
            return res.status(400).json({ message: 'professionType is required for Professional userType.' });
        }

        // Validate CRM, Ecom, and Payroll access based on userType
        if (userType === 'Professional' && (ecom || payroll)) {
            return res.status(400).json({ message: 'Professional users can only access CRM. Ecom and Payroll should be false.' });
        }

        if (userType === 'Business' && crm) {
            return res.status(400).json({ message: 'Business users can only access Ecom and Payroll. CRM should be false.' });
        }

        // Generate a salt and hash the password
        const salt = genSaltSync(parseInt(process.env.saltRounds));
        const hashedPassword = hashSync(password, salt);

        // Create a new user
        const newUser = new User({
            userType,
            role,
            name,
            email,
            password: hashedPassword,
            organizationType,
            team,
            employeeType,
            orgAdmins,
            professionType: userType === 'Professional' ? professionType : null,
            orgEntity,
            crm: userType === 'Professional' ? crm : false,
            ecom: userType === 'Business' ? ecom : false,
            payroll: userType === 'Business' ? payroll : false
        });

        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error in user creation', error: error.message });
    }
};

// User login
    
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Invalid email or password' });

        // Check if the password matcheszz
        const isMatch = compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60*60*1000})
        res.status(200).json({ message: 'Login successful', token, role: user.role, orgEntity: user.orgEntity  });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error  in user login', error: error.message });

    }
};

const logoutUser = async(req,res)=>{
    try{
        const username = req.cookies['token'];
        res.clearCookie('token');
        res.send('logout  successful');
    }
    catch(error){
        res.status(500).json({message:  'Server error user in logout', error: error.message });

    }
}

// Update user information
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;  // Extracted from JWT token
        const updates = req.body;
        updates.updatedAt = Date.now();

        const user = await User.findById(userId);
        if (user.role === 'User') return res.status(401).json({ message: 'You have no control to update this user' });

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error in updated User', error: error.message });
    }
};

// Delete (soft delete) a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndUpdate(userId, { isDelete: true }, { new: true });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error in delete  User', error: error.message });

    }
};

// Get user information by ID (no authorization required)
const getUserById = async (req, res) => {
    try {
        const userId = req.user;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });

    } catch (error) {
        
        res.status(500).json({ message: 'Server error  in get User by ID', error: error.message });

    }
};

// Get all users (no authorization required)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        if(!users?.length)return res.status(204).json({message: "No user"})
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error in get all user',  error: error.message });

    }
};

// Get users by orgEntity with flexible matching
const getUsersByOrgEntity = async (req, res) => {
    try {
        const orgEntity = req.params.orgEntity;
        const regex = new RegExp(`^${orgEntity.replace(/\s+/g, '\\s*')}$`, 'i');

        const users = await User.find({
            orgEntity: regex,
            isDelete: false
        });

        if (users.length === 0) return res.status(404).json({ message: 'No users found with this orgEntity' });

        res.status(200).json({ users });
    } catch (error) {
        
        res.status(500).json({ message: 'Server error in get users by org Entity', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers,
    getUsersByOrgEntity,
    logoutUser
};
