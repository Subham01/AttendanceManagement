import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';

const { width: WIDTH } = Dimensions.get('window');
export default class AttendanceList extends Component {
    state = {
        stream_sem: ''
    };
    componentWillMount() {
        const { currentUser } = firebase.auth();
        firebase
            .database()
            .ref('teacher')
            .child(currentUser.uid)
            .once('value', snap =>
                this.setState({
                    stream_sem: snap.val().stream_sem,
                })
            );
    }
    stopAttendance() {
        const { stream_sem } = this.state;
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
        const flag = false;
        today = mm + dd + yyyy;
        firebase.database().ref(`/attendance/${stream_sem}/${today}`)
        .set({ flag })
    }
    render() {
        return (
            <View>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.stopAttendance.bind(this)}>
                    <Text style={styles.text}>Stop Attendance</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
styles = {
    btnLogin: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#432577',
        marginTop: 20
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
}