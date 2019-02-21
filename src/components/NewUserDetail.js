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
//import { ScrollView } from 'react-native-gesture-handler';

const { width: WIDTH } = Dimensions.get('window');
console.disableYellowBox = true;

const url =
  'https://firebasestorage.googleapis.com/v0/b/blobtest-36ff6.appspot.com/o/Obsidian.jar?alt=media&token=93154b97-8bd9-46e3-a51f-67be47a4628a';

 export default class NewUserDetail extends Component {
    state = {
        firstname: '',
        lastname: '',
        contact: '',
        uroll: '',
        semester: '1',
        stream: 'CSE',
        error: '',
        image: null,
        loading: false,
    };
    updateDatabase() {
        const { firstname, lastname, contact, uroll, semester, stream, image } = this.state;
        const { currentUser } = firebase.auth();
        firebase.database().ref(`/users/${currentUser.uid}`)
        .set({ firstname, lastname, contact, uroll, semester, stream, image })
        .then(()=>Actions.main(),() => Actions.profile())
        .catch(this.onLoginFail.bind(this));
    }
    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
    }
    onLoginFail() {
        this.setState({ 
            firstname: '',
            lastname: '',
            contact: '',
            uroll: '',
            semester: '1',
            stream: 'CSE',
            image: null,
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
                            onChangeText={uroll => this.setState({ uroll })}
                            style={styles.userInput}
                            placeholder={'University Roll No.'}
                            placeholderTextColor="#000" 
                            />
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center' }}>
                        {image ? null : (
                        <Text
                            style={{
                            fontSize: 20,
                            marginBottom: 20,
                            textAlign: 'center',
                            marginHorizontal: 15,
                            }}>
                            Upload Image
                        </Text>
                        )}

                        {this.renderButtons()}
                        {this._maybeRenderImage()}
                        
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
    renderButtons() {
        return(
            <View style={{flexDirection:"row"}}>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={this._takePhoto}>
                        <Icon name="ios-camera" size={35} 
                        style={{paddingLeft: '40%',paddingRight: '40%'}}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={this._pickImage}>
                        <Icon name="ios-image" size={35} 
                            style={{paddingLeft: '40%',paddingRight: '40%'}}/>     
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
            return;
        }
        return (
            <View style={{paddingTop: 10}}>
                <View>
                    <Image source={{ uri: image }} style={{ width: 140, height: 140 }} />
                </View>
                <Text style={{ paddingVertical: 10, paddingHorizontal: 10, color: 'green'}}>
                    Image Upload Succesful
                </Text>
            </View>
        );
    };

    _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [6, 6],
    });

    this._handleImagePicked(pickerResult);
    };

    _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [6, 6],
    });

    this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true, loading: true });
    
            if (!pickerResult.cancelled) {
            uploadUrl = await uploadImageAsync(pickerResult.uri);
            this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false, loading: false });
        }
    };
}
async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
    resolve(xhr.response);
    };
    xhr.onerror = function(e) {
    console.log(e);
    reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
    });
    const { currentUser } = firebase.auth();
    const ref = firebase
    .storage()
    .ref(currentUser.uid)
    .child(currentUser.uid);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
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