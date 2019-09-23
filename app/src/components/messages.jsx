import React from "react";

import { appContext } from "../config/app-context";
import { LoadingGraphic } from "../common/loading-graphic";
import Form from "../common/form";
import Library from "../libraries/library";

import MessageService from "../services/message-service";
import MessageSchema from "../schemas/message-schema";

class Messages extends React.Component {
  static contextType = appContext;

  constructor(props) {
    super(props);

    this.state = {
      messageId: props.parm,
      requestorId: null,
      isAdmin: null,

      dataFound: false,
      isLoading: true,
      refresh: true,

      inboxData: [],
      inboxMap: [],
      outboxData: [],
      outboxMap: [],
      errors: {},
      currentMessage: {},
      action: "render",
      minMessageText: "2",
      maxMessageText: "20",
      newMessage: {
        subject: "",
        message: "",
        senderId: "5cf0ce5cdff6541c9c127f99",
        receiverId: "5cf0ce5cdff6541c9c127f99",
        eventType: "",
        isRead: false,
      },

      formControl: {
        isWritable: false,
        elements: {
          _id: {
            isVisible: false
          },
          subject: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: true,
          },
          message: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: true,
          },
          senderId: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: false
          },
          receiverId: {
            validateWhileTyping: false,
            canEdit: true,
            isVisible: true
          },
          isRead: {
            canEdit: false,
            isVisible: true,
          },
          submit: {
            canEdit: true,
            isVisible: true
          }
        },
      }

    }

    this.setCurrentMessage = this.setCurrentMessage.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.deleteMessageById = this.deleteMessageById.bind(this);
    this.updateMessageById = this.updateMessageById.bind(this);

  };

  setCurrentMessage(e) {
    var currentMessage = null;
    var action = e.currentTarget.dataset.action;
    if (action === 'create') {
      currentMessage = this.state.newMessage;
    } else {
      currentMessage = this.state.inboxMap.get(e.currentTarget.dataset.messageid);
    }
    this.setState({
      currentMessage: currentMessage,
      action: action,
      errors: {},
    });
  }

  doSubmit = async (data) => {
    var response = {};

    let action = this.state.action;
    if (action === 'create') {
      response = await this.createMessage(data)
        .catch((err) => {
          console.log(err);
        });
    } else {
      response = await this.updateMessageById(data)
        .catch((err) => {
          console.log(err);
        });
    }

    if (response.success) {
      let errors = {};
      errors['form'] = action === 'edit' ? "Message Updated" : 'Message Created';
      //TODO there is a problem if you set datafound and isloading: the screen is frozen as if the modal is open
      this.setState({
        refresh: true,
        // dataFound: false,
        // isLoading: true,
        errors: errors,
      });

      return;
    }

    //If there was an error in add/updating message, check errCode to handle.
    //TODO fix switch to reflect all valid errors when creating/updating message
    const errors = {};
    response.errCode = response.errCode ? response.errCode : 100;

    switch (response.errCode) {
      case 100:
        errors['form'] = action === 'edit' ? "Message Update Failed" : 'Message Create Failed';
        this.setState({ errors: errors });
        break;
      case 103:
        errors['form'] = "This Message Name Already Exists";
        this.setState({ errors: errors });
        break;
      default:
        break;
    }

    return;
  };

  async createMessage(data) {
    let requestorId = this.context.userProfile._id;
    let response = await MessageService.createMessage(requestorId, data);

    return response;
  }

  async updateMessageById(data) {
    let requestorId = this.context.userProfile._id;
    let messageId = data._id;
    const newData = {};
    //Only pass fields that can be updated
    newData.isActive = data.isActive;

    let response = await MessageService.updateMessageById(requestorId, messageId, newData);

    return response;
  }

  async deleteMessageById(e) {
    let requestorId = this.state.requestorId;
    let messageId = e.currentTarget.dataset.messageid;
    let response = await MessageService.deleteMessageById(requestorId, messageId);

    if (!response.success) {
      //do something if delete failed?
    } else {
      this.setState({
        refresh: true,
        dataFound: false,
        isLoading: true,
      })
    }
  }

  async componentDidMount() {
    //This forces  the componentDidUpdate routine to fire after mounting which populates the data
    this.setState({ refresh: true });
  }

  async componentDidUpdate() {
    //*Warning*: Be careful not to setState here without a condition or it will go into an endless loop
    //and be sure to set the condition to false when done

    if (this.state.refresh) {
      const requestorId = this.context.userProfile._id;
      const receiverId = requestorId;

      let response = await MessageService.getMessagesByReceiverId(requestorId, receiverId);

      if (!response.success) {
        this.setState({ refresh: false, dataFound: false, isLoading: false });
      } else {
        this.setState({
          refresh: false,
          dataFound: true,
          isLoading: false,
          inboxData: response.data,
          inboxMap: Library.mapArrayOfObjects(response.data, "_id"),
          requestorId: this.context.userProfile._id,
          isAdmin: this.context.userProfile.isAdmin,
          currentMessage: this.state.newMessage,
        });
      }
    }

  }

  render() {
    const { inboxData, outboxData, isLoading } = this.state;
    const action = this.state.action;

    if (!this.state.dataFound && !this.state.isLoading) {
      return (
        <div className="card hgn_messages bg-dark">
          <div className="card-body text-white">
            <h5 className="card-title">Messages</h5>
            <div>Unable to Get Messages - Try Refreshing</div>
          </div>
        </div>
      );
    } else {
      return (
        <main className="col-12">
          {isLoading &&
            <div><LoadingGraphic /></div>
          }

          {!isLoading && (
            <React.Fragment>
              <div className="col-12">
                <h2>Messages
                  <button className="btn btn-success pull-right"
                    onClick={(e) => { this.setCurrentMessage(e); }}
                    data-action='create'
                    data-toggle="modal"
                    data-target="#messageModal">New Message
                  </button>
                </h2>

                <div className="col-12">
                  <div className="card border-primary mb-3">
                    <div className="card-header">
                      <h4 className="card-title ">
                        <a className="accordion-toggle" href="#inbox" data-toggle="collapse" data-target="#inbox">Inbox</a>
                      </h4>
                    </div>
                    <div className="card-block" id="outbox">
                      <div className="list-group">
                        <table className="table table-striped" id="inboxtable">
                          <thead>
                            <tr>
                              <th scope="col">Subject</th>
                              <th scope="col">Read</th>
                              <th scope="col">From</th>
                              <th scope="col">Date Created</th>
                              <th scope="col">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/*foreach message */}
                            {inboxData.map(entry => {
                              return (
                                <tr className="submitted"
                                  id={entry._id}
                                  key={entry._id}
                                >
                                  <td>
                                    <input
                                      className="form-control w-100 h-100"
                                      data-messageid={entry._id}
                                      onClick={(e) => { this.setCurrentMessage(e); }}
                                      data-action="edit"
                                      data-toggle="modal"
                                      data-target="#messageModal"
                                      value={entry.subject}
                                      readOnly
                                    />
                                  </td>

                                  <td className="">
                                    {entry.isRead
                                      ? <span className="fa fa-check-circle"></span>
                                      : <span className="fa fa-circle-thin"></span>
                                    }
                                  </td>
                                  <td className="">
                                    {entry.senderFirstName + " " + entry.senderLastName}
                                  </td>
                                  <td className="">
                                    {entry.createdDate}
                                  </td>
                                  <td>
                                    <i className="fa fa-trash"
                                      onClick={() => { this.deleteMessageById(entry.messageId); }}
                                    >
                                    </i>
                                  </td>
                                </tr>
                              );

                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border-primary mb-3">
                    <div className="card-header">
                      <h4 className="card-title ">
                        <a className="accordion-toggle" href="#outbox" data-toggle="collapse" data-target="#outbox">Outbox</a>
                      </h4>
                    </div>
                    <div className="card-block" id="messages">
                      <div className="list-group">
                        <table className="table table-striped" id="outboxtable">
                          <thead>
                            <tr>
                              <th scope="col">Subject</th>
                              <th scope="col">Read</th>
                              <th scope="col">From</th>
                              <th scope="col">Date Created</th>
                              <th scope="col">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {outboxData.map(entry => {
                              return (
                                <tr className="submitted"
                                  id={entry._id}
                                  key={entry._id}
                                >
                                  <td>
                                    <input
                                      className="form-control w-100 h-100"
                                      data-messageid={entry._id}
                                      onClick={(e) => { this.setCurrentMessage(e); }}
                                      data-action="display"
                                      data-toggle="modal"
                                      data-target="#messageModal"
                                      value={entry.subject}
                                      readOnly
                                    />
                                  </td>
                                  <td className="">
                                    {entry.isRead
                                      ? <span className="fa fa-check-circle"></span>
                                      : <span className="fa fa-circle-thin"></span>
                                    }
                                  </td>
                                  <td className="">
                                    {entry.senderFirstName + " " + entry.senderLastName}
                                  </td>
                                  <td className="">
                                    {entry.createdDate}
                                  </td>
                                  <td>
                                    <i className="fa fa-trash"
                                      onClick={() => { this.deleteMessageById(entry.messageId); }}
                                    >
                                    </i>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Message Modal */}
              <div className="modal fade hide" id="messageModal" tabIndex="-1" role="dialog"
                aria-labelledby="#messageModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="messageModal">
                        {action.charAt(0).toUpperCase() + action.slice(1) + " "} Message
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    {(this.state.action === 'create' || this.state.action === 'edit') &&
                      <Form
                        data={action === 'create' ? this.state.newMessage : this.state.currentMessage}
                        formControl={this.state.formControl}
                        onSubmit={this.doSubmit}
                        schema={MessageSchema}
                        className="col-md-12 xs-12"
                      >
                        <div className="modal-body">
                          <input name="_id" isVisible={false}></input>
                          <input
                            name="subject"
                            label="Subject:"
                            type="text"
                            className="col-md-8"
                            canEdit={action === 'edit' ? false : true}
                          />
                          <textarea
                            name="message"
                            label="Message:"
                            className="col-md-8"
                            canEdit={action === 'edit' ? false : true}
                          />
                          <input
                            name="senderId"
                            label="Sender:"
                            className="col-md-8"
                            canEdit={action === 'edit' ? false : true}
                          />
                          <checkbox
                            type="checkbox"
                            name="isRead"
                            label="Is Read:"
                            className="col-md-8"
                            checked="isRead"
                            canEdit={action === 'edit' ? false : true}
                          />
                        </div>
                        <div className="modal-body">
                          <div><button name="submit" type="submit" label="Save Changes" canEdit={true}></button></div>
                          {this.state.errors.form && <div className="alert alert-danger mt-1">{this.state.errors.form}</div>}
                        </div>
                      </Form>
                    }
                  </div>
                </div>
              </div>

              {this.state.errors.page && <div className="alert alert-danger mt-1">{this.state.errors.page}</div>}

            </React.Fragment>
          )}

        </main>
      );
    }
  }
}

export default Messages;
