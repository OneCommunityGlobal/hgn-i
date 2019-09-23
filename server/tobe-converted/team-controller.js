const deleteTeam = function (req, res) {
  const { teamId } = req.params;
  Team.findById(teamId, (error, record) => {
    if (error || record === null) {
      res.status(400).send({ error: 'No valid records found' });
      return;
    }
    const removeteamfromprofile = userProfile.updateMany({}, { $pull: { teams: record._id } }).exec();
    const deleteteam = record.remove();

    Promise.all([removeteamfromprofile, deleteteam])
      .then(res.status(200).send({ message: ' Team successfully deleted and user profiles updated' }))
      .catch((errors) => { res.status(400).send(errors); });
  })
    .catch((error) => { res.status(400).send(error); });
};

const assignTeamToUsers = function (req, res) {
  // verify requestor is administrator, teamId is passed in request params and is valid objectid, and request body contains  an array of users

  if (req.body.requestor.role !== 'Administrator') {
    res.status(403).send({ error: 'You are not authorized to perform this operation' });
    return;
  }

  if (!req.params.teamId || !ObjectId.isValid(req.params.teamId) || !req.body.users || (req.body.users.length === 0)) {
    res.status(400).send({ error: 'Invalid request' });
    return;
  }

  // verify team exists

  Team.findById(req.params.teamId)
    .then((team) => {
      if (!team || (team.length === 0)) {
        res.status(400).send({ error: 'Invalid team' });
        return;
      }
      const { users } = req.body;
      const assignlist = [];
      const unassignlist = [];

      users.forEach((element) => {
        const { userId, operation } = element;

        if (operation === 'Assign') { assignlist.push(userId); } else { unassignlist.push(userId); }
      });

      const assignPromise = userProfile.updateMany({ _id: { $in: assignlist } }, { $addToSet: { teams: team._id } }).exec();
      const unassignPromise = userProfile.updateMany({ _id: { $in: unassignlist } }, { $pull: { teams: team._id } }).exec();

      Promise.all([assignPromise, unassignPromise])
        .then(() => {
          res.status(200).send({ result: 'Done' });
        })
        .catch((error) => {
          res.status(500).send({ error });
        });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
};

const getTeamMembership = function (req, res) {
  const { teamId } = req.params;
  if (!ObjectId.isValid(teamId)) {
    res.status(400).send({ error: 'Invalid request' });
    return;
  }
  userProfile.find({ teams: teamId }, '_id firstName lastName')
    .sort({ firstName: 1, lastName: 1 })
    .then((results) => { res.status(200).send(results); })
    .catch((error) => { res.status(500).send(error); });
};
