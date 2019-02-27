import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet
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
                        image: list[i].image,
                        contact: list[i].contact,
                        roll: list[i].uroll
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
                            <View key={student.key} style={styles.backgroundContainer}>
                                <View>
                                    <Image source={{uri: student.image}} style={styles.imageStyle} />
                                </View>
                                <View style={{paddingLeft: 10}}>
                                    <Text style={styles.nameStyle}>
                                        {student.name}
                                    </Text>
                                    <Text style={styles.RollStyle}>
                                        {student.roll}
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
const styles = StyleSheet.create({
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
    RollStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: '200',
        marginTop: 10,
        opacity: 0.5,
    },

});