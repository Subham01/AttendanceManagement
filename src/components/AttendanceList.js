import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';

const { height, width: WIDTH } = Dimensions.get('window');
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
        students: [],
        flag: true,
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
        this.setState({ flag: flag });
        firebase.database().ref(`/attendance/${stream_sem}/${today}`)
            .update({ flag: flag })
    }
    startAttendance() {
        const { stream_sem } = this.state;
        const flag = true;
        this.setState({ flag: flag });
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
                        image: list[i].image,
                    }
                    studentList = [...studentList, newObj]
                }
                this.setState({ students: studentList });
            });
    }
    renderButton = () => {
        if (this.state.flag) {
            return (
                <View>
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={this.stopAttendance.bind(this)}>
                        <Text style={styles.text}>Stop Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={() => Actions.manualAttendance({class: this.state.stream_sem})}>
                        <Text style={styles.text}>Manual Attendance</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return (
                <View>
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={this.startAttendance.bind(this)}>
                        <Text style={styles.text}>Start Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={() => Actions.manualAttendance({class: this.state.stream_sem})}>
                        <Text style={styles.text}>Manual Attendance</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
    render() {
        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <View style={{height: 120}}>
                    {this.renderButton()}
                </View>
                <ScrollView style={{height: height-200, width: WIDTH}}>
                    {this.display()}
                    {
                        this.state.students.map(student => {
                            return (
                                <View key={student.key} style={styles.backgroundContainer}>
                                    <View>
                                        <Image source={{ uri: student.image }} style={styles.imageStyle} />
                                    </View>
                                    <View style={{ paddingLeft: 10 }}>
                                        <Text style={styles.nameStyle}>
                                            {student.name}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
styles = {
    backgroundContainer: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    imageStyle: {
        height: 70,
        width: 70,
        borderRadius: 35,
        paddingLeft: '20%',
    },
    nameStyle: {
        color: 'black',
        fontSize: 18,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
    },
    DetailStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
    },
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