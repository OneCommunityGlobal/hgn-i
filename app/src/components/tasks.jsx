import React from "react";

import { appContext } from "../config/app-context";

import { LoadingGraphic } from "../common/loading-graphic";
import Form from "../common/form";
import Library from "../libraries/library";

import TaskService from "../services/task-service";
import TaskSchema from "../schemas/task-schema";

class Tasks extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      taskId: props.parm ? props.parm : null,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      data: [],
      errors: {},
      taskMap: [],
      currentTask: {},
      action: "render",
      minTaskName: "2",
      maxTaskName: "20",
      newTask: {
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
          description: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: true,
          },
          assignedToId: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: false
          },
          isActive: {
            canEdit: true,
            isVisible: true,
          },
          isComplete: {
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

    this.setCurrentTask = this.setCurrentTask.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.createTask = this.createTask.bind(this);
    this.deleteTaskById = this.deleteTaskById.bind(this);
    this.updateTaskById = this.updateTaskById.bind(this);
  };

  setCurrentTask(e) {
    var currentTask = null;
    var action = e.currentTarget.dataset.action;
    if (action === 'create') {
      currentTask = this.state.newTask;
    } else {
      currentTask = this.state.taskMap.get(e.currentTarget.dataset.taskid);
    }
    this.setState({
      currentTask: currentTask,
      action: action,
      errors: {},
    });
  }

  doSubmit = async (data) => {
    var response = {};

    let action = this.state.action;
    if (action === 'create') {
      response = await this.createTask(data)
        .catch((err) => {
          console.log(err);
        });
    } else {
      response = await this.updateTaskById(data)
        .catch((err) => {
          console.log(err);
        });
    }

    if (response.success) {
      let errors = {};
      errors['form'] = action === 'edit' ? "Task Updated" : 'Task Created';
      //TODO there is a problem if you set datafound and isloading: the screen is frozen as if the modal is open
      this.setState({
        refresh: true,
        // dataFound: false,
        // isLoading: true,
        errors: errors,
      });

      return;
    }

    //If there was an error in add/updating task, check errCode to handle.
    //TODO fix switch to reflect all valid errors when creating/updating task
    const errors = {};
    response.errCode = response.errCode ? response.errCode : 100;

    switch (response.errCode) {
      case 100:
        errors['form'] = action === 'edit' ? "Task Update Failed" : 'Task Create Failed';
        this.setState({ errors: errors });
        break;
      case 103:
        errors['form'] = "This Task Name Already Exists";
        this.setState({ errors: errors });
        break;
      default:
        break;
    }

    return;
  };

  async createTask(data) {
    let requestorId = this.context.userProfile._id;
    let response = await TaskService.createTask(requestorId, data);

    return response;
  }

  async updateTaskById(data) {
    let requestorId = this.context.userProfile._id;
    let taskId = data._id;
    const newData = {};
    //Only pass fields that can be updated
    newData.isActive = data.isActive;

    let response = await TaskService.updateTaskById(requestorId, taskId, newData);

    return response;
  }

  async deleteTaskById(e) {
    let requestorId = this.state.requestorId;
    let taskId = e.currentTarget.dataset.taskid;
    let response = await TaskService.deleteTaskById(requestorId, taskId);

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

      let response = await TaskService.getTasks(requestorId);

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          data: response.data,
          taskMap: Library.mapArrayOfObjects(response.data, "_id"),
          requestorId: this.context.userProfile._id,
          isAdmin: this.context.userProfile.isAdmin,
          currentTask: this.state.newTask,
        });
      }
    }

  }

  render() {
    const { data, isLoading } = this.state;
    const isAdmin = this.context.userProfile.isAdmin;
    const action = this.state.action;
    //TODO setting managerId for now but should be select list of users
    const newTask = {
      name: "",
      managerId: "5cf0ce5cdff6541c9c127f99",
      isActive: true,
    };

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <main className="card hgn_task bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Tasks</h5>
            <div>Unable to Get Task Data - Try Refreshing</div>
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
              <h2>Tasks
                {isAdmin &&
                  <button className="btn btn-success pull-right"
                    onClick={(e) => { this.setCurrentTask(e); }}
                    data-action='create'
                    data-toggle="modal"
                    data-target="#taskModal">Add New Task
                  </button>
                }
              </h2>
              <table
                className="table table-striped" id="taskstable">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Active</th>
                    <th scope="col">Complete</th>
                    <th scope="col">Assigned To</th>
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
                      <tr className="submitted" id={entry._id} key={entry._id} >
                        <td>
                          {entry.name}
                        </td>
                        <td>
                          <input type="checkbox"
                            checked={entry.isActive}
                            disabled
                          />
                        </td>
                        <td>
                          <input type="checkbox"
                            checked={entry.isComplete}
                            disabled
                          />
                        </td>
                        <td>
                          {entry.assignedToFirstName + " " + entry.assignedToLastName}
                        </td>
                        {isAdmin &&
                          <React.Fragment>
                            <td>
                              <i className="fa fa-edit"
                                data-taskid={entry._id}
                                onClick={(e) => { this.setCurrentTask(e); }}
                                data-action='edit'
                                data-toggle="modal"
                                data-target="#taskModal"
                              >
                              </i>
                            </td>
                            <td>
                              <i className="fa fa-trash"
                                data-taskid={entry._id}
                                onClick={(e) => { this.deleteTaskById(e); }}
                              >
                              </i>
                            </td>
                          </React.Fragment>
                        }
                      </tr>);
                  })}
                </tbody>
              </table>

              {/* Task Modal */}
              <div className="modal fade hide" id="taskModal" tabIndex="-1" role="dialog"
                aria-labelledby="#taskModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="taskModal">
                        {action.charAt(0).toUpperCase() + action.slice(1) + " "} Task
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    {(this.state.action === 'create' || this.state.action === 'edit') &&
                      <Form
                        data={action === 'create' ? newTask : this.state.currentTask}
                        formControl={this.state.formControl}
                        onSubmit={this.doSubmit}
                        schema={TaskSchema}
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
                          <textarea
                            name="description"
                            label="Description:"
                            className="col-md-8"
                            rows="3"
                            cols="60"
                            canEdit={true}
                          />
                          {/*TODO Change this to a renderSelect with user id's and names */}
                          <input
                            name="assignedToId"
                            label="Assigned To:"
                            className="col-md-8"
                            canEdit={true}
                          />
                          <checkbox
                            type="checkbox"
                            name="isComplete"
                            label="Is Complete:"
                            className="col-md-8"
                            checked="isComplete"
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

              {this.state.errors.page && <div className="alert alert-danger mt-1">{this.state.errors.page}</div>}

            </React.Fragment>
          )}
        </main>
      );
    }
  }
}

export default Tasks;
