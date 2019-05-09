import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    Button,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import Loader from './Loader';

const { height } = Dimensions.get('window');
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

export default class StudentList extends Component {
    state = {
        class: '',
        students: [],
        loading: true,
        present: [],
        presentCount: 0
    };
    componentDidMount = () => {
        let studentList = [];
        const student = firebase.database().ref('users');
        student.orderByChild('stream_sem').equalTo(this.props.class)
            .once("value")
            .then(snapshot => {
                const list = Object.values(snapshot.val());
                const list_id = Object.keys(snapshot.val());
                for (i = 0; i < list.length; i++) {
                    const fname = list[i].firstname;
                    const lname = list[i].lastname;
                    const newObj = {
                        key: i.toString(),
                        name: fname.concat(' ').concat(lname),
                        userId: list_id[i],
                        image: list[i].image,
                        contact: list[i].contact,
                        roll: list[i].uroll
                    }
                    studentList = [...studentList, newObj]
                }
                studentList.sort((a, b) => Number(a.roll) - Number(b.roll));
                this.setState({ students: studentList },() => {
                    const { students, present } = this.state;
                    this.setState({ present: new Array(students.length) },()=> { this.setState({present: this.state.present.fill(-1), loading: false }) });
                });
            });
    };
    addPresent = (index) => {
        const { present } = this.state;
        const isPresent = present[index];
        if (isPresent === -1) {
            present[index] = 1;
            this.setState({
                present: this.state.present,
                presentCount: this.state.presentCount + 1
            })
        } else {
            present[index] = -1;
            this.setState({
                present: this.state.present,
                presentCount: this.state.presentCount - 1
            })
        }
        console.log("present "+ present);
    };
    renderList = () => {
        const onPresent = <View style={styles.present}><Text style={styles.text}>P</Text></View>
        const onAbsent = <View style={styles.absent}><Text style={styles.text}>A</Text></View>
        const list = this.state.students.map((student, index) => {
            return (
                <TouchableOpacity key={student.key} onPress={() => this.addPresent(index)}>
                    <View style={styles.backgroundContainer}>
                        <View>
                            <Image source={{ uri: student.image }} style={styles.imageStyle} />
                        </View>
                        <View style={{ width: '70%', paddingLeft: 10, justifyContent: 'space-between' }}>
                            <Text style={styles.nameStyle}>
                                Roll: {student.roll}
                            </Text>
                            <Text style={styles.nameStyle}>
                                Name: {student.name}
                            </Text>
                        </View>
                        <View style={{ width: '20%' }}>
                            {(this.state.present[index] !== -1) ? onPresent : onAbsent}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
        return (
            <View>
                {list}
                {/* <FlatList
                    data={this.state.students}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity key={item.key} onPress={() => this.addPresent(index)}>
                            <View style={styles.backgroundContainer}>
                                <View>
                                    <Image source={{ uri: item.image }} style={styles.imageStyle} />
                                </View>
                                <View style={{ width: '70%', paddingLeft: 10, justifyContent: 'space-between' }}>
                                    <Text style={styles.nameStyle}>
                                        Roll: {item.roll}
                                    </Text>
                                    <Text style={styles.nameStyle}>
                                        Name: {item.name}
                                    </Text>
                                </View>
                                <View style={{ width: '20%' }}>
                                    {(this.state.present[index] !== -1) ? onPresent : onAbsent}
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                /> */}
            </View>
        );
    }
    submitAttendance = () => {
        const { students, present } = this.state;
        async function uploadImageAsync(uri) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
            const ref = firebase
                    .storage()
                    .ref(students[i].userId)
                    .child(students[i].userId.substring(1, 4));
            const snapshot = await ref.put(blob);
            blob.close();
        }
        for (i = 0; i < present.length; i++) {
            if(present[i] !== -1) {
                uploadImageAsync(students[i].image);
                firebase
                    .database()
                    .ref('attendance/')
                    .child(this.props.class)
                    .child(today)
                    .push({
                        userId: students[i].userId,
                        image: students[i].image,
                        name: students[i].name
                    });
            }
        }
        alert('Attendance Marked!');
        Actions.attendanceList();
    }
    render() {
        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Loader loading={this.state.loading} />
                <ScrollView style={{ height: height - 40 }}>
                    {this.renderList()}
                </ScrollView >
                <View style={{ justifyContent: 'space-around', flexDirection: 'row', height: 40 }}>
                    <TouchableOpacity onPress={()=>this.submitAttendance()} style={styles.submit}><Text style={styles.text}>Submit</Text></TouchableOpacity>
                    <View><Text style={{ fontSize: 22, fontWeight: '200', height: 30, color: 'green' }}>Present: {this.state.presentCount}</Text></View>
                    <View><Text style={{ fontSize: 22, fontWeight: '200', height: 30, color: 'red' }}>Absent: {this.state.students.length - this.state.presentCount}</Text></View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    backgroundContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    imageStyle: {
        height: 60,
        width: 60,
        paddingLeft: '20%',
    },
    nameStyle: {
        color: 'black',
        fontSize: 18,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
    },
    submit: {
        width: '30%',
        height: 35,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: 'blue',
        marginTop: 2
    },
    present: {
        width: '100%',
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#9acd32',
        marginTop: 5
    },
    absent: {
        width: '100%',
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#ff0000',
        marginTop: 5
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
});