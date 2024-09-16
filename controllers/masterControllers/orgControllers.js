const masterSchema = require('../../model/masterModel/mastermodel');
const axios = require('axios');

const orgControllers = async (req, res) => {
  try {
    // Define the API endpoint
    const apiUrl = `${process.env.API}/api/gst/gst-details`;


    // Extract values from req.body
    let {
      name,
      typeOfAssessee,
      pan,
      PhoneNo,
      EmailId,
      dateOfIncorporation,
      gstin,
      gst // Boolean to indicate if GST is applicable
    } = req.body;

    // If GST is true, extract PAN from GSTIN
    
    if (gst && gstin) {
      pan = gstin.substring(2, 12); // Extract PAN from GSTIN
      
    }
   
    // Validate that PAN is provided
    if (!pan) {
      return res.status(400).json({ message: "Please provide PAN or GSTIN." });
    }

    // Check if an organization with the same PAN already exists
    const orgSaved = await masterSchema.findOne({ pan });
    if (orgSaved) {
      return res.status(200).json({
        message: 'Organization already exists',
        orgSaved
      });
    }

    // If GSTIN is provided, fetch details from the GST API
    if (gst && gstin) {
      try {
        const requestData = { gstin };
        const response = await axios.post(apiUrl, requestData, {
          headers: { 'Content-Type': 'application/json' }
        });
        // Extract data from the API response and update missing fields
        name =  response.data.userExist[0]?.lgnm||name ;
        typeOfAssessee = response.data.userExist[0]?.ctb||typeOfAssessee;
        dateOfIncorporation = response.data.userExist[0]?.rgdt||dateOfIncorporation;
        console.log(dateOfIncorporation);
        const gstDetails = {
          tradeName: response.data.userExist[0]?.tradeNam,
          gstin,
          principalPlaceOfAddress: response.data.userExist[0]?.pradr,
          additionalPlaceOfAddress: response.data.userExist[0]?.adadr,// Mapping address list
          jurisdictionDetails: {
            center: response.data.userExist[0]?.ctj,
            state: response.data.userExist[0]?.stj
          }
        };

        const registrationNumbers = {
          cin: req.body.cin,
          tan: req.body.tan,
          udhyam: req.body.udhyam,
          esic: req.body.esic,
          epfo: req.body.epfo,
          llpin: req.body.llpin
        };

        // Ensure CIN is provided if the organization is a Private Limited Company
        if (typeOfAssessee === 'Private Limited Company' && !registrationNumbers.cin) {
          return res.status(400).json({ message: "If you are a Private Limited Company, CIN is required." });
        }

        // Construct the masterData object
        const masterData = {
          name,
          typeOfAssessee,
          pan,
          PhoneNo,
          EmailId,
          dateOfIncorporation,
          gstDetails,
          registrationNumbers,
          gst
        };

        // Save the data into MongoDB
        const master = new masterSchema(masterData);
        const savedMaster = await master.save();

        // Respond with success message
        return res.status(201).json({
          message: "Data inserted into master module.",
          savedMaster
        });

      } catch (error) {
        return res.status(400).json({
          message: 'Error fetching GST details from API.',
          error: error.message
        });
      }
    } else {
      // If GST is not provided, save only basic details
      const masterData = {
        name,
        typeOfAssessee,
        pan,
        PhoneNo,
        EmailId,
        dateOfIncorporation,
        gst
      };

      // Save the data into MongoDB
      const master = new masterSchema(masterData);
      const savedMaster = await master.save();

      // Respond with success message
      return res.status(201).json({
        message: "Data inserted into master module.",
        savedMaster
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error in orgController',
      error: error.message
    });
  }
};

const getByPan = async(req,res)=>{
    const {pan} = req.params;
    try{
        const orgSaved =await masterSchema.find({pan: pan});
        if(orgSaved.length === 0){
            return  res.status(404).json({
                message: "No data found for the given PAN number",
            })

        }
        res.status(200).json({
            messae:  "Data found for the given PAN number",
            orgSaved
        })
    }
    catch(error){
        res.status(500).json({
            message:  'Error occurred while fetching org details',
            error: error
        })
    }
}


const getAllOrg = async(req, res)=>{
  try{
    const orgs =  await masterSchema.find();
    return  res.status(200).json({
      message: "Data fetched successfully",
      Number: orgs.length,
      orgs
    })


  }
  catch(error){
    res.status(500).json({
      messae:"Server Error",
      error: error.messae
    })
  }
}

module.exports = { orgControllers,  getByPan, getAllOrg };

