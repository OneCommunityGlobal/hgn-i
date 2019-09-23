import React from "react";

import { appContext } from "../config/app-context";
import _ from "lodash";
// import Link from "../common/link"
//import Form from "../common/form";
import {LoadingGraphic} from "../common/loading-graphic";
import TimesheetService from "../services/timesheet-service";

//from actions called from timeentry when user is clicked on
// function getTimeEntryForSpecifiedPeriod(userId, fromDate, toDate) {
//   const request = httpService.get(
//     `${APIEndpoint}/TimeEntry/user/${userId}/${fromDate}/${toDate}`
//   );

//   return dispatch => {
//     request.then(({ data }) => {
//       dispatch({
//         type: "GET_TIME_ENTRY_FOR_SPECIFIED_PERIOD",
//         payload: data
//       });
//     });
//   };
// }

//from utils called when user is clicked on
// const getTimeEntries = (getTimeEntryForSpecifiedPeriod, id) => {
//   // const state = store.getState();
//   const state = {};

//   let howManyDays;
//   if (state.whichWeek === "Current Week") {
//     howManyDays = 0;
//   } else if (state.whichWeek === "Last Week") {
//     howManyDays = 7;
//   } else if (state.whichWeek === "Week Before Last") {
//     howManyDays = 14;
//   }
//   const startWeek = moment()
//     .subtract(howManyDays, "days")
//     .startOf("week")
//     .format("YYYY-MM-DD");
//   const endWeek = moment()
//     .subtract(howManyDays, "days")
//     .endOf("week")
//     .format("YYYY-MM-DD");

//   return getTimeEntryForSpecifiedPeriod(id, startWeek, endWeek);
// };

//TODO default is past week ?
// const startWeek = moment()
//   .subtract(14, "days")
//   .startOf("week")
//   .format("YYYY-MM-DD");
// const endWeek = moment()
//   .subtract(14, "days")
//   .endOf("week")
//   .format("YYYY-MM-DD");

class Leaderboard extends React.Component {

  static contextType = appContext;

  state = {
    dataFound: false,
    leaderboardData: [],
    maxtotal: 0,
    isLoading: true,
    _id: this.context.userProfile._id,
    requestorId: this.context.userProfile._id,
    whichWeek: "Week Before Last",
  };

  async componentDidMount() {
    const parms = {};

    parms.startDate = "2019-01-01";
    parms.endDate = "2019-12-31";

    let response = await TimesheetService.getLeaderboardData(this.state.requestorId, parms);

    if (!response.success) {
      this.setState({ dataFound: false, isLoading: false });
    } else {
      this.setState({ leaderboardData: response.data, dataFound: true });
    }
  }

  componentDidUpdate() {
    if (!this.state.isLoading) return;

    const data = this.state.leaderboardData;
    let maxtotal = 0;
    const leaderboardData = [];
    maxtotal = _.maxBy(data, "totaltime_hrs").totaltime_hrs;
    maxtotal = maxtotal === 0 ? 10 : maxtotal;
    data.forEach(element => {
      leaderboardData.push({
        didMeetWeeklyCommitment:
          element.totaltangibletime_hrs >= element.weeklyComittedHours,
        name: element.firstName.substring(0, 1) + ". " + element.lastName,
        weeklycommited: _.round(element.weeklyComittedHours, 2),
        personId: element._id,
        tangibletime: _.round(element.totaltangibletime_hrs, 2),
        intangibletime: _.round(element.totalintangibletime_hrs, 2),
        tangibletimewidth: _.round(
          (element.totaltangibletime_hrs * 100) / maxtotal,
          0
        ),
        intangibletimewidth: _.round(
          (element.totalintangibletime_hrs * 100) / maxtotal,
          0
        ),
        tangiblebarcolor: this.getcolor(element.totaltangibletime_hrs),
        totaltime: _.round(element.totaltime_hrs, 2)
      });
    });

    this.setState({ leaderboardData, maxtotal, isLoading: false });
  }

  // handleClick = person => {
  //   this.props.getUserProfile(person, getTimeEntries);
  // };

  getcolor = effort => {
    let color = "purple";
    if (_.inRange(effort, 0, 5)) color = "red";
    if (_.inRange(effort, 5, 10)) color = "orange";
    if (_.inRange(effort, 10, 20)) color = "green";
    if (_.inRange(effort, 20, 30)) color = "blue";
    if (_.inRange(effort, 30, 40)) color = "indigo";
    if (_.inRange(effort, 40, 50)) color = "violet";
    return color;
  };

  render() {
    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <div className="card hgn_leaderboard bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Leader Board</h5>
            <div>Unable to Get LeaderBoard Data - Try Refreshing</div>
          </div>
        </div>
      );
    } else {
      const { leaderboardData, maxtotal, isLoading } = this.state;
      const loggedinUser = this.props.userProfile._id;

      return (
        <div className="card hgn_leaderboard bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Leader Board</h5>
            {isLoading && <div><LoadingGraphic /></div> }
            {!isLoading && (
              <div>
                <table className="table table-sm dashboardtable">
                  <tbody>
                    {leaderboardData.map(entry => {
                      return (
                        <tr
                          // onClick={() => { this.handleClick(entry.personId); }}
                          key={entry.personId}
                          className={
                            entry.personId === loggedinUser
                              ? "table-active row"
                              : "row"
                          }
                        >
                          <td className="col-1">
                            <i
                              className="fa fa-circle"
                              style={Object.assign({
                                color: (() =>
                                  entry.didMeetWeeklyCommitment
                                    ? "green"
                                    : "red")()
                              })}
                              data-toggle="tooltip"
                              data-placement="left"
                              title={`Weekly Committed: ${
                                entry.weeklycommited
                                } hours\nTangibleEffort: ${
                                entry.tangibletime
                                } hours `}
                            />
                          </td>
                          <td className="text-left col-3">
                            {/* <Link to={`/profile/${entry.personId}`}> */}
                              {entry.name}
                            {/* </Link> */}
                          </td>
                          <td className="text-right text-justify text-nowrap col-2">
                            {entry.tangibletime}{' '}tan
                          </td>
                          <td className="col-4 text-center">
                            {/* <Link to={`/timelog/${entry.personId}`}> */}
                              <div className="progress progress-leaderboard">
                                <div
                                  className="progress-bar progress-bar-striped"
                                  role="progressbar"
                                  style={Object.assign({
                                    width: `${entry.tangibletimewidth}%`,
                                    backgroundColor: entry.tangiblebarcolor
                                  })}
                                  aria-valuenow={entry.tangibletime}
                                  aria-valuemin="0 "
                                  aria-valuemax={maxtotal}
                                  data-toggle="tooltip"
                                  data-placement="bottom"
                                  title={`Tangible Effort: ${
                                    entry.tangibletime
                                    } hours`}
                                >
                                </div>
                                <div
                                  className="progress-bar progress-bar-striped bg-info"
                                  role="progressbar"
                                  style={{ width: entry.intangibletimewidth }}
                                  aria-valuenow={entry.intangibletime}
                                  aria-valuemin="0"
                                  aria-valuemax={maxtotal}
                                  data-toggle="tooltip"
                                  data-placement="bottom"
                                  title={`Intangible Effort: ${
                                    entry.intangibletime
                                    } hours`}
                                >
                                </div>
                              </div>
                            {/* </Link> */}
                          </td>
                          <td className="text-right text-justify text-nowrap col-2">
                            {entry.totaltime}{' '}{"tot"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
}

export default Leaderboard;