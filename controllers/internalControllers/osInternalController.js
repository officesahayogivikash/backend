require('dotenv').config();
const OsInternal = require('../../model/internalModel/osInternal'); // Update the path to where your model is located
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateUniqueId} = require('../../utils/generateUniqueId')
const Cookies = require('js-cookie');

// Create a new user
const createUserOS = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, fatherName, email, password, role, department, img, DOB, DateOfJoining, address, API, Frontend, Backend, UI_UX, Application, Server,  admin, pan, adharCard,PFno,UNno, ESIC } = req.body;

    // Create a new user object
    
    let newUser;
    if(role==='SuperAdmin'){
      const id = await generateUniqueId({department, role})
    
    const user = await  OsInternal.find({email});
    if(user.length > 0)return  res.status(400).json({message: "Email already exists"});
    const saltSync =  bcrypt.genSaltSync(Number(process.env.saltRounds));
    if(!password) return res.status(400).json({message:  "Password is required"});

    const hash = bcrypt.hashSync(password, saltSync);

    newUser = new OsInternal({
        id,
        name,
        fatherName,
        email,
        password:hash,
        role,
        img,
        DOB,
        address,
        proof:{
          adharCard:  adharCard?adharCard: false,
          pan: pan?pan: false
        }
      });
    }
    else{
      const id = await generateUniqueId({department, role})
    const user = await  OsInternal.find({email});
    if(user.length > 0)return  res.status(400).json({message: "Email already exists"});
    const saltSync =  bcrypt.genSaltSync(Number(process.env.saltRounds));
    if(!password) return res.status(400).json({message:  "Password is required"});

    const hash = bcrypt.hashSync(password, saltSync);

    newUser = new OsInternal({
      id,
      name,
      fatherName,
      email,
      password:hash,
      role,
      img,
      DOB,
      DateOfJoining,
      address,
      department,
      itTeamAttribute:{
        API: API?API: false,
        Frontend: Frontend?Frontend: false,
        Backend: Backend?Backend: false,
        UI_UX: UI_UX?UI_UX: false,
        Application: Application?Application: false,
        Server: Server?Server: false
      }
      ,
      admin,
      proof:{
        adharCard:  adharCard?adharCard: false,
        pan: pan?pan: false
      },
      someExtra:{
        PFno,
        UNno,
        ESIC
      }
    });
    }
    
    // Save the new user to the database
    const response =await newUser.save();

    // Send success response
    res.status(201).json({
      message: 'User created successfully',
      user: response
    });
  } catch (error) {
    // Handle errors (e.g., validation errors, database errors)
    res.status(500).json({
      
      message: 'Error creating user',
      error: error.message
    });
  }
};

const approve = async(req,res)=>{
  const id = req.params.id;
  
  const user = await OsInternal.findById(id);
  if(!user)return res.status(404).send({
    message: 'User not found'
  })
  const result = await OsInternal.findByIdAndUpdate(
    id, 
    { $set: { isApproved: true } }, // Use $set to specify fields to update
    { new: true, runValidators: true } // Return the updated document and run validators
  );
  res.status(200).json({
    message: 'User approved',
    result
  })
};


const loginUserOS = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await OsInternal.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });
    if (!user.isApproved) return res.status(400).json({ message: 'User is not approved' });

    // Check if the password matches
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in the cookie using js-cookie
    Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'None' });

    res.status(200).json({
      message: 'Login successfully',
      token: token,
      role: user.role,
      name: user.name,
      department: user.department,
      success: true,
      error: false
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error in user login', error: error.message });
  }
};

const getAll = async(req,res)=>{
  try{
    const user = await OsInternal.find({ isDeleted: false,  isApproved: false });
    if(user.length===0){
      return res.status(204).json({ message: 'No users found' });
    }
    res.status(200).json({
      message:'All OS internal',
      user
    })


  }
  catch(error){
    res.status(500).json({
      message: 'Server error'
    })
  }
}

const getAllApprovedUser = async(req,res)=>{
  try{
    const user = await OsInternal.find({ isDeleted: false,  isApproved: true });
    if(user.length===0){
      return res.status(204).json({ message: 'No users found' });
    }
    res.status(200).json({
      message:'All OS internal',
      user
    })


  }
  catch(error){
    res.status(500).json({
      message: 'Server error'
    })
  }
}

const logoutUserOS = async(req,res)=>{
  try{
      const username = req.cookies['token'];
      res.clearCookie('token');
      res.status(200).send('logout  successful');
  }
  catch(error){
      res.status(500).json({message:  'Server error user in logout', error: error.message });

  }
}








module.exports = {createUserOS, approve,loginUserOS, logoutUserOS, getAll, getAllApprovedUser};