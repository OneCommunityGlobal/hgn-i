import React from "react";

import { appContext } from "../config/app-context";

import { LoadingGraphic } from "../common/loading-graphic";
// import Library from "../libraries/library";

import TimesheetService from "../services/timesheet-service";

class Timesheets extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      timesheetId: props.parm ? props.parm : null,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      timesheetData: [],
      timesheetMap: [],
      currentTimesheet: {
        name: "Dummy",
        members: []
      },
      minTimesheetName: "2",
      maxTimesheetName: "20",
      newTimesheet: {
        timesheetName: "",
        isActive: true
      },

      errors: {},

      form: {
        isWritable: false,
        elements: {
          name: {
            validateWhileTyping: false,
          },
          isActive: {
            canEdit: false,
          },
        },
      }

    }

    this.setCurrentTimesheet = this.setCurrentTimesheet.bind(this);
    this.createTimesheet = this.createTimesheet.bind(this);
    this.updateTimesheetById = this.updateTimesheetById.bind(this);
    this.deleteTimesheetById = this.deleteTimesheetById.bind(this);
  };

  setCurrentTimesheet(e) {
    const currentTimesheet = this.state.timesheetMap.get(e.currentTarget.dataset.timesheetid);
    this.setState({ currentTimesheet: currentTimesheet });
  }

  async createTimesheet(e) {
    let requestorId = this.state.requestorId;
    let timesheetId = e.currentTarget.dataset.timesheetid;
    TimesheetService.createTimesheet(requestorId, timesheetId);

    this.setState({
      refresh: true,
      dataFound: false,
      isLoading: true,
      timesheetData: [],
      timesheetMap: []
    })
  }

  async updateTimesheetById(e) {
    let requestorId = this.state.requestorId;
    let timesheetId = e.currentTarget.dataset.timesheetid;
    TimesheetService.updateTimesheetById(requestorId, timesheetId);

    this.setState({
      refresh: false,
      dataFound: false,
      isLoading: true,
      timesheetData: [],
      timesheetMap: []
    })
  }

  async deleteTimesheetById(e) {
    let requestorId = this.state.requestorId;
    let timesheetId = e.currentTarget.dataset.timesheetid;
    let response = await TimesheetService.deleteTimesheetById(requestorId, timesheetId);

    if (!response.success) {
      //do something if delete failed.
    } else {
      this.setState({
        refresh: true,
        dataFound: false,
        isLoading: true,

        timesheetData: [],
        timesheetMap: [],
        currentTimesheet: {
          _id: null,
          name: null,
          isActive: null,
          members: []
        }
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
      // const requestorId = this.context.userProfile._id;

      //TODO figure out what data should be retrieved 
      // let response = await TimesheetService.getTimesheets(requestorId);
      let response = {};
      response.success = true;

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          // timesheetData: response.data,
          // timesheetMap: Library.mapArrayOfObjects(response.data, "_id"),
          // requestorId: this.context.userProfile._id,
          // isAdmin: this.context.userProfile.isAdmin,
        });
      }
    }

  }

  render() {
    // const isAdmin = this.context.userProfile.isAdmin;

    const model = "";
    const numtasks = 0;
    // const nummessages = 0;

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <main className="card hgn_timesheet bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Timesheets</h5>
            <div>Unable to Get Timesheet Data - Try Refreshing</div>
          </div>
        </main>
      );
    } else {
      // const { timesheetData, isLoading } = this.state;
      const { isLoading } = this.state;

      return (
        <main>
          {isLoading &&
            <div><LoadingGraphic /></div>
          }

          {!isLoading && (
            <React.Fragment>

              <div>
                <div>
                  <nav className="navbar navbar-expand-md navbar-light bg-light mb-3 nav-fill">
                    <li className="navbar-brand">** The Timesheet Component Needs TBD** Viewing Timesheet For: {model.name}</li>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                      data-target="#timesheetsnapshot" aria-controls="navbarSupportedContent"
                      aria-expanded="false" aria-label="Toggle navigation">
                    </button>
                    <div className="collapse navbar-collapse" id="timesheetsnapshot">
                      <ul className="navbar-nav w-100">
                        <li className="nav-item navbar-text mr-3 w-25" id="timesheetweeklychart">
                          {/* weekly - effort - chart data-forUserId={model.forUserId} data-elementid="timesheetweeklychart" called_at = called_at} */}
                        </li>
                        <li className="nav-item  navbar-text">
                          <span className="fa fa-tasks icon-large" data-toggle="modal" data-target="#tasks">
                            <i className="badge badge-pill badge-warning badge-notify">{numtasks}</i>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>

                <div className="col-12 row mb-3">
                  <div className="col-md-8">
                    <div className="card border-primary">
                      <div className="card-header">
                        <h4 className="card-title ">
                          <a className="accordion-toggle" href="#dummy" data-toggle="collapse" data-target="#timesheets">Time Sheets</a>
                        </h4>
                        <h6 className="card-subtitle mb-2 text-muted">Viewing timesheets logged in last 3 weeks
            {/* if isEditable */}
                          {/*  eq model.forUserId loggedinUser.requestorId */}
                          <button className="btn btn-success pull-right" data-toggle="modal" data-target="#timentrymodal">Add Timesheet
                </button>
                          {/* else isEditable */}
                          <button className="btn btn-warning pull-right" data-toggle="modal" data-target="#timentrymodal">Add Timesheet for {model.name}
                          </button>
                          {/* endif isEditable */}
                          < div className="modal fade" id="timentrymodal" tabIndex="-1" role="dialog" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-body">
                                  {/* if (eq model.forUserId loggedinUser.requestorId) */}
                                  {/* hgn - task - update - form forUserId = model.forUserId notifyController = (action (mut called_at )) taskhours = loggedinUserTaskHours taskminutes = loggedinUserTaskMinutes */}
                                  {/* else */}
                                  {/* hgn - task - update - form forUserId = model.forUserId notifyController = (action (mut called_at )) */}
                                  {/* endif */}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* endif */}
                        </h6>
                      </div>
                      <div className="card-body" id="timesheets">
                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                            <a className="nav-link active " id="current-week-tab" data-toggle="tab" href="#current-week" role="tab" aria-controls="current-week"
                              aria-selected="true">Current Week</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" id="last-week-tab" data-toggle="tab" href="#last-week" role="tab" aria-controls="last-week" aria-selected="false">Previous Week</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link " id="penultimate-week-tab" data-toggle="tab" href="#penultimate-week" role="tab" aria-controls="penultimate-week"
                              aria-selected="false">Week Before Last</a>
                          </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                          <div id="current-week" className="tab-pane fade show active" role="tabpanel" aria-labelledby="current-week-tab">
                            {/* hgn - viewtimesheet loggedinUser = loggedinUser projectfiltervalue = "" forUserId = model.forUserId  fromDate = forweek.fromDate_wk_0 toDate = forweek.toDate_wk_0 called_at = called_at  notifyController = (action (mut  called_at )) */}
                          </div>
                          <div id="last-week" className="tab-pane fade" role="tabpanel" aria-labelledby="last-week-tab">
                            {/* hgn - viewtimesheet loggedinUser = loggedinUser projectfiltervalue = "" forUserId = model.forUserId  fromDate = forweek.fromDate_wk_1 toDate = forweek.toDate_wk_1 called_at = called_at  notifyController = (action (mut  called_at ))*/}
                          </div>
                          <div id="penultimate-week" className="tab-pane fade" role="tabpanel" aria-labelledby="penultimate-week-tab">
                            {/* hgn - viewtimesheet loggedinUser = loggedinUser projectfiltervalue = "" forUserId = model.forUserId  fromDate = forweek.fromDate_wk_2 toDate = forweek.toDate_wk_2 called_at = called_at  notifyController = (action (mut  called_at ))*/}
                          </div>
                        </div>
                        {/* if isEditable */}
                        <a href="/#/AllTimeEntries/{model.forUserId}" className="card-link">View Entries For Other Period</a>
                        {/* endif */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal fade" id="tasks" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        {/* hgn - tasks  loggedinUser = loggedinUser forUserId = model.forUserId notifyController = (action (mut numtasks ))  */}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </React.Fragment>
          )}
        </main>
      );
    }
  }
}

export default Timesheets;
