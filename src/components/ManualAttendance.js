import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import * as firebase from 'firebase';
import Loader from './Loader';
const { width: WIDTH } = Dimensions.get('window');
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
        pickedDate: '',
        studentList: [],
        today: '',
        class: '',
        students: [],
        loading: true,
        present: [],
        presentCount: 0,
        contentFetched: false,
        dateKey: [],
        entryFound: false,
        dateAttendace: [],
    };
    componentDidMount = () => {
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
        today = dd + '-' + mm + '-' + yyyy;
        let studentList = [];
        let list = [], list_id = [];
        const student = firebase.database().ref('users');
        student.orderByChild('stream_sem').equalTo(this.props.class)
            .once("value")
            .then(snapshot => {
                list = Object.values(snapshot.val());
                list_id = Object.keys(snapshot.val());
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
                this.setState({ students: studentList, studentList: studentList }, () => {
                    const { students, present } = this.state;
                    this.setState({ present: new Array(students.length) }, () => {
                        this.setState({ present: this.state.present.fill(-1) }, () => {
                            let key = [], value = [];
                            firebase.database().ref(`attendance/${this.props.class}`)
                                .once("value")
                                .then(snapshot => {
                                    key = Object.keys(snapshot.val());
                                    value = Object.values(Object.values(snapshot.val()));
                                    this.setState({
                                        dateKey: key,
                                        dateAttendace: value,
                                        loading: false
                                    },() => this.setState({ pickedDate: today, today },() => this.handleDateChange()))
                                })
                        })
                    });
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
    };
    handleDateChange = () => {
        const { students, pickedDate, dateKey, studentList, dateAttendace } = this.state;
        let dd = pickedDate.substring(0, 2);
        let mm = pickedDate.substring(3, 5);
        let yy = pickedDate.substring(6, 10);
        const date = mm + dd + yy;
        let flag = 0, pos;
        if (this.state.contentFetched == true) {
            this.setState({ contentFetched: false});
        }
        for (i = 0; i < dateKey.length; i++) {
            if (dateKey[i] == date) {
                flag = 1;
                pos = i;
                break;
            }
        }
        if (flag == 0) {
            console.log("Date "+ date + "Not found");
            if (this.state.contentFetched == false) {
                this.setState({ contentFetched: true, students: this.state.studentList, entryFound: false });
            }
        } else {
            console.log("Date found");
            let newStudentList = [];
            for (j = 0; j < studentList.length; j++) {
                flag = 0;
                const list = Object.values(dateAttendace[pos]);
                for (i = 0; i < list.length - 1; i++) {
                    if (studentList[j].userId == list[i].userId) {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    newStudentList = [...newStudentList, studentList[j]];
                }
            }
            if (this.state.contentFetched == false) {
                console.log(newStudentList);
                this.setState({ students: newStudentList, contentFetched: true, entryFound: true });
            }
        }
    }
    renderList = () => {
        if (this.state.loading == false) {
            const onPresent = <View style={styles.present}><Text style={styles.text}>P</Text></View>
            const onAbsent = <View style={styles.absent}><Text style={styles.text}>A</Text></View>
            if (this.state.contentFetched) {
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
                    </View>
                );
            } else {
                return (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 22, fontWeight: '200', height: 30 }}>
                            Fetching Data...
                    </Text>
                    </View>
                );
            }
        }
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
        const { pickedDate } = this.state;
        let dd = pickedDate.substring(0, 2);
        let mm = pickedDate.substring(3, 5);
        let yy = pickedDate.substring(6, 10);
        const date = mm + dd + yy;
        if(this.state.entryFound == false) {
            firebase.database().ref(`/attendance/${this.props.class}/${date}`)
                .set({ flag: true })
        }
        for (i = 0; i < present.length; i++) {
            if (present[i] !== -1) {
                uploadImageAsync(students[i].image);
                firebase
                    .database()
                    .ref('attendance/')
                    .child(this.props.class)
                    .child(date)
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
                <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 22, fontWeight: '200', height: 30 }}>Pick Date: </Text>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.pickedDate}
                            mode="date"
                            placeholder="Start Date"
                            format="DD-MM-YYYY"
                            minDate="01-01-2019"
                            maxDate={this.state.today}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => { this.setState({ pickedDate: date, contentFetched: false }, () => this.handleDateChange()) }}
                        />
                    </View>
                    <View>
                        <Text style={{ fontSize: 22, fontWeight: '200', height: 30, color: 'green' }}>
                            Date: {this.state.pickedDate}
                        </Text>
                    </View>
                </View>
                <ScrollView style={{ height: height - 40 }}>
                    {this.renderList()}
                </ScrollView >
                <View style={{ justifyContent: 'space-around', flexDirection: 'row', height: 40 }}>
                    <TouchableOpacity onPress={() => this.submitAttendance()} style={styles.submit}><Text style={styles.text}>Submit</Text></TouchableOpacity>
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
    datesubmit: {
        height: 35,
        justifyContent: 'center',
        backgroundColor: 'blue',
        marginTop: 2
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
    buttontnLogin: {
        width: WIDTH / 2.5,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#432577',
        marginTop: 20
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