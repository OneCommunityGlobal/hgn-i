import React from "react";
import _ from "lodash";
import Link from '../link';

class ManageMemberships extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.allEntities = [];
    this.state.isLoading = true;
    this.toggle = this.toggle.bind(this);
    this.state.modal = false;
    this.schema = props.schema;
    this.state.data = this.props.data;
    this.state.errors = {};

    this.initialState = _.cloneDeep(this.state);
  }

  getDerivedStateFromProps(props) {
    this.setState({data: props.data});
    this.initialState = _.cloneDeep(this.state);
  }

  loadData = async () => {
    this.toggle();
    // const { data: allEntities } =
    //   this.props.collection === "teams"
    //     ? await getAllTeams()
    //     : await getAllProjects();
    // const isLoading = false;
    // this.setState({ allEntities, isLoading });
  };

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  onCancel = () => {
    this.resetForm();
    this.toggle();
  };

  doSubmit = () => {
    this.toggle();
    this.props.onSubmit(this.props.collection, this.state.data);
    return (this.initialState = _.cloneDeep(this.state));
  };

  getName = element => element[this.pathName()];

  getCheckedStatus = id =>
    this.state.data.some(membership => membership._id === id) ? true : null;

  pathName = () =>
    this.props.collection === "teams" ? "teamName" : "projectName";

  handleChange = e => {
    const { allEntities, data } = this.state;
    if (e.target.checked) {
      // item was selected so add it to the memberships
      const newMembership =
        allEntities[_.findIndex(allEntities, o => o._id === e.target.id)];
      data.push(_.pick(newMembership, _.keys(this.schema)));
    } else {
      const index = _.findIndex(data, o => o._id === e.target.id);
      _.pullAt(data, [index]);
    }
    this.setState({ data });
  };

  render() {
    const { allEntities } = this.state;
    const { label } = this.props;
    return (
      <React.Fragment>
        <div className="btn btn-success" onClick={this.loadData}>
          {`Manage ${_.startCase(label)}s`}
        </div>

        <div class="modal" isOpen={this.state.modal} toggle={this.toggle}>
          <div class="modal-header" toggle={this.toggle}>
            {`${_.startCase(label)}s`}
          </div>
          <form>
            <div class="modal-body">
              {this.isStateChanged() && <div>{this.renderShowSaveWarning()}</div>}
              {this.renderCheckboxCollection({
                items: allEntities,
                pathName: this.pathName(),
                isChecked: this.getCheckedStatus,
                onChange: this.handleChange
              })}
            </div>
            <div class="modal-footer">
              <button color="primary" onClick={e => this.doSubmit(e)}>
                Done
              </button>
              <button color="secondary" onClick={this.onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export function renderMemberships({ collection, label, data, canEdit, handleDelete, handleBulkUpdates, schema }) {
  const getLink = id => `/${_.lowerCase(label)}/${id}`;
  const getText = element =>
    _.has(element, "teamName") ? element.teamName : element.projectName;

  return (
    <div className="card background-primary w-100">

      <div className="card-body">
        <h4 className="card-title">{_.startCase(label)}{' '}Memberships</h4>
        <p className="card-text">{data.length > 0 ? "" : `No memberships`}</p>
        <ul className="list-group list-group-flush">
          {data.map((element, index) => (
            <li className="list-group-item" key={element._id}>
              <Link href={getLink(element._id)}>{getText(element)}</Link>
              {canEdit && (
                <span
                  className="fa fa-trash pull-right"
                  onClick={() =>
                    handleDelete(collection, element, "delete", index)
                  }
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card-footer">
        {canEdit && (
          <ManageMemberships
            loadData
            schema={schema}
            label={label}
            onSubmit={handleBulkUpdates}
            data={data}
            collection={collection}
          />
        )}
      </div>
    </div>
  );
};
