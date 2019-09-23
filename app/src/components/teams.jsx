import React from "react";

import { appContext } from "../config/app-context";
import { LoadingGraphic } from "../common/loading-graphic";
import Form from "../common/form";
import Library from "../libraries/library";

import TeamService from "../services/team-service";
import TeamSchema from "../schemas/team-schema";

class Teams extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      teamId: props.parm ? props.parm : null,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      data: [],
      errors: {},
      teamMap: [],
      currentTeam: {},
      action: "render",
      minTeamName: "2",
      maxTeamName: "20",
      newTeam: {
        name: "",
        managerId: "5cf0ce5cdff6541c9c127f99",
        isActive: true,
      },

      formControl: {
        isWritable: false,
        elements: {
          _id: {
            isVisible: false
          },
          name: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: true,
          },
          managerId: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: false
          },
          isActive: {
            canEdit: true,
            isVisible: true,
          },
          submit: {
            canEdit: true,
            isVisible: true
          }
        },
      }

    }

    this.setCurrentTeam = this.setCurrentTeam.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.deleteTeamById = this.deleteTeamById.bind(this);
    this.updateTeamById = this.updateTeamById.bind(this);
  };

  setCurrentTeam(e) {
    var currentTeam = null;
    var action = e.currentTarget.dataset.action;
    if (action === 'create') {
      currentTeam = this.state.newTeam;
    } else {
      currentTeam = this.state.teamMap.get(e.currentTarget.dataset.teamid);
    }
    this.setState({
      currentTeam: currentTeam,
      action: action,
      errors: {},
    });
  }

  doSubmit = async (data) => {
    var response = {};

    let action = this.state.action;
    if (action === 'create') {
      response = await this.createTeam(data)
        .catch((err) => {
          console.log(err);
        });
    } else {
      response = await this.updateTeamById(data)
        .catch((err) => {
          console.log(err);
        });
    }

    if (response.success) {
      let errors = {};
      errors['form'] = action === 'edit' ? "Team Updated" : 'Team Created';
      //TODO there is a problem if you set datafound and isloading: the screen is frozen as if the modal is open
      this.setState({
        refresh: true,
        // dataFound: false,
        // isLoading: true,
        errors: errors,
      });

      return;
    }

    //If there was an error in add/updating team, check errCode to handle.
    //TODO fix switch to reflect all valid errors when creating/updating team
    const errors = {};
    response.errCode = response.errCode ? response.errCode : 100;

    switch (response.errCode) {
      case 100:
        errors['form'] = action === 'edit' ? "Team Update Failed" : 'Team Create Failed';
        this.setState({ errors: errors });
        break;
      case 103:
        errors['form'] = "This Team Name Already Exists";
        this.setState({ errors: errors });
        break;
      default:
        break;
    }

    return;
  };

  async createTeam(data) {
    let requestorId = this.context.userProfile._id;
    let response = await TeamService.createTeam(requestorId, data);

    return response;
  }

  async updateTeamById(data) {
    let requestorId = this.context.userProfile._id;
    let teamId = data._id;
    const newData = {};
    //Only pass fields that can be updated
    newData.isActive = data.isActive;

    let response = await TeamService.updateTeamById(requestorId, teamId, newData);

    return response;
  }

  async deleteTeamById(e) {
    let requestorId = this.state.requestorId;
    let teamId = e.currentTarget.dataset.teamid;
    let response = await TeamService.deleteTeamById(requestorId, teamId);

    if (!response.success) {
      //do something if delete failed?
    } else {
      this.setState({
        refresh: true,
        dataFound: false,
        isLoading: true,
      })
    }
  }

  async componentDidMount() {
    //This forces  the componentDidUpdate routine to fire after mounting which populates the data
    this.setState({ refresh: true });
  }

  async componentDidUpdate() {
    //*Warning*: Be careful not to setState here without a condition or it will go into an endless loop
    //and be sure to set the condition to false when done

    if (this.state.refresh) {
      const requestorId = this.context.userProfile._id;

      let response = await TeamService.getTeams(requestorId);

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          data: response.data,
          teamMap: Library.mapArrayOfObjects(response.data, "_id"),
          requestorId: this.context.userProfile._id,
          isAdmin: this.context.userProfile.isAdmin,
          currentTeam: this.state.newTeam,
        });
      }
    }

  }

  render() {
    const { data, isLoading } = this.state;
    const isAdmin = this.context.userProfile.isAdmin;
    const action = this.state.action;

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <main className="card hgn_team bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Teams</h5>
            <div>Unable to Get Team Data - Try Refreshing</div>
          </div>
        </main>
      );
    } else {
      return (
        <main>
          {isLoading &&
            <div><LoadingGraphic /></div>
          }

          {!isLoading && (
            <React.Fragment>
              <h2>Teams
                {isAdmin &&
                  <button className="btn btn-success pull-right"
                    onClick={(e) => { this.setCurrentTeam(e); }}
                    data-action='create'
                    data-toggle="modal"
                    data-target="#teamModal">Add New Team
                  </button>
                }
              </h2>
              <table
                className="table table-striped"
                id="teamstable"
              >
                <thead>
                  <tr>
                    <th scope="col">Team Name</th>
                    <th scope="col"> Active</th>
                    <th scope="col">Membership Details</th>
                    {isAdmin &&
                      <React.Fragment>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                      </React.Fragment>
                    }
                  </tr>
                </thead>
                <tbody>
                  {data.map(entry => {
                    return (
                      <tr className="submitted"
                        id={entry._id}
                        key={entry._id}
                      >
                        <td>
                          <input
                            className="form-control w-100 h-100"
                            value={entry.name}
                            readOnly
                          />
                        </td>
                        <td>
                          <input type="checkbox"
                            defaultChecked={entry.isActive}
                            disabled
                          />
                        </td>
                        <td>
                          <i className="fa fa-users m-3"
                            data-teamid={entry._id}
                            onClick={(e) => { this.setCurrentTeam(e); }}
                            data-action="display"
                            data-toggle="modal"
                            data-target="#displayTeamMembersModal"
                          >
                          </i>
                        </td>
                        {isAdmin &&
                          <React.Fragment>
                            <td>
                              <i className="fa fa-edit"
                                data-teamid={entry._id}
                                onClick={(e) => { this.setCurrentTeam(e); }}
                                data-action='edit'
                                data-toggle="modal"
                                data-target="#teamModal"
                              >
                              </i>
                            </td>
                            <td>
                              <i className="fa fa-trash"
                                data-teamid={entry._id}
                                onClick={(e) => { this.deleteTeamById(e); }}
                              >
                              </i>
                            </td>
                          </React.Fragment>
                        }
                      </tr>
                    );
                  })}

                </tbody>
              </table>

              {/* Team Modal */}
              <div className="modal fade hide" id="teamModal" tabIndex="-1" role="dialog"
                aria-labelledby="#teamModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="teamModal">
                        {action.charAt(0).toUpperCase() + action.slice(1) + " "} Team
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    {(this.state.action === 'create' || this.state.action === 'edit') &&
                      <Form
                        data={action === 'create' ? this.state.newTeam : this.state.currentTeam}
                        formControl={this.state.formControl}
                        onSubmit={this.doSubmit}
                        schema={TeamSchema}
                        className="col-md-12 xs-12"
                      >
                        <div className="modal-body">
                          <input name="_id" isVisible={false}></input>
                          <input
                            name="name"
                            label="Name:"
                            type="text"
                            className="col-md-8"
                            canEdit={action === 'edit' ? false : true}
                          />
                          {/*TODO Change this to a renderSelect with user id's and names */}
                          <input
                            name="managerId"
                            label="Manager:"
                            className="col-md-8"
                            canEdit={true}
                          />
                          <checkbox
                            type="checkbox"
                            name="isActive"
                            label="Is Active:"
                            className="col-md-8"
                            checked="isActive"
                            canEdit={true}
                          />
                        </div>
                        <div className="modal-body">
                          <div><button name="submit" type="submit" label="Save Changes" canEdit={true}></button></div>
                          {this.state.errors.form && <div className="alert alert-danger mt-1">{this.state.errors.form}</div>}
                        </div>
                      </Form>
                    }
                  </div>
                </div>
              </div>

              {/* Display Team Members Modal */}
              <div className="modal fade" id="displayTeamMembersModal" tabIndex="-1" role="dialog" aria-labelledby="displayTeamMembersModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="modalLabel">Viewing Members for Team: {this.state.currentTeam.name}</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {(this.state.action === 'display') &&
                        (typeof this.state.currentTeam.members !== 'undefined' && this.state.currentTeam.members.length > 0) &&
                        <div>
                          <ul className="list-group">
                            {
                              this.state.currentTeam.members.map(entry => {
                                return (
                                  <li key={entry._id} className="list-group-item" data-userid={entry._id}>{entry.firstName + " " + entry.lastName}</li>
                                );
                              })
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {this.state.errors.page && <div className="alert alert-danger mt-1">{this.state.errors.page}</div>}

            </React.Fragment>
          )}
        </main>
      );
    }
  }
}

export default Teams;
