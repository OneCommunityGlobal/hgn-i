import React from "react";

import { appContext } from "../config/app-context";
import UserForm from "./user-form";

class User extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      errors: {},

      formControl: {
        isWritable: false,
        elements: {
          firstName: {
            validateWhileTyping: false,
            canEdit: true,
          },
          lastName: {
            validateWhileTyping: false,
            canEdit: true,
          },
          email: {
            validateWhileTyping: false,
            canEdit: false,
          },
          weeklyComittedHours: {
            validateWhileTyping: false,
            canEdit: true,
          },
          profilePic: {
            canEdit: true,
          },
          isActive: {
            canEdit: false,
          },
          role: {
            canEdit: true,
          },
          bio: {
            validateWhileTyping: false,
            canEdit: true,
          },
          linkName: {
            validateWhileTyping: false,
            canEdit: true,
          },
          linkURL: {
            validateWhileTyping: false,
            canEdit: true,
          },
        },
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

export default User;