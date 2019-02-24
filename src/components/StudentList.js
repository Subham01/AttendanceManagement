import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    Image
} from 'react-native';
import * as firebase from 'firebase';
import Loader from './Loader';

export default class StudentList extends Component {
    state = {
        class: '',
        students: [],
        loading: true
    };
    componentWillMount() {
        const { currentUser } = firebase.auth();
        firebase.database().ref('teacher').child(currentUser.uid)
            .once('value', snap =>
                this.setState({
                    class: snap.val().stream_sem,
                    loading: false
                })
            );
    }
    display = () => {
        let studentList = [];
        const student = firebase.database().ref('users');
        student.orderByChild('stream_sem').equalTo(this.state.class)
            .once("value")
            .then(snapshot => {
                const list = Object.values(snapshot.val());
                for(i=0; i< list.length;i++){
                    const fname = list[i].firstname;
                    const lname = list[i].lastname;
                    const newObj = {
                        key: i.toString(),
                        name: fname.concat(' ').concat(lname),
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
            </ScrollView >
        );
    }
}