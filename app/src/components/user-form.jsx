import React from "react";
import _ from "lodash";

import { appContext } from "../config/app-context";
import UserService from "../services/user-service";
import Form from "../common/form";

import userSchema from "../schemas/user-schema";
// import teamSchema from "../schemas/team-schema";
// import projectSchema from "../schemas/project-schema";

class UserForm extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      errors: {},
    };

    this.initialState = _.cloneDeep(this.state);

    this.doSubmit = this.doSubmit.bind(this);

  }

  componentDidMount() {
    this.setState({data: this.context.userProfile});
  }

  componentDidUpdate() {

  }

  schema = userSchema;

  activeOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" }
  ];

  allowedRoles = [
    { _id: "Administrator", name: "Administrator" },
    { _id: "Core Team", name: "Core Team" },
    { _id: "Manager", name: "Manager" },
    { _id: "Volunteer", name: "Volunteer" }
  ];

  handleCollection = (collection, item, action, index = null) => {
    const data = this.state.data[collection] || [];
    switch (action) {
      case "create":
        data.push(item);
        break;
      case "edit":
        data[index] = item;
        break;
      case "delete":
        data.splice(index, 1);
        break;
      default:
        break;
    }
    this.handleState(collection, data);
  };

  updateCollection = (collection, value) => {
    let data = this.state.data[collection] || [];
    data = value;
    this.handleState(collection, data);
  };

  // handleViolation = (item, action, index = null) => {
  //   this.handleCollection("violations", item, action, index);
  // };

  handleMemberships = (collection, value) => {
    this.updateCollection(collection, value);
  };

  doSubmit = async () => {

    const requestorId = null;

    //TODO Determine if this is an addUser or updateUser
    const response = await UserService.updateUser(requestorId, this.state)
      .catch((err) => {
        console.log(err);
      });

    if (response.success) {
      const context = this.context;
      context.setContext({ "isLoggedIn": true, "userProfile": response.data, "currURL": "Dashboard" });
      return;
    }

    //If there was an error in add/updating user, check errCode to handle.
    //TODO fix switch to reflect all valid errors when creating/updating user
    const errors = {};

    switch (response.errCode) {
      case 1:
        errors.password = "Unable to Lookup User. Please Try Again";
        this.setState({ errors: errors });
        break;
      case 101:
        errors.password = "This Email/Password is Not Valid";
        this.setState({ errors: errors });
        break;
      case 201:
        errors.password = "The Server Is Not Responding. Please Try Again";
        this.setState({ errors: errors });
        break;

      default:
        break;
    }

    return;
  };

  render() {

    // const userProfile = this.state.data;
    // const { firstName, lastName, profilePic, email, weeklyComittedHours, adminLinks,
    //   personalLinks, teams, // projects, violations,  
    // } = { ...userProfile };

    const canEdit = this.props.canEdit;

    return (
      <React.Fragment>
        <div className="">

          <Form 
            onSubmit={e => this.handleSubmit(e)}
            formControl={this.props.formControl}
            data={this.state.data}
          >

            {/* <userLinks
              label="Admin"
              onSubmit={this.handleCollection}
              collection={adminLinks}
              data={adminLinks}
              label="Admin"
              handleUserLinks={this.handleCollection}
              collection="adminLinks"
            /> */}

            <div className="row my-auto">
              <div className="col-md-4">

                <div className="form-row text-center">
                  <image
                    name="profilePic"
                    label=""
                    className="profilepic"
                    type="image"
                  />
                  <fileuploadbutton
                    name="profilePic"
                    accept="image/png,image/jpeg, image/jpg"
                    maxSizeinKB={50000}
                    className="newProfilePic"
                    readAsType="data"
                    canEdit={canEdit ? true : false}
                  />
                </div>

                {/* <div className="form-row text-center">
                  {canEdit &&
                    !!targetUserId &&
                    violations.map((item, index) => (
                      <RenderViolation
                        key={`${item.date}_${item.description}`}
                        violation={item}
                        isUserAdmin={isUserAdmin}
                        handleViolation={this.handleViolation}
                        index={index}
                        schema={this.violationsSchema}
                      />
                    ))}
                  {canEdit &&
                    !!targetUserId &&
                    _.times(5 - violations.length, () => (
                      <RenderViolation
                        key={violationslength++}
                        violation={{ date: "", description: "" }}
                        isUserAdmin={isUserAdmin}
                        handleViolation={this.handleViolation}
                        schema={this.violationsSchema}
                      />
                    ))}
                </div> */}

              </div>
              <div className="col-md-8">
                <div className="form-row">
                  <input
                    name="firstName"
                    label="First Name:"
                    className="col-md-4"
                    canEdit={canEdit ? true : false}
                  />
                  <input
                    name="lastName"
                    label="Last Name:"
                    className="col-md-4"
                    canEdit={canEdit ? true : false}
                  />
                  <radio
                    name="isActive"
                    options={this.activeOptions}
                    canEdit={canEdit ? true : false}
                  />
                </div>

                <div className="form-row">
                  <input
                    name="email"
                    label="Email:"
                    className="col-md-4"
                    canEdit={canEdit ? true : false}
                  />
                  <select
                    name="role"
                    label="Role:"
                    className="col-md-4"
                    options={this.allowedRoles}
                    canEdit={canEdit ? true : false}
                  />
                  <input
                    name="weeklyComittedHours"
                    label="Weekly Comitted Hours:"
                    className="col-md-4"
                    canEdit={canEdit ? true : false}
                    type="number"
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <textarea
                label="Bio:"
                name="bio"
                className="w-100"
                canEdit={canEdit ? true : false}
              />
            </div>

            <div className="row mt-3">
              {/* <UserLinks
                data={adminLinks}
                label="Admin"
                handleUserLinks={this.handleCollection}
                collection="adminLinks"
                canEdit={canEdit ? true : false}
              /> */}
            </div>
            <div className="row mt-3">
              {/* <UserLinks
                data={personalLinks}
                label="Social/Professional"
                handleUserLinks={this.handleCollection}
                collection="personalLinks"
                canEdit={canEdit ? true : false}
              /> */}
            </div>

            <div className="row mt-3">

              {/* <div className="col-6">
                <Memberships
                  schema={this.teamSchema}
                  canEdit={canEdit ? true : false}
                  data={teams}
                  label="Team"
                  collection="teams"
                  handleDelete={this.handleCollection}
                  handleBulkUpdates={this.handleMemberships}
                />
              </div> */}

              {/* <div className="col-6">
                <Memberships
                  schema={this.projectSchema}
                  canEdit={isUserAdmin}
                  data={projects}
                  label="Project"
                  collection="projects"
                  handleDelete={this.handleCollection}
                  handleBulkUpdates={this.handleMemberships}
                />
              </div> */}

            </div>

            {/* <button
              type="submit"
            /> */}

          </Form>

        </div>
      </React.Fragment>
    );
  }
}

export default UserForm;
