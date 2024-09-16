const ContactSchema = require('../../model/userModel/ContactUs');
const osInternal = require('../../model/internalModel/osInternal');
const jwt =  require('jsonwebtoken');



//Handle  create contact us
async function handleSendContact(req, res) {
    try {
        const { name, email, phoneNo, description,ecom,crm,payroll,userSize, account,bussionName } = req.body; 
        if (!name || !email || !phoneNo) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        //if(!ecom && !crm && !payroll)return res.status(400).json({message: 'you have to select at least one service'})

        const newContact = new ContactSchema({ name, email, phoneNo, description,ecom,crm,payroll,userSize, account, bussionName});
        await newContact.save();

        res.status(201).json({
            message: 'Contact us form submitted successfully',
            userContact: newContact
        });
    } catch (error) {
        
        res.status(500).json({ message: 'Internal server error',  error: error.message });

    }
}

//get all Users by sells department is not deleted
async function getAllUserContacts(req, res) {
    try {
        
        const token = req.headers['authorization'];
        let decoded;
        if(token){
             decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
        if(!decoded){
            return res.status(401).json({message: 'Unauthorized'})
        }
        const user =  await osInternal.findOne({ _id: decoded.id });
        if(user.role !== 'Admin' &&  user.department !== 'sales'){
            return res.status(403).json({message: 'You are not authorized to access this resource'})
        }

        const contacts = await ContactSchema.find({assign:null });
        if(!contacts) res.status(204).json({message: "No any  contact us form submitted"})

        res.status(200).json({
            message: 'All user contact us form data',
            contacts: contacts
        });
    } catch (error) {
        
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

//deleted by sell department
async function deleteUserById(req, res) {
    const userId = req.params.id;

    try {
        if(!userId) return res.status(400).json({message: "Id is not  provided"})

        // Find the user by ID and set isDeleted to true
        const deletedUser = await ContactSchema.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found in contact us controller' });
        }

        res.status(200).json({
            message: 'User deleted successfully',
            deletedUser: deletedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error',error : error.message});
    }
}


//Aprove user using  id

async function approveUserbyId(req,res){
    const userId = req.params.id;
    try {
        // Find the user by ID and set isDeleted to true
        const deletedUser = await ContactSchema.findByIdAndUpdate(userId, { isAprove: true }, { new: true });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User aproved successfully',
            deletedUser: deletedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error',error: error.message });
    }
}


async function assign(req,res){
    const userId = req.params.id;
    const assignId = req.body.assignId;
    try {
        // Find the user by ID and set isDeleted to true
        const assignSell = await ContactSchema.findByIdAndUpdate(userId, { assign: assignId }, { new: true});
        res.status(200).json({
            message: 'User assigned successfully',
            assignSell: assignSell
        })
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error',error: error.message });
    }
}


// Get assigned work for logged-in user
async function getAssignedWork(req, res) {
    try {
        const token = req.headers['authorization'];
        let decoded;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify JWT token
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the user by their ID
        const user = await osInternal.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all contacts assigned to this user
        const assignedContacts = await ContactSchema.find({ assign: user._id });
        if (!assignedContacts.length) {
            return res.status(200).json({ message: 'No assigned work found' });
        }

        // Return the assigned work
        res.status(200).json({
            message: 'Assigned work retrieved successfully',
            assignedWork: assignedContacts
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}





module.exports = {
    handleSendContact,
    getAllUserContacts,
    deleteUserById,
    approveUserbyId,
    assign,
    getAssignedWork
    
}