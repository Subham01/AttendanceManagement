import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import AllowAttendance from './AllowAttendance';

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = mm + dd + yyyy;
class Attendance extends Component {
    state = {
        class: '',
        flag: false
    };
    componentDidMount() {
        const { currentUser } = firebase.auth();
        firebase
            .database()
            .ref('users/')
            .child(currentUser.uid)
            .on('value', snap =>
                this.setState({
                    class: snap.val().stream_sem
                })
            );
    }
    display = () => {
        firebase
            .database()
            .ref('attendance/')
            .child('CSE8')
            .child(today)
            .on('value', snap =>
                this.setState({
                    flag: snap.val().flag
                })
            );
        if (true) {
            Actions.allowAttendance();
        }
        else {
            return (
                <Text>
                    Attendance Not Allowed
                 </Text>
            );
        }
    };
    render() {
        return (
            <View>
                {this.display()}
            </View>
        );
    }
}
export default Attendance;