import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Login from './components/Login';
import NewUserDetail from './components/NewUserDetail';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Attendance from './components/Attendance';
import LoginTeacher from './components/LoginTeacher';
import TeacherProfile from './components/TeacherProfile';
import StudentList from './components/StudentList';
import AttendanceList from './components/AttendanceList';
import AllowAttendance from './components/AllowAttendance';

const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar={true}>
                <Scene key="auth">
                    <Scene key="login" component={Login} hideNavBar={true} />
                    <Scene key="signUp" component={SignUp} title="Step 1" />
                    <Scene key="newUser" component={NewUserDetail} title="Step 2" />
                    <Scene key="newTeacher" component={LoginTeacher} title="Step 2" />
                </Scene>
                <Scene key="main">
                    <Scene key="studentProfile" component={Profile} hideNavBar={true} />
                    <Scene key="attendance" component={Attendance} />
                    <Scene key="allowAttendance" component={AllowAttendance} />
                </Scene>
                <Scene key="teacher">
                    <Scene key="teacherProfile" component={TeacherProfile} hideNavBar={true} />
                    <Scene key="studentList" component={StudentList} />
                    <Scene key="attendanceList" component={AttendanceList}/>
                </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;