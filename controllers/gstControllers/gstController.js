require("dotenv").config();
const gstUser = require("../../model/gstModel/Gst");

const axios = require("axios");


const enterGst = async (req, res) => {
  try {
    const { gstin } = req.body;

    const userExist = await gstUser.find({ gstin: gstin });

    if (userExist.length > 0) {
      return res.status(200).json({
        message: "User already exists",
        userExist: userExist,
      });
    }

    if (!gstin) {
      return res.status(400).json({ error: "Missing  gstin no" }); 

    }

    const url = `https://gstapi.charteredinfo.com/commonapi/v1.1/search?action=TP&aspid=${process.env.aspid}&password=${process.env.asppassword}&gstin=${gstin}`;
    const response = await axios.get(url);
    const gstData = response.data;
    const gst = await new gstUser(gstData);
    await gst.save();
    return res
      .status(201)
      .json({ message: "GST data saved successfully", userExist: [gst] });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "GST enter controller is not working", error: error.message });
  }
};
const getAllGst = async (req, res) => {
  try {
    const gst = await gstUser.find();
    return res.status(200).json({
      message: "All GST of organization",
      length: gst.length,
      gst,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch GST details in gst controller", error: error.message });
  }
};

const getGstById = async (req, res) => {
  try {
    const userId = req.params.id;
    if(!userId) return res.status(204).json({message: "Please enter user id in params"})
    const user = await gstUser.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch GST details in GST gst controller", error: error.message });
  }
};

const defaulthit = async (req, res) => {
  res.status(200).send("Welcome to user get api test");
};

module.exports = {
  enterGst,
  defaulthit,
  getAllGst,
  getGstById,
};
