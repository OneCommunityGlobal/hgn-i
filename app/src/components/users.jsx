import React from "react";

import { appContext } from "../config/app-context";
import { LoadingGraphic } from "../common/loading-graphic";
import Library from "../libraries/library";

import UserService from "../services/user-service";

//TODO currently this component is only for viewing users in bulk. It does not allow changes to user records.
class Users extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      userId: props.parm ? props.parm : null,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      data: [],
      errors: {},
      userMap: [],
      currentUser: {},
      action: "render",
      minUserName: "2",
      maxUserName: "20",
      newUser: {
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

    this.setCurrentUser = this.setCurrentUser.bind(this);
    // this.doSubmit = this.doSubmit.bind(this);
    // this.createUser = this.createUser.bind(this);
    // this.deleteUserById = this.deleteUserById.bind(this);
    // this.updateUserById = this.updateUserById.bind(this);
  };

  setCurrentUser(e) {
    var currentUser = null;
    var action = e.currentTarget.dataset.action;
    if (action === 'create') {
      currentUser = this.state.newUser;
    } else {
      currentUser = this.state.userMap.get(e.currentTarget.dataset.userid);
    }
    this.setState({
      currentUser: currentUser,
      action: action,
      errors: {},
    });

    return
  }

  // doSubmit = async (data) => {
  //   var response = {};

  //   let action = this.state.action;
  //   if (action === 'create') {
  //     response = await this.createUser(data)
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } else {
  //     response = await this.updateUserById(data)
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  //   if (response.success) {
  //     let errors = {};
  //     errors['form'] = action === 'edit' ? "User Updated" : 'User Created';
  //     //TODO there is a problem if you set datafound and isloading: the screen is frozen as if the modal is open
  //     this.setState({
  //       refresh: true,
  //       // dataFound: false,
  //       // isLoading: true,
  //       errors: errors,
  //     });

  //     return;
  //   }

  //   //If there was an error in add/updating user, check errCode to handle.
  //   //TODO fix switch to reflect all valid errors when creating/updating user
  //   const errors = {};
  //   response.errCode = response.errCode ? response.errCode : 100;

  //   switch (response.errCode) {
  //     case 100:
  //       errors['form'] = action === 'edit' ? "User Update Failed" : 'User Create Failed';
  //       this.setState({ errors: errors });
  //       break;
  //     case 103:
  //       errors['form'] = "This User Name Already Exists";
  //       this.setState({ errors: errors });
  //       break;
  //     default:
  //       break;
  //   }

  //   return;
  // };

  // async createUser(data) {
  //   let requestorId = this.context.userProfile._id;
  //   let response = await UserService.createUser(requestorId, data);

  //   return response;
  // }

  // async updateUserById(data) {
  //   let requestorId = this.context.userProfile._id;
  //   let userId = data._id;
  //   const newData = {};
  //   //Only pass fields that can be updated
  //   newData.isActive = data.isActive;

  //   let response = await UserService.updateUserById(requestorId, userId, newData);

  //   return response;
  // }

  // async deleteUserById(e) {
  //   let requestorId = this.state.requestorId;
  //   let userId = e.currentTarget.dataset.userid;
  //   let response = await UserService.deleteUserById(requestorId, userId);

  //   if (!response.success) {
  //     //do something if delete failed?
  //   } else {
  //     this.setState({
  //       refresh: true,
  //       dataFound: false,
  //       isLoading: true,
  //     })
  //   }
  // }

  async componentDidMount() {
    //This forces  the componentDidUpdate routine to fire after mounting which populates the data
    this.setState({ refresh: true });
  }

  async componentDidUpdate() {
    //*Warning*: Be careful not to setState here without a condition or it will go into an endless loop
    //and be sure to set the condition to false when done

    if (this.state.refresh) {
      const requestorId = this.context.userProfile._id;

      let response = await UserService.getUsers(requestorId);

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          data: response.data,
          userMap: Library.mapArrayOfObjects(response.data, "_id"),
          requestorId: this.context.userProfile._id,
          isAdmin: this.context.userProfile.isAdmin,
          currentUser: this.state.newUser,
        });
      }
    }
  }

  render() {
    const { data, isLoading } = this.state;
    // const isAdmin = this.context.userProfile.isAdmin;
    // const action = this.state.action;
    const teams = data.teams;
    // const projects = data.projects;

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <main className="card hgn_user bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Users</h5>
            <div>Unable to Get User Data - Try Refreshing</div>
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
              <h2>Users</h2>
              <table
                className="table table-striped"
                id="userstable"
              >
                <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">Active</th>
                    <th scope="col">Admin</th>
                    <th scope="col">Teams</th>
                    <th scope="col">Projects</th>
                    {/* {isAdmin &&
                      <React.Fragment>
                        <th scope="col">Delete</th>
                      </React.Fragment>
                    } */}
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
                            value={entry.userName}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control w-100 h-100"
                            value={entry.firstName + " " + entry.lastName}
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
                          <input type="checkbox"
                            defaultChecked={entry.isAdmin}
                            disabled
                          />
                        </td>
                        <td>
                          <i className="fa fa-users m-3"
                            data-userid={entry._id}
                            onClick={(e) => { this.setCurrentUser(e); }}
                            data-action="display"
                            data-type="teams"
                            data-toggle="modal"
                            data-target="#displayMembershipsModal"
                          >
                          </i>
                        </td>
                        <td>
                          <i className="fa fa-users m-3"
                            data-userid={entry._id}
                            onClick={(e) => { this.setCurrentUser(e); }}
                            data-action="display"
                            data-type="projects"
                            data-toggle="modal"
                            data-target="#displayMembershipsModal"
                          >
                          </i>
                        </td>
                        {/* {isAdmin &&
                          <td>
                            <i className="fa fa-trash"
                              data-userid={entry._id}
                              onClick={(e) => { this.deleteUserById(e); }}
                            >
                            </i>
                          </td>
                        } */}
                      </tr>
                    );
                  })}

                </tbody>
              </table>

              {/* Display Users Memberships Modal */}
              <div className="modal fade" id="displayMembershipsModal" tabIndex="-1" role="dialog" aria-labelledby="displayMembershipsModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="modalLabel">Viewing Members for User: {this.state.currentUser.name}</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {(this.state.action === 'display') &&
                        (typeof teams !== 'undefined' && teams.length > 0) &&
                        <div>
                          <ul className="list-group">
                            {
                              teams.map(entry => {
                                return (
                                  <li
                                    key={entry._id}
                                    className="list-group-item"
                                    data-userid={entry._id}
                                  >{entry.firstName + " " + entry.lastName}
                                  </li>
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

export default Users;
