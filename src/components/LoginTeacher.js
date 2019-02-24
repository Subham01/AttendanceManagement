import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Picker,
    StatusBar,
    Dimensions,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Constants, ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');
console.disableYellowBox = true;

const url =
  'https://firebasestorage.googleapis.com/v0/b/blobtest-36ff6.appspot.com/o/Obsidian.jar?alt=media&token=93154b97-8bd9-46e3-a51f-67be47a4628a';

 export default class LoginTeacher extends Component {
    state = {
        firstname: '',
        lastname: '',
        contact: '',
        teacherId: '',
        semester: '1',
        stream: 'CSE',
        error: '',
        loading: false,
    };
    updateDatabase() {
        const { firstname, lastname, contact, teacherId, semester, stream } = this.state;
        const stream_sem = stream.concat(semester);
        const { currentUser } = firebase.auth();
        firebase.database().ref(`/teacher/${currentUser.uid}`)
        .set({ firstname, lastname, contact, teacherId, semester, stream, stream_sem })
        .then(()=>Actions.teacher(),() => Actions.teacherProfile())
        .catch(this.onLoginFail.bind(this));
    }
    onLoginFail() {
        this.setState({ 
            firstname: '',
            lastname: '',
            contact: '',
            teacherId: '',
            semester: '1',
            stream: 'CSE',
            loading: false,
            error: 'Failed'
        });
    }
    renderSignUpButton() {
        return (
            <TouchableOpacity style={styles.btnLogin}
                onPress={this.updateDatabase.bind(this)}>
               <Text style={styles.text}>Sign up</Text>     
            </TouchableOpacity>
        );
    }
     render() {
        let { image } = this.state;
         return(
             <ScrollView>
                <View style={styles.backgroundContainer}>
                    <Loader loading={this.state.loading} />
                    <View style={{paddingBottom:16 }} >
                        <Icon name="ios-person" size={28} 
                            style={styles.inputIcon}/>
                        <TextInput
                            value={this.state.firstname}
                            onChangeText={firstname => this.setState({ firstname })}
                            style={styles.userInput}
                            placeholder={'First Name'}
                            placeholderTextColor="#000"
                            />
                    </View>
                    <View style={{paddingBottom:16 }}>
                        <Icon name="ios-person" size={28} 
                            style={styles.inputIcon}/>
                        <TextInput
                            value={this.state.lastname}
                            onChangeText={lastname => this.setState({ lastname })}
                            style={styles.userInput}
                            placeholder={'Last Name'}
                            placeholderTextColor="#000"
                            />
                    </View>
                    <View style={{paddingBottom:16 }}>
                        <Icon name="ios-call" size={28} 
                            style={styles.inputIcon}/>
                        <TextInput
                            value={this.state.contact}
                            onChangeText={contact => this.setState({ contact })}
                            style={styles.userInput}
                            placeholder={'Contact'}
                            placeholderTextColor="#000" 
                            />
                    </View>
                    <View style={{paddingBottom: 16}}>
                        <View style={styles.PickerContainer}>
                            <View style={{flex:1}}>
                                <Picker
                                style={{height: 50, width: 140}}
                                selectedValue={this.state.semester}
                                onValueChange={(value) => this.setState({ semester: value })}>
                                <Picker.Item label="Semester 1" value="1" />
                                <Picker.Item label="Semester 2" value="2" />
                                <Picker.Item label="Semester 3" value="3" />
                                <Picker.Item label="Semester 4" value="4" />
                                <Picker.Item label="Semester 5" value="5" />
                                <Picker.Item label="Semester 6" value="6" />
                                <Picker.Item label="Semester 7" value="7" />
                                <Picker.Item label="Semester 8" value="8" />
                                </Picker>
                            </View>
                            <View style={{flex:1}}>
                                <Picker
                                style={{height: 50, width: 120}}
                                selectedValue={this.state.stream}
                                onValueChange={(value) => this.setState({ stream: value })}>
                                <Picker.Item label="CSE" value="CSE" />
                                <Picker.Item label="ECE" value="ECE" />
                                <Picker.Item label="ME" value="ME" />
                                <Picker.Item label="EE" value="EE" />
                                <Picker.Item label="IT" value="IT" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingBottom:16 }}>
                        <Icon name="ios-book" size={28} 
                            style={styles.inputIcon}/>
                        <TextInput
                            value={this.state.uroll}
                            onChangeText={teacherId => this.setState({ teacherId })}
                            style={styles.userInput}
                            placeholder={'Employee ID'}
                            placeholderTextColor="#000" 
                            />
                    </View>
                    <View>
                        <Text style={styles.errorTextStyle}>
                            {this.state.error}
                        </Text>
                        {this.renderSignUpButton()}
                        <StatusBar barStyle="default" />
                    </View>
                </View>
             </ScrollView>
        );
    }
}
 const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        paddingTop: 30,
        alignItems: 'center'
     },
    logoContainer: {
        alignItems: 'center'
    },
    logo: {
        width: 120,
        height: 120
    },
    logoText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.5,
        alignItems: 'center'
    },
    PickerContainer: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        borderWidth: 0.5,
        fontSize: 16,
        paddingLeft: 45,
        marginHorizontal: 25,
        flexDirection: 'row'
    },
    userInput: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        borderWidth: 0.5,
        fontSize: 16,
        paddingLeft: 45,
        marginHorizontal: 25
    },
    inputIcon: {
        position: 'absolute',
        top: 8,
        left: 37
    },
    showPassword: {
        position: 'absolute',
        top: 8,
        right: 37
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
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
 });