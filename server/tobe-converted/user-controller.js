class User {

  static async getEmailMessageForForgotPassword(user, ranPwd) {
    const message = `<b> Hello ${user.firstName} ${user.lastName},</b>
      <p>Do not reply to this mail.</p> 
      <p>Your 'forgot password' request was recieved and here is your new password:</p>
      <blockquote> ${ranPwd}</blockquote>
      <p>Please change this password the next time you log in. Do this by clicking the arrow in the top-right corner by your profile picture and then selecting the "Update Password" option. </P>
      <p>Thank you,<p>
      <p>One Community</p>
      `;
    return message;
  }

  static async forgotPwdController(userProfile) {
    const forgotPwd = async function (req, res) {
      const _email = (req.body.email).toLowerCase();
      const _firstName = (req.body.firstName);
      const _lastName = (req.body.lastName);

      const user = await userProfile.findOne({
        email: { $regex: _email, $options: 'i' },
        firstName: { $regex: _firstName, $options: 'i' },
        lastName: { $regex: _lastName, $options: 'i' },
      })
        .catch((error) => {
          res.status(500).send(error);
          logger.logException(error);
        });

      if (!user) {
        res.status(400).send({ error: 'No Valid user was found' });
        return;
      }
      const ranPwd = uuidv4().concat('TEMP');
      user.set({ password: ranPwd });
      user.save()
        .then(() => {
          emailSender(
            user.email,
            'Account Password change',
            getEmailMessageForForgotPassword(user, ranPwd),
            null,
            null,
          );
          logger.logInfo(`New password ${ranPwd} was generated for user._id`);

          res.status(200).send({ message: 'generated new password' });
        })
        .catch((error) => {
          logger.logException(error);
          res.status(500).send(error);
        });
    };
    return { forgotPwd };
  };


  static async monthlydata(req, res) {
    const userId = ObjectId(req.params.userId);
    const laborthismonth = dashboardhelper.laborthismonth(userId, req.params.fromDate, req.params.toDate);
    laborthismonth.then((results) => {
      if (!results || results.length === 0) {
        const emptyresult = [{
          projectName: '',
          timeSpent_hrs: 0,
        }];
        res.status(200).send(emptyresult);
        return;
      }
      res.status(200).send(results);
    });
  };

  static async weeklydata(req, res) {
    const userId = ObjectId(req.params.userId);
    const laborthisweek = dashboardhelper.laborthisweek(userId, req.params.fromDate, req.params.toDate);
    laborthisweek.then((results) => { res.send(results).status(200); });
  };

}