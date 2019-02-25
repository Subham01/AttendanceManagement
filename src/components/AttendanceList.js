import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    Button,
    TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';

const { width: WIDTH } = Dimensions.get('window');
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
export default class AttendanceList extends Component {
    state = {
        firstname: '',
        lastname: '',
        stream_sem: '',
        name: '',
        students: []
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
            this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    }
    forceUpdateHandler() {
        this.forceUpdate();
      };
    stopAttendance() {
        const { stream_sem } = this.state;
        const flag = false;
        firebase.database().ref(`/attendance/${stream_sem}/${today}`)
            .update({ flag: flag })
    }
    display = () => {
        const { stream_sem } = this.state;
        let studentList = [];
        firebase.database().ref(`/attendance/${stream_sem}/${today}`)
            .once("value")
             .then(snapshot => {
                const list = Object.values(snapshot.val());
                for (i = 0; i < (list.length - 1); i++) {
                    const newObj = {
                        key: i.toString(),
                        name: list[i].name,
                        image: list[i].image
                    }
                    studentList = [...studentList, newObj]
                }
                this.setState({ students: studentList });
            });
    }
    render() {
        return (
            <ScrollView>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.stopAttendance.bind(this)}>
                    <Text style={styles.text}>Stop Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.forceUpdateHandler}>
                    <Text style={styles.text}>Refresh</Text>
                </TouchableOpacity>
                {this.display()}
                {
                    this.state.students.map(student => {
                        return(
                            <View key={student.key} style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View>
                                    <Image source={{uri: student.image}} style={{height: 90, width: 90}} />
                                </View>
                                <View>
                                    <Text>
                                        {student.name}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                }
            </ScrollView>
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