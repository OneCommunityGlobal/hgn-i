import React from "react";
import Joi from "@hapi/joi";
import _ from "lodash";

class AddUserLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.modal = false;
    this.state.data = {
      Name: "",
      Link: ""
    };
    this.state.errors = {};

    this.initialState = _.cloneDeep(this.state);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  schema = {
    linkName: Joi.string()
      .trim()
      .required(),
    linkURL: Joi.string()
      .trim()
      .uri()
      .required()
  };

  onCancel = () => {
    this.resetForm();
    this.toggle();
  };

  doSubmit() {
    this.props.onSubmit(this.props.collection, this.state.data, "create");
    this.toggle();
    this.resetForm();
  }

  render() {
    const { label } = this.props;

    return (
      <div>
        {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addLinksModal">
          Add New{' '}{label}{' '}Link
        </button> */}

        <div className="modal fade" id="addLinksModal" tabIndex="-1" role="dialog" aria-labelledby="addLinksModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addLinksModalLabel">New{' '}{label}{' '}Link</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                  <div className="modal-body">
                    {this.renderInput({
                      name: "linkName",
                      label: "Link Name:",
                      className: "col-md-12",
                      type: "text",
                      value: this.state.data.linkName
                    })}
                    {this.renderInput({
                      name: "userLinkUrl",
                      label: "URL:",
                      className: "col-md-12",
                      type: "text",
                      value: this.state.data.userLinkURL
                    })}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function renderUserLinks({ data: links, canEdit, label, handleUserLinks, collection }) {
  return (
    <div className="card border-secondary w-100">
      <div className="card-body">
        <h4 className="card-title">{label}{' '}Links</h4>
        <h6 className="card-subtitle mb-2 text-muted">
          {(links && 0 === links.length) ? `No ${label} link defined` : ""}
        </h6>
        {links && (
          <div className="card-text">
            {links.map((link, index) => (
              <div className="form-group row" key={link.linkName + link.linkURL}>
                <label htmlFor="" className="label col-2">
                  {link.linkName}
                </label>
                {/* <a
                  href={link.userLinkURL}
                  className="col-8"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-toggle="tooltip"
                  data-placement="bottom"
                > */}
                  <input
                    type="text"
                    className="form-control col-6"
                    value={link.userLinkURL}
                    readOnly
                  />
                {/* </a> */}
                {canEdit && (
                  <span
                    className="fa fa-trash pull-right col-1 label"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Remove this link"
                    onClick={() =>
                      handleUserLinks(collection, link, "delete", index)
                    }
                  />
                )}
              </div>
            ))}
            <button type="button" className="btn btn-link" data-toggle="modal" data-target="#addLinksModal">
              Add New{' '}{label}{' '}Link
            </button>

            <AddUserLink
              label={label}
              onSubmit={handleUserLinks}
              collection={collection}
            />
          </div>
        )}
      </div>
    </div>
  );
};
