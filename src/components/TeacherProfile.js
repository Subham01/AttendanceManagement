import React, { Component } from 'react';
import { 
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');

class TeacherProfile extends Component{
    state = {
        firstname: '',
        lastname: '',
        contact: '',
        teacherId: '',
        semester: '',
        loading: true,
        stream: '',
    };
    componentWillMount() {
        const { currentUser } = firebase.auth();
        firebase
         .database()
         .ref('teacher')
         .child(currentUser.uid)
         .once('value', snap => 
            this.setState({
                teacherId: snap.val().teacherId,
                firstname: snap.val().firstname,
                lastname: snap.val().lastname,
                contact: snap.val().contact,
                semester: snap.val().semester,
                stream: snap.val().stream,
                loading: false
            })
         );
    }
    signOut() {
        firebase.auth().signOut();
        Actions.auth();
        Actions.login();
    }
    render(){
        const { firstname, lastname, contact, teacherId, semester, stream } = this.state;
        return(
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
                <TouchableOpacity style={styles.btnLogin}
                   onPress={() => Actions.studentList()}>
                   <Text style={styles.text}>Student List</Text>     
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.signOut.bind(this)}>
                   <Text style={styles.text}>Sign Out</Text>     
                </TouchableOpacity>
            </View>
        );
    }
}
styles= {
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
};
export default TeacherProfile;