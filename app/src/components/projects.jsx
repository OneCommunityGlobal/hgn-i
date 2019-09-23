import React from "react";

import { appContext } from "../config/app-context";

import { LoadingGraphic } from "../common/loading-graphic";
import Form from "../common/form";
import Library from "../libraries/library";

import ProjectService from "../services/project-service";
import ProjectSchema from "../schemas/project-schema";

class Projects extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      projectId: props.parm ? props.parm : null,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      data: [],
      errors: {},
      projectMap: [],
      currentProject: {},
      action: "render",
      minProjectName: "2",
      maxProjectName: "20",
      newProject: {
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

    this.setCurrentProject = this.setCurrentProject.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.createProject = this.createProject.bind(this);
    this.deleteProjectById = this.deleteProjectById.bind(this);
    this.updateProjectById = this.updateProjectById.bind(this);
  };

  setCurrentProject(e) {
    var currentProject = null;
    var action = e.currentTarget.dataset.action;
    if (action === 'create') {
      currentProject = this.state.newProject;
    } else {
      currentProject = this.state.projectMap.get(e.currentTarget.dataset.projectid);
    }
    this.setState({
      currentProject: currentProject,
      action: action,
      errors: {},
      });
  }

  doSubmit = async (data) => {
    var response = {};

    let action = this.state.action;
    if (action === 'create') {
      response = await this.createProject(data)
        .catch((err) => {
          console.log(err);
        });
    } else {
      response = await this.updateProjectById(data)
        .catch((err) => {
          console.log(err);
        });
    }

    if (response.success) {
      //Trigger the parent components refresh so the new data is shown
      let errors = {};
      errors['form'] = action === 'edit' ? "Project Updated" : 'Project Created';
      //TODO there is a problem if you set datafound and isloading: the screen is frozen as if the modal is open
      this.setState({
        refresh: true,
        // dataFound: false,
        // isLoading: true,
        errors: errors,
      });

      return;
    }

    //If there was an error in add/updating project, check errCode to handle.
    //TODO fix switch to reflect all valid errors when creating/updating project
    const errors = {};
    response.errCode = response.errCode ? response.errCode : 100;

    switch (response.errCode) {
      case 100:
        errors['form'] = action === 'edit' ? "Project Update Failed" : 'Project Create Failed';
        this.setState({ errors: errors });
        break;
      case 103:
        errors['form'] = "This Project Name Already Exists";
        this.setState({ errors: errors });
        break;
      default:
        break;
    }

    return;
  };

  async createProject(data) {
    let requestorId = this.context.userProfile._id;
    let response = await ProjectService.createProject(requestorId, data);

    return response;
  }

  async updateProjectById(data) {
    let requestorId = this.context.userProfile._id;
    let projectId = data._id;
    const newData = {};
    //Only pass fields that can be updated
    newData.isActive = data.isActive;

    let response = await ProjectService.updateProjectById(requestorId, projectId, newData);

    return response;
  }

  async deleteProjectById(e) {
    let requestorId = this.state.requestorId;
    let projectId = e.currentTarget.dataset.projectid;
    let response = await ProjectService.deleteProjectById(requestorId, projectId);

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

      let response = await ProjectService.getProjects(requestorId);

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          data: response.data,
          projectMap: Library.mapArrayOfObjects(response.data, "_id"),
          requestorId: this.context.userProfile._id,
          isAdmin: this.context.userProfile.isAdmin,
          currentProject: this.state.newProject,
        });
      }
    }

  }

  render() {
    const { data, isLoading } = this.state;
    const isAdmin = this.context.userProfile.isAdmin;
    const action = this.state.action;
    //TODO setting managerId for now but should be select list of users
    const newProject = {
      name: "",
      managerId: "5cf0ce5cdff6541c9c127f99",
      isActive: true,
    };

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <main className="card hgn_project bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Projects</h5>
            <div>Unable to Get Project Data - Try Refreshing</div>
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
              <h2>Projects
                {isAdmin &&
                  <button className="btn btn-success pull-right"
                    onClick={(e) => { this.setCurrentProject(e); }}
                    data-action='create'
                    data-toggle="modal"
                    data-target="#projectModal">Add New Project
                  </button>
                }
              </h2>
              <table
                className="table table-striped"
                id="projectstable"
              >
                <thead>
                  <tr>
                    <th scope="col">Project Name</th>
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
                            data-projectid={entry._id}
                            onClick={(e) => { this.setCurrentProject(e); }}
                            data-action="display"
                            data-toggle="modal"
                            data-target="#displayProjectMembersModal"
                          >
                          </i>
                        </td>
                        {isAdmin &&
                          <React.Fragment>
                            <td>
                              <i className="fa fa-edit"
                                data-projectid={entry._id}
                                onClick={(e) => { this.setCurrentProject(e); }}
                                data-action='edit'
                                data-toggle="modal"
                                data-target="#projectModal"
                              >
                              </i>
                            </td>
                            <td>
                              <i className="fa fa-trash"
                                data-projectid={entry._id}
                                onClick={(e) => { this.deleteProjectById(e); }}
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

              {/* Project Modal */}
              <div className="modal fade hide" id="projectModal" tabIndex="-1" role="dialog"
                aria-labelledby="#projectModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="projectModal">
                        {action.charAt(0).toUpperCase() + action.slice(1) + " "} Project
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    {(this.state.action === 'create' || this.state.action === 'edit') &&
                      <Form
                        data={action === 'create' ? newProject : this.state.currentProject}
                        formControl={this.state.formControl}
                        onSubmit={this.doSubmit}
                        schema={ProjectSchema}
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

              {/* Display Project Members Modal */}
              <div className="modal fade" id="displayProjectMembersModal" tabIndex="-1" role="dialog" aria-labelledby="displayProjectMembersModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="modalLabel">Viewing Members for Project: {this.state.currentProject.name}</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {(this.state.action === 'display') &&
                        (typeof this.state.currentProject.members !== 'undefined' && this.state.currentProject.members.length > 0) &&
                        <div>
                          <ul className="list-group">
                            {
                              this.state.currentProject.members.map(entry => {
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

export default Projects;
