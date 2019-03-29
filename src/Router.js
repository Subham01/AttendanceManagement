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
import AttendanceView from './components/AttendanceView';
import GenerateExcel from './components/GenerateExcel';
import AddNotice from './components/AddNotice';
import SeeNotice from './components/SeeNotice';
import Quiz from './components/Quiz';

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
                    <Scene key="allowAttendance" component={AllowAttendance} title="Attendance"/>
                    <Scene key="attendanceView" component={AttendanceView} title="Attendance Log" />
                    <Scene key="seeNotice" component={SeeNotice} title="Notice" />
                    <Scene key="quiz" component={Quiz} title="Quiz" hideNavBar={true}/>
                </Scene>
                <Scene key="teacher">
                    <Scene key="teacherProfile" component={TeacherProfile} hideNavBar={true} />
                    <Scene key="studentList" component={StudentList} title="Student List"/>
                    <Scene key="attendanceList" component={AttendanceList} title="Today's Attendance"/>
                    <Scene key="generateExcel" component={GenerateExcel} title="Excel" />
                    <Scene key="addNotice" component={AddNotice} title="Notice" />
                </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;