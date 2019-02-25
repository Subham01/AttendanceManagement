import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');

class Profile extends Component {
    state = {
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
    componentDidMount() {
        const { currentUser } = firebase.auth();
        firebase
            .database()
            .ref('users/')
            .child(currentUser.uid)
            .once('value', snap =>
                this.setState({
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
        const { firstname, lastname, contact, uroll, semester, stream } = this.state;
        return (
            <View style={{ flex: 1, paddingTop: 40, alignItems: 'center' }}>
                <Loader loading={this.state.loading} />
                <View>
                    <Image style={{ height: 150, width: 150, borderRadius: 75 }} source={{ uri: this.state.image }} />
                </View>
                <View style={{paddingLeft: 16,paddingBottom: 16,flexDirection: 'row'}}>
                    <Text style={{color: 'black',flex: 1,fontSize: 20,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        Name :
                    </Text>
                    <Text style={{color: 'black',flex: 1,fontSize: 15,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        {firstname.concat(' ').concat(lastname)}
                    </Text>
                </View>
                <View style={{paddingLeft: 16,paddingBottom: 16,flexDirection: 'row'}}>
                    <Text style={{color: 'black',flex: 1,fontSize: 20,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        University Roll No :
                    </Text>
                    <Text style={{color: 'black',flex: 1,fontSize: 15,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        {uroll}
                    </Text>
                </View>
                <View style={{paddingLeft: 16,paddingBottom: 16,flexDirection: 'row'}}>
                    <Text style={{color: 'black',flex: 1,fontSize: 20,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        Contact :
                    </Text>
                    <Text style={{color: 'black',flex: 1,fontSize: 15,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        {contact}
                    </Text>
                </View>
                <View style={{paddingLeft: 16,paddingBottom: 16,flexDirection: 'row'}}>
                    <Text style={{color: 'black',flex: 1,fontSize: 20,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        Department :
                    </Text>
                    <Text style={{color: 'black',flex: 1,fontSize: 15,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        {stream}
                    </Text>
                </View>
                <View style={{paddingLeft: 16,paddingBottom: 16,flexDirection: 'row'}}>
                    <Text style={{color: 'black',flex: 1,fontSize: 20,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        Semester :
                    </Text>
                    <Text style={{color: 'black',flex: 1,fontSize: 15,fontWeight: '200',marginTop: 10,opacity: 0.5,alignItems: 'center'}}>
                        {semester}
                    </Text>
                </View>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => Actions.allowAttendance({class: this.state.class})}>
                    <Text style={styles.text}>Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.signOut.bind(this)}>
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
            </View >
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
export default Profile;