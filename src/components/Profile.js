import React, { Component } from 'react';
import { 
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

const { width: WIDTH } = Dimensions.get('window');

class Profile extends Component{
    state = {
        name: '',
        uroll: '',
        image: ''
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
                name: snap.val().name,
                image: snap.val().image
            })
         );
    }
    signOut() {
        firebase.auth().signOut();
        Actions.login();
    }
    render(){
        return(
            <View style={styles.backgroundContainer}>
               <Text>
                   {this.state.name}
               </Text>
               <Text>
                   {this.state.uroll}
               </Text>
               <View>
               <Image style={{height:90, width: 90}}source={{uri: this.state.image}} />
               </View>
               <TouchableOpacity style={styles.btnLogin}
                   onPress={() => Actions.attendance()}>
                   <Text style={styles.text}>Attendance</Text>     
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
        justifyContent: 'center',
        alignItems: 'center'
     },
};
export default Profile;