import React, { Component } from "react";
import { appContext } from "../config/app-context";
import Leaderboard from "./leaderboard";
// import MonthlyEffort from "./monthly-effort";

class Dashboard extends Component {
  static contextType = appContext;

  state = {
  };

  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div className="row">
            <div className="col-sm-7">
              <Leaderboard userProfile={this.context.userProfile} />
            </div>
          </div>
          <div className="card-deck mb-3">
            <div className="col-md-8">
              <div className="card text-center mb-3 w-33 h-100 hgn-badges prescrollable ember-view"><div className="card-body">
                <h5 className="card-title">Badges</h5>
                <div className="card-text">
                  <div>
                    <span className="image-body">
                    </span>
                    <span className="image-body">
                    </span>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="card text-center mb-3 w-33 h-100 hgn-monthlyeffortchart prescrollable ember-view"><div className="card-body">
                  <h5 className="card-title">Hours Worked this month</h5>
                  <div className="mh-100 mw-100">
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </React.Fragment>
    );


    // return (
    //   <React.Fragment>
    //     <div>
    //       <Row>
    //         <Col sm={{ offset: 1, size: 7 }}>
    //           {/* <Leaderboard userProfile={this.context.userProfile} /> */}
    //         </Col>
    //         <Col sm={{ size: 3 }}>
    //           <Card body inverse color="info">
    //             <CardTitle>
    //               <MonthlyEffort />
    //             </CardTitle>
    //             <CardText>

    //             </CardText>
    //           </Card>
    //         </Col>
    //       </Row>
    //       <Row style={{ marginTop: "20px" }}>
    //         <Col sm={{ offset: 1, size: 7 }}>
    //           <Card body inverse color="warning">
    //             <CardTitle>Badges</CardTitle>
    //           </Card>
    //         </Col>
    //       </Row>
    //     </div>
    //   </React.Fragment>
    // );
  }
}

export default Dashboard;