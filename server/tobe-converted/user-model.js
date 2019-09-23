class User {

  static async getTeamMembers(user) {
    const userid = ObjectId(user._id);
    // var teamid = userdetails.teamId;
    return myteam.findById(userid).select({
      'myteam._id': 1,
      'myteam.role': 1,
      'myteam.fullName': 1,
      _id: 0,
    });
  };

  static async getUserLaborThisMonthById(userId, startDate, endDate) {
    const fromdate = moment(startDate).format('YYYY-MM-DD');
    const todate = moment(endDate).format('YYYY-MM-DD');

    return timeentry.aggregate([{
      $match: {
        personId: userId,
        isTangible: true,
        dateOfWork: {
          $gte: fromdate,
          $lte: todate,
        },

      },
    },
    {
      $group: {
        _id: {
          projectId: '$projectId',
        },
        labor: {
          $sum: '$totalMinutes',
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id.projectId',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $project: {
        _id: 0,
        projectName: {
          $ifNull: [{
            $arrayElemAt: ['$project.projectName', 0],
          }, 'Undefined'],
        },
        timeSpent_hrs: {
          $divide: ['$labor', 60],
        },
      },

    },
    ]);
  };

  static async getUserLaborThisWeekById(userId, startDate, endDate) {
    const fromdate = moment(startDate).format('YYYY-MM-DD');
    const todate = moment(endDate).format('YYYY-MM-DD');

    return userProfile.aggregate([{
      $match: {
        _id: userId,
      },
    },
    {
      $project: {
        weeklyComittedHours: 1,
        _id: 1,
      },
    },
    {
      $lookup: {
        from: 'timeEntries',
        localField: '_id',
        foreignField: 'personId',
        as: 'timeEntryData',
      },
    },
    {
      $project: {
        weeklyComittedHours: 1,
        timeEntryData: {
          $filter: {
            input: '$timeEntryData',
            as: 'timeentry',
            cond: {
              $and: [{
                $eq: ['$$timeentry.isTangible', true],
              }, {
                $gte: ['$$timeentry.dateOfWork', fromdate],
              }, {
                $lte: ['$$timeentry.dateOfWork', todate],
              }],
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: '$timeEntryData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          weeklyComittedHours: '$weeklyComittedHours',
        },
        effort: {
          $sum: '$timeEntryData.totalMinutes',
        },
      },
    },
    {
      $project: {
        _id: 0,
        weeklyComittedHours: '$_id.weeklyComittedHours',
        timeSpent_hrs: {
          $divide: ['$effort', 60],
        },
      },
    },


    ]);
  };

  static async forcePwd(req, res) {
    const { userId } = req.body;

    if (!ObjectId.isValid(userId)) {
      res.status(400).send({ error: 'Bad Request' });
      return;
    }

    userProfile.findById(userId, 'password')
      .then((user) => {
        user.set({ password: req.body.newpassword });
        user.save()
          .then(() => {
            res.status(200).send({ message: ' password Reset' });
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  };

  static async getProjectMembers(req, res) {
    const AuthorizedRolesToView = ['Manager', 'Administrator', 'Core Team'];
    const isRequestorAuthorized = !!((AuthorizedRolesToView.includes(req.body.requestor.role)));
    if (!isRequestorAuthorized) {
      res.status(403).send('You are not authorized to view all users');
      return;
    }
    UserProfile.find({
      projects: {
        $in: [req.params.projectId],
      },
    }, '_id firstName email', (err, profiles) => {
      if (err) {
        res.status(404).send('Error finding user profiles');
        return;
      }
      res.json(profiles);
    });
  };

  static async updatepassword(req, res) {
    const { userId } = req.params;
    const { requestor } = req.body;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({
        error: 'Bad Request',
      });
    }

    // Verify correct params in body
    if (!req.body.currentpassword || !req.body.newpassword || !req.body.confirmnewpassword) {
      return res.status(400).send({
        error: 'One of more required fields are missing',
      });
    }
    // Verify request is authorized by self or adminsitrator
    if (!userId === requestor.requestorId && !requestor.role === 'Administrator') {
      return res.status(403).send({
        error: "You are unauthorized to update this user's password",
      });
    }
    // Verify new and confirm new password are correct

    if (req.body.newpassword !== req.body.confirmnewpassword) {
      res.status(400).send({
        error: 'New and confirm new passwords are not same',
      });
    }

    // Verify old and new passwords are not same
    if (req.body.currentpassword === req.body.newpassword) {
      res.status(400).send({
        error: 'Old and new passwords should not be same',
      });
    }

    return UserProfile.findById(userId, 'password')
      .then((user) => {
        bcrypt.compare(req.body.currentpassword, user.password)
          .then((passwordMatch) => {
            if (!passwordMatch) {
              return res.status(400).send({
                error: 'Incorrect current password',
              });
            }

            user.set({
              password: req.body.newpassword,
            });
            return user.save()
              .then(() => res.status(200).send({ message: 'updated password' }))
              .catch(error => res.status(500).send(error));
          })
          .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(500).send(error));
  };

  static async getreportees(req, res) {
    if (!ObjectId.isValid(req.params.userId)) {
      res.status(400).send({
        error: 'Bad request',
      });
      return;
    }

    const userid = ObjectId(req.params.userId);
    const { role } = req.body.requestor;

    let validroles = ['Volunteer', 'Manager', 'Administrator', 'Core Team'];

    if (role === 'Volunteer' || role === 'Manager') {
      validroles = ['Volunteer', 'Manager'];
    }


    userhelper.getTeamMembers({
      _id: userid,
    })
      .then((results) => {
        const teammembers = [];

        results.myteam.forEach((element) => {
          if (!validroles.includes(element.role)) return;
          teammembers.push(element);
        });
        res.status(200).send(teammembers);
      })
      .catch(error => res.status(400).send(error));
  };

  static async getTeamMembersofUser(req, res) {
    if (!ObjectId.isValid(req.params.userId)) {
      res.status(400).send({
        error: 'Bad request',
      });
      return;
    }
    userhelper.getTeamMembers({
      _id: req.params.userId,
    })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch(error => res.status(400).send(error));
  };

  static async changeUserStatus(req, res) {
    const { userId } = req.params;
    const status = (req.body.status === 'Active');
    if (!ObjectId.isValid(userId)) {
      res.status(400).send({
        error: 'Bad Request',
      });
      return;
    }
    UserProfile.findById(userId, 'isActive')
      .then((user) => {
        user.set({
          isActive: status,
        });
        user.save()
          .then(() => {
            res.status(200).send({
              message: 'status updated',
            });
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  };

  static async resetPassword(req, res) {
    ValidatePassword(req);

    UserProfile.findById(req.params.userId, 'password')
      .then((user) => {
        user.set({
          password: req.body.newpassword,
        });
        user.save()
          .then(() => {
            res.status(200).send({
              message: ' password Reset',
            });
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  };

  // Load the users collection from a file
  static loadUsers(userData) {
    console.log('In userModel.loadUsers');
    return new Promise(function (resolve, reject) {
      const options = {};
      let p1 = this.insertMany('users', userData, options);
      p1.then((data) => {
        resolve(data);
      });
      p1.catch(err => {
        console.error('Error in userModel.loadUser : ' + err);
        reject(err);
      });
    });
  }
}
