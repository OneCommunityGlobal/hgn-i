import React from "react";

import Joi from "@hapi/joi";
import _ from "lodash";
// import Library from "../libraries/library";

import { renderImage } from "./renderers/render-image";
import { renderInput } from "./renderers/render-input";
import { renderRadio } from "./renderers/render-radio";
import { renderFileUploadButton } from "./renderers/render-file-upload-button";
import { renderTextarea } from "./renderers/render-textarea";
import { renderCheckbox, handleCheckbox } from "./renderers/render-checkbox";
import { renderButton } from "./renderers/render-button";
import { renderSelect } from "./renderers/render-select";
import { renderShowSaveWarning } from "./renderers/render-show-save-warning";
import { renderCheckboxCollection } from "./renderers/render-checkbox-collection";
import { renderUserLinks } from "./renderers/render-user-links";
import { renderMemberships } from "./renderers/render-memberships";

class Form extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      errors: {},
    }

    this.initialState = _.cloneDeep(this.state);

    this.renderImage = renderImage.bind(this);
    this.renderInput = renderInput.bind(this);
    this.renderRadio = renderRadio.bind(this);
    this.renderFileUploadButton = renderFileUploadButton.bind(this);
    this.renderTextarea = renderTextarea.bind(this);
    this.renderCheckbox = renderCheckbox.bind(this);
    this.handleCheckbox = handleCheckbox.bind(this);
    this.renderButton = renderButton.bind(this);
    this.renderSelect = renderSelect.bind(this);
    this.renderShowSaveWarning = renderShowSaveWarning.bind(this);
    this.renderCheckboxCollection = renderCheckboxCollection.bind(this);
    this.renderUserLinks = renderUserLinks.bind(this);
    this.renderMemberships = renderMemberships.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
 }

  componentDidMount() {
    this.setState({errors: {}});
  }

  componentDidUpdate() {
    if(!_.isEqual(this.state.data, this.props.data)) {
      this.setState({
        data: this.props.data,
        errors: {},
      })
    }
 }

  resetForm = () => this.setState(_.cloneDeep(this.initialState));

  isStateChanged = () => !_.isEqual(this.state.data, this.initialState.data);

  /*This routine recurses thru the props.children tree and if the element
    has a render routine, it calls that routine and uses the rendered element instead.
    e.g. div has no render routine so it will be passed as is, but input does have a
    render routine so it will be re-rendered before output. */
  renderChildren = (children) => {
    var renderRoutines = {
      "input": "renderInput",
      "button": "renderButton",
      "checkbox": "renderCheckbox",
      "image": "renderImage",
      "radio": "renderRadio",
      "select": "renderSelect",
      "textarea": "renderTextarea",
      "fileuploadbutton": "renderFileUploadButton",
    };

    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      if (child.props.children) {
        child = React.cloneElement(child, {
          children: this.renderChildren(child.props.children)
        });
      }

      let renderRoutine = (child.type in renderRoutines)
        ? renderRoutines[child.type]
        : null;
      if (!renderRoutine) {
        return child;
      }

      let renderedElement = this[renderRoutine](child.props);
      return renderedElement;
    });
  }

  handleChange = (e) => {
    const ct = e.currentTarget;
    const name = ct.name;
    const value = ct.value;
    const { errors, data } = this.state;
    const formElements = (typeof this.props.formControl.elements !== "undefined") ? this.props.formControl.elements : {};
    data[name] = value;

    if (typeof formElements[name] !== "undefined" && formElements[name].validateWhileTyping) {
      const errorMessage = this.validateProperty(name, value);
      if (errorMessage) {
        errors[name] = errorMessage;
      } else {
        delete errors[name];
      }
    }
    this.setState({ data, errors });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let errors = this.validateForm();
    if (errors) {
      this.setState({ errors: errors });
      return;
    }

    this.setState({ errors: {}});
    await this.props.onSubmit(this.state.data);

    return;

  };

  validateProperty = (name, value) => {
    const obj = { [name]: value };
    const schema = { [name]: this.props.schema[name] };
    const refs = schema[name]._refs;
    if (refs) {
      refs.forEach(ref => {
        schema[ref] = this.schema[ref];
        obj[ref] = this.state.data[ref];
      });
    }
    const { error } = Joi.validate(obj, schema);
    if (!error) return null;
    return error.details[0].message;
  };

  validateForm = () => {
    if (!this.state.data) return null;
    const errors = {};
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.props.schema, options);
    if (!error) return null;
    error.details.forEach(element => {
      errors[element.path[0]] = element.message;
    });

    return errors;
  };

  render() {
    return (
      <form className={this.props.className}>
        {this.renderChildren(this.props.children)}
      </form>
    );
  }

}

export default Form;
