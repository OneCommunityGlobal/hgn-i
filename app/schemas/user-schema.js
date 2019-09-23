// var Schema = require('./schema');

  id: {},
  userName: "",
  password: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const passwordregex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        return passwordregex.test(v);
      },
      message: '{VALUE} is not a valid password etc..',
    },
  },
  firstName: {type: String, required: true, trim: true, minlength: 2,},
  lastName: { type: String, required: true, minlength: 2 },
  email: {type: String, required: true, unique: true, validate: [validate({ validator: 'isEmail', message: 'Email address is invalid' })],},

  isActive: { type: Boolean, required: true, default: true },
  role: { type: String, required: true, enum: ['Volunteer', 'Manager', 'Administrator', 'Core Team'] },
  phoneNumber: [{ type: String, phoneNumber: String }],
  bio: { type: String },
  weeklyComittedHours: { type: Number, default: 10 },
  createdDate: { type: Date, required: true, default: Date.now() },
  lastModifiedDate: { type: Date, required: true, default: Date.now() },
  personalLinks: [{ _id: Schema.Types.ObjectId, Name: String, Link: { type: String } }],
  adminLinks: [{ _id: Schema.Types.ObjectId, Name: String, Link: String }],
  teams: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'team' }],
  projects: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'project' }],
  badgeCollection: [{ badgeName: String, quantity: Number, lastModifiedDate: Date }],
  profilePic: { type: String },
  infringments: [{ date: { type: String, required: true }, description: { type: String, required: true } }]
});

// UserSchema.us = function() {
//     console.log('In us');
// }

// UserSchema.us();
// UserSchema.doit();

// export.module UserSchema;