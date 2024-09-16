const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DEPARTMENTS = ['Management', 'Sales', 'Finance', 'Outreach', 'Support', 'Migration', 'Learning and Development', 'HR', 'IT'];
const ROLES = ['SuperAdmin', 'Admin', 'User'];

const OsInternalSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true // Ensure that each user has a unique ID
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that email addresses are unique
    validate: {
      validator: function(v) {
        // Regular expression for validating an Email
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ROLES,
    required: true
  },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: function() {
      return this.role === 'Admin' || this.role === 'User';
    }
  },
  img: {
    type: String
  },
  DOB: {
    type: Date,
    required: true
  },
  DateOfJoining: {
    type: Date,
    required: function() {
      return this.role === 'Admin' || this.role === 'User';
    }
  },
  address: {
    type: String,
    required: true
  },
  itTeamAttribute: {
    Backend: {
      type: Boolean,
      default: false
    },
    API: {
      type: Boolean,
      default: false
    },
    Frontend: {
      type: Boolean,
      default: false
    },
    UI_UX: {
      type: Boolean,
      default: false
    },
    Application: {
      type: Boolean,
      default: false
    },
    Server: {
      type: Boolean,
      default: false
    }
  },
  // admin: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'OsInternal',
  //   required: function() {
  //     return this.role === 'User';
  //   }
  // },
  proof: {
    pan: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Regular expression for validating PAN
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: props => `${props.value} is not a valid PAN number!`
      }
    },
    adharCard: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Regular expression for validating Aadhaar
          return /^\d{4}\s\d{4}\s\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid Aadhaar number!`
      }
    }
  },
  someExtra: {
    PFno: {
      type: String
    },
    UNno: {
      type: String
    },
    ESIC: {
      type: String
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Middleware to ensure only one SuperAdmin
OsInternalSchema.pre('save', async function(next) {
  if (this.role === 'SuperAdmin') {
    const existingSuperAdmin = await this.constructor.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin && existingSuperAdmin._id.toString() !== this._id.toString()) {
      return next(new Error('Only one SuperAdmin is allowed.'));
    }
  }
  next();
});

module.exports = mongoose.model('OsInternal', OsInternalSchema); 