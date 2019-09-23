import React from "react";
// import Joi from "@hapi/joi";
import Form from "../common/form";
import UserService from "../services/user-service";
import loginSchema from "../schemas/login-schema";

import { appContext } from "../config/app-context";

class Login extends React.Component {
  static contextType = appContext;

  state = {
    data: { email: "", password: "" },
    errors: {},

    formControl: {
      isWritable: true,
      elements: {
        email: { validateWhileTyping: false, canEdit: true, isVisible: true },
        password: { validateWhileTyping: false, canEdit: true, isVisible: true },
        submit: { canEdit: true, isVisible: true }
      },
    }
  };

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  doSubmit = async (data) => {
    const email = data.email;
    const password = data.password;

    const response = await UserService.login({ email, password })
      .catch((err) => {
        console.log(err);
        return err;
      });

    if (response.success) {
      const context = this.context;
      context.setContext({ "isLoggedIn": true, "userProfile": response.data, "currURL": "Dashboard" });
      return;
    }

    //There was an error in logging in. Check errCode to handle.
    //Errcode 101 = bad email and/or password
    const errors = {};

    const errCode = response.errCode ? response.errCode : 1;
    switch (errCode) {
      case 1:
        errors.password = "Unable to Lookup User. Please Try Again";
        this.setState({ errors: errors });
        break;
      case 101:
        errors.page = "This Email/Password is Not Valid";
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
    return (
      <div className="mt-5">
        <h2>Please Sign in</h2>

        <Form
            data={this.state.data}
            errors={this.state.errors}
            formControl={this.state.formControl}
            schema={loginSchema}
            className="col-md-6 xs-12"
            onSubmit={this.doSubmit}
        >

          <input name="email" label="Email:" type="text" canEdit={true} />
          <input name="password" label="Password:" type="password" canEdit={true} />
          <button name="submit" type="submit" label="Submit" canEdit={true}></button>
        </Form>

        {this.state.errors.page && <div className="alert alert-danger mt-1">{this.state.errors.page}</div>}

      </div>

    );
  }
}

export default Login;
