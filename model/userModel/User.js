const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema({
  userType: {
    type: String,
    enum: ["Business", "Professional"],
    required: true,
  },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "User"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  organizationType: {
    type: String,
    required: function () {
      return this.userType === "Business";
    },
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  employeeType: {
    type: String,
    enum: ["On Record", "Off Record"],
    required: function () {
      return this.role === "User" && this.userType === "Business";
    },
  },
  orgAdmins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "SuperAdmin" && this.userType === "Business";
      },
    },
  ],
  professionType: {
    type: String,
    required: function () {
      return this.userType === "Professional";
    },
  },
  orgEntity: {
    type: String,
    required: true,
  },
  crm: {
    type: Boolean,
    required: function () {
      return this.userType === "Professional";
    },
  },
  ecom: {
    type: Boolean,
    required: function () {
      return this.userType === "Business";
    },
  },
  payroll: {
    type: Boolean,
    required: function () {
      return this.userType === "Business";
    },
  },

  //Is this user is active or not
  isActive:{
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("RegisterUser", UserSchema);
