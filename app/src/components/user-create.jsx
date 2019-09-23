import React from "react";

import { appContext } from "../config/app-context";
import UserForm from "./user-form";

class UserCreate extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      errors: {},

      formControl: {
        isWritable: true,
        elements: {
        }
      }

    };
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  render() {
    // const userProfile = this.context.userProfile;
    // const targetUserId = this.props.parm;
    // const requestorId = userProfile._id;
    // const isAdmin = userProfile.isAdmin;
    // const isSelf = targetUserId === requestorId;
    // const canEdit = isAdmin || isSelf;

    return (
      <UserForm
        formControl={this.state.formControl}
      />
    );
  }
}

export default UserCreate;
