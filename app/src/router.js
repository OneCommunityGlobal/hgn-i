import React from 'react';
import browserHistory from './common/browser-history';

//TODO this whole thing can be improved and made more elegant

//TODO use lazy loading so only loaded when needed
import Dashboard from './components/dashboard';
import Login from './components/login';
import ChangePassword from './components/change-password';

import Messages from './components/messages';
import Projects from './components/projects';
import Tasks from './components/tasks';
import Teams from './components/teams';
import Timesheets from './components/timesheets';
import Users from './components/users';

import User from './components/user';
import UserCreate from './components/user-create';

function Router({ location, isAdmin }) {
    const components = {
        dashboard: Dashboard,
        login: Login,
        changepassword: ChangePassword,

        messages: Messages,
        projects: Projects,
        tasks: Tasks,
        teams: Teams,
        timesheets: Timesheets,
        users: Users,

        user: User,
        usercreate: UserCreate
    };

    //TODO check if path is an admin task or requires admin and ensure user isAdmin

    var component;
    var pathComponent;
    var pathParm;

    var pathSegmentsArr = location.pathname.split('/');
    pathComponent = pathSegmentsArr[1];
    pathParm = pathSegmentsArr[2];

    if (pathComponent === 'logout') {
        location.pathname = "/";
        browserHistory.push(location);
        component = 'login';
    } else if (location.pathname === '/' || pathComponent === 'home' || pathComponent === 'dashboard') {
        component = 'dashboard';
    } else {
        component = pathComponent;
    }

    const Component = components[component];

    return (
        <Component parm={pathParm} />
    );
}

export default Router;