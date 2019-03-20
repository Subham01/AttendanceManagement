import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');

class TeacherProfile extends Component {
    state = {
        ifexists: false,
        firstname: '',
        lastname: '',
        contact: '',
        teacherId: '',
        semester: '',
        loading: true,
        stream: '',
        stream_sem: ''
    };
    componentDidMount() {
        try {
            const { currentUser } = firebase.auth();
            console.log("Obj =>  ", currentUser.uid);
            firebase
                .database()
                .ref('teacher/')
                .child(currentUser.uid)
                .once('value', snap =>
                    this.setState({
                        teacherId: snap.val().teacherId,
                        firstname: snap.val().firstname,
                        lastname: snap.val().lastname,
                        contact: snap.val().contact,
                        semester: snap.val().semester,
                        stream: snap.val().stream,
                        stream_sem: snap.val().stream_sem,
                        loading: false,
                    })
                );
        } catch (e) {
            this.setState({ loading: false });
            alert('OOPs. Try Again!');
            Actions.auth();
            Actions.login();
        }
    }
    startAttendance() {
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
        const flag = true;
        today = mm + dd + yyyy;
        firebase.database().ref(`/attendance/${stream_sem}`)
            .once("value")
            .then(snap => {
                const todayExist = snap.child(today).exists();
                if (todayExist == false) {
                    firebase.database().ref(`/attendance/${stream_sem}/${today}`)
                        .set({ flag })
                        .then(() => Actions.attendanceList());
                }
                else {
                    Actions.attendanceList();
                }
            });
        // const dbRef = firebase.database().ref(`/attendance/${stream_sem}/${today}`);
        // dbRef.once("value")
        //     .then(snap => {
        //         this.setState({ ifexists: snap.child("flag").exists() }, () => {
        //             console.log("If Exist = "+this.state.ifexists);
        //             if (this.setState.ifexists) {
        //                 firebase.database().ref(`/attendance/${stream_sem}/${today}`)
        //                     .set({ flag })
        //                     .then(() => Actions.attendanceList());
        //             }
        //             else {
        //                 Actions.attendanceList();
        //             }
        //         })
        //     })
    }
    signOut() {
        firebase.auth().signOut();
        Actions.auth();
        Actions.login();
    }
    render() {
        const { firstname, lastname, contact, teacherId, semester, stream } = this.state;
        return (
            <ScrollView>
                <View style={styles.backgroundContainer}>
                    <Loader loading={this.state.loading} />
                    <View style={styles.displayContent}>
                        <Text style={styles.titleContent}>
                            Name :
                    </Text>
                        <Text style={styles.valueContent}>
                            {firstname.concat(' ').concat(lastname)}
                        </Text>
                    </View>
                    <View style={styles.displayContent}>
                        <Text style={styles.titleContent}>
                            Employee No. :
                    </Text>
                        <Text style={styles.valueContent}>
                            {teacherId}
                        </Text>
                    </View>
                    <View style={styles.displayContent}>
                        <Text style={styles.titleContent}>
                            Contact :
                    </Text>
                        <Text style={styles.valueContent}>
                            {contact}
                        </Text>
                    </View>
                    <View style={styles.displayContent}>
                        <Text style={styles.titleContent}>
                            Department :
                    </Text>
                        <Text style={styles.valueContent}>
                            {stream}
                        </Text>
                    </View>
                    <View style={styles.displayContent}>
                        <Text style={styles.titleContent}>
                            Semester :
                    </Text>
                        <Text style={styles.valueContent}>
                            {semester}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={() => Actions.studentList()}>
                            <Text style={styles.text}>Student List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={this.startAttendance.bind(this)}>
                            <Text style={styles.text}>Start Attendance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={() => Actions.generateExcel({class: this.state.stream_sem})}>
                            <Text style={styles.text}>Excel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={() => Actions.addNotice({class: this.state.stream_sem})}>
                            <Text style={styles.text}>Send Notice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={this.signOut.bind(this)}>
                            <Text style={styles.text}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
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
    backgroundContainer: {
        flex: 1,
        paddingTop: 40,
        alignItems: 'center'
    },
    logoText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.5,
        alignItems: 'center'
    },
    displayContent: {
        paddingLeft: 16,
        paddingBottom: 16,
        flexDirection: 'row',
    },
    titleContent: {
        color: 'black',
        flex: 1,
        fontSize: 20,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
        alignItems: 'center'
    },
    valueContent: {
        color: 'black',
        flex: 1,
        fontSize: 15,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
        alignItems: 'center'
    }
});
export default TeacherProfile;