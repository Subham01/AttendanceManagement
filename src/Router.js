import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Login from './components/Login';
import NewUserDetail from './components/NewUserDetail';
import setPicture from './components/setPicture';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Attendance from './components/Attendance';

const RouterComponent = () => {
    return(
        <Router>
            <Scene key="root" hideNavBar={true}>
            <Scene key="auth">
                <Scene key="login" component={Login} hideNavBar={true} initial/>
                <Scene key="signUp" component={SignUp} title="Step 1"/>
                <Scene key="newUser" component={NewUserDetail} title="Step 2"/>
                <Scene key="setpicture" component={setPicture} title="Step 3"/>
                <Scene key="profile" component={Profile} hideNavBar={true} />
                <Scene key="attendance" component={Attendance} />
            </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;