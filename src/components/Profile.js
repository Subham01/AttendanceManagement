import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');

class Profile extends Component {
    state = {
        email: '',
        firstname: '',
        lastname: '',
        contact: '',
        uroll: '',
        semester: '',
        loading: true,
        stream: '',
        class: '',
        image: '',
    };
    async componentDidMount() {
        const { currentUser } = await firebase.auth();
        firebase
            .database()
            .ref('users/')
            .child(currentUser.uid)
            .once('value', snap =>
                this.setState({
                    email: currentUser.email,
                    uroll: snap.val().uroll,
                    firstname: snap.val().firstname,
                    image: snap.val().image,
                    lastname: snap.val().lastname,
                    contact: snap.val().contact,
                    semester: snap.val().semester,
                    stream: snap.val().stream,
                    class: snap.val().stream_sem,
                    loading: false
                })
            );
    }
    signOut() {
        firebase.auth().signOut();
        Actions.auth();
        Actions.login();
    }
    render() {
        const { firstname, lastname, email, contact, uroll, semester, stream } = this.state;
        return (
            <View style={styles.backgroundContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ borderBottomWidth: 1, width: WIDTH, alignItems: 'center' }}>
                    <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={{ uri: this.state.image }} />
                    <Text style={styles.displayContent}>
                        {firstname.concat(' ').concat(lastname)}
                    </Text>
                    <Text style={styles.valueContent}>
                        {email}
                    </Text>
                    <Text style={styles.valueContent}>
                        {uroll}
                    </Text>
                </View>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => Actions.allowAttendance({ class: this.state.class })}>
                    <Text style={styles.text}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => Actions.attendanceView({ class: this.state.class })}>
                    <Text style={styles.text}>Attendance Log</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => Actions.seeNotice({ class: this.state.class })}>
                    <Text style={styles.text}>Notice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.signOut.bind(this)}>
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
            </View >
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
        fontSize: 20,
        fontWeight: '200',
        paddingTop: 5,
    },
    valueContent: {
        color: 'black',
        fontSize: 15,
        fontWeight: '200',
        opacity: 0.5,
        paddingBottom: 10,
    },
});
export default Profile;