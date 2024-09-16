require('dotenv').config();
const jwt = require('jsonwebtoken');
const osInteral = require('../../model/internalModel/osInternal')

const approveMiddleware = async(req, res,next)=>{
  let token = req.headers['authorization'] || req.cookies['token'];
  
  if(!token) return res.status(401).send({message: 'Unauthorized'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const  approvalBy = await osInteral.findById(decoded.id);
  
    const userId = req.params.id;
    const approval = await osInteral.findById(userId);
    
    if(approval.role==='Admin' && approvalBy.role==='SuperAdmin')next();
    else if(approval.role==='User' && (approvalBy.role==='SuperAdmin' || approvalBy.role==='Admin'))next();
    else res.status(403).send({message: 'Forbidden in approveMiddleware'});
  }
  catch(error){
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}


const allViewMiddleware = async(req, res, next)=>{
  let token = req.headers['authorization'] || req.cookies['token'];
  if(!token) return res.status(401).send({message: 'Unauthorized'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const  approvalBy = await osInteral.findById(decoded.id);
    if(approvalBy.role==='SuperAdmin')next();
    else return res.status(403).send({message: 'Forbidden in approveMiddleware'});
  }
  catch(error){
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    })
  }
}

module.exports = {approveMiddleware, allViewMiddleware};