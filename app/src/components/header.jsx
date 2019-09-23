//The following eslint line is to keep from getting warnings about href="#"
/* eslint-disable */
import React from "react";
import Link from '../common/link';
import { appContext } from "../config/app-context";

class Header extends React.Component {
  static contextType = appContext;

  state = {
  };

  componentDidMount() {
  }

  render() {
    const userId = this.context.userProfile._id;
    const firstName = this.context.userProfile.firstName;
    const profilePic = this.context.userProfile.profilePic;
    const isAdmin = this.context.userProfile.isAdmin;

    //TODO make sure all items in the header line up tops or bottoms so it looks good. 
    return (
      <div className="header-navbar">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top hgn-navbar">
          <Link className="navbar-brand" href="/">Time Tracking Tool</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">

              <li className="nav-item navbar-text active">
                <Link className="nav-link" href="/dashboard">Dashboard<span className="sr-only">(current)</span></Link>
              </li>

              <li className="nav-item navbar-text active">
                <Link className="nav-link" href="/timesheets">Timesheets<span className="sr-only">(current)</span></Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Other
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link className="nav-link" href={"/projects"}>Projects</Link>
                  <Link className="nav-link" href={"/tasks"}>Tasks</Link>
                  <Link className="nav-link" href={"/teams"}>Teams</Link>
                </div>
              </li>

              {isAdmin &&
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Admin
                </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="nav-link" href={"/usercreate"}>Create User</Link>
                    <Link className="nav-link" href={"/users"}>Display Users</Link>
                  </div>
                </li>
              }

              <li className="nav-item navbar-text">
                <Link href={"/messages"} className="nav-link">
                  <i className="fa fa-bell i-large">
                    <i className="badge badge-pill badge-danger badge-notify">
                      {"0"}
                    </i>
                    <span className="sr-only">Messages</span>
                  </i>
                </Link>
              </li>

              <li>
                <Link href={"/user/" + userId}>
                  <img src={profilePic} alt="" height="35" width="40"
                    className="dashboardimg rounded-circle" />
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Welcome {firstName}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <div className="dropdown-header">Hello {firstName}</div>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" href={"/user/" + userId}>Manage Profile</Link>
                  <Link className="dropdown-item" href={"/changepassword/" + userId}>Change Password</Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" href="/logout">Logout</Link>
                </div>
              </li>

            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Header;