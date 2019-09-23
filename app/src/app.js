import React from 'react';

import browserHistory from './common/browser-history';
import Router from './router';

import { appContext } from "./config/app-context";
// import config from "./config/config.json";

import Login from "./components/login";
import Header from "./components/header";

class App extends React.Component {
  constructor(props) {
    super(props);

    //TODO need to persist state across browser reloads
    this.state = {
      // "isLoggedIn": false,
      location: browserHistory.location,
      setContext: this.setContext,
    }

    this.setContext = this.setContext.bind(this);
  }

  //TODO make this more flexible and elegant
  //setState is async so not sure this is working all the time?
  //isLoggedIn needs to be updated before re-rendering and seems to be working
  //may need to call a callback to ensure it's actually updated or use forceUpdate?
  setContext = (values) => {
    // this.setState({isLoggedIn: false});
    this.setState((state, props) => {
      return values;
    }
    );

  }

  componentDidMount() {
    document.title = "Highest Good Network";

    this.unsubscribe = browserHistory.listen(location => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    //this is related to the router:
    this.unsubscribe();
  }


  render() {

    if (this.state.location.pathname === "/logout") {
      this.setState({ isLoggedIn: false })
      return (
        <appContext.Provider value={this.state}>
          <div className="container mt-5">
            <Router location={this.state.location} />
          </div>
        </appContext.Provider>
      )
    } else if (!this.state.isLoggedIn) {
      return (
        <appContext.Provider value={this.state}>
          <div className="container mt-5">
            <Login />
          </div>
        </appContext.Provider>
      )
    } else {
      return (
        <appContext.Provider value={this.state}>
          <div className="container mt-5">
            <Header />
            <Router location={this.state.location} isAdmin={this.state.userProfile.isAdmin} />
          </div>
        </appContext.Provider>
      )
    }
  }
}

export default App;
