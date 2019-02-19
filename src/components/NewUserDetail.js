import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    StatusBar,
    Dimensions,
    TextInput,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Constants, ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../Images/logo.png';

const { width: WIDTH } = Dimensions.get('window');
console.disableYellowBox = true;

const url =
  'https://firebasestorage.googleapis.com/v0/b/blobtest-36ff6.appspot.com/o/Obsidian.jar?alt=media&token=93154b97-8bd9-46e3-a51f-67be47a4628a';

 export default class NewUserDetail extends Component {
    state = {
        name: '',
        uroll: '',
        error: '',
        image: null,
        uploading: false,
    };
    updateDatabase() {
        const { name, uroll, image } = this.state;
        const { currentUser } = firebase.auth();
        firebase.database().ref(`/users/${currentUser.uid}`)
        .set({ name, uroll, image })
        .then(() => Actions.profile())
        .catch(this.onLoginFail.bind(this));
    }
    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
    }
    onLoginFail() {
        this.setState({ error: 'Authentication Failed'});
    }
    renderSignUpButton() {
        if(this.state.loading){
            return(
                <ActivityIndicator size="small" />
            );
        }
        else{
            return (
                <TouchableOpacity style={styles.btnLogin}
                    onPress={this.updateDatabase.bind(this)}>
                   <Text style={styles.text}>Sign up</Text>     
                </TouchableOpacity>
            );
        }
    }
     render() {
        let { image } = this.state;
         return(
             <View style={styles.backgroundContainer}>
                <View style={StyleSheet.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.logoText}>Welcome User</Text>
                </View>
                <View>
                    <Icon name="ios-person" size={28} 
                        style={styles.inputIcon}/>
                    <TextInput
                        value={this.state.name}
                        onChangeText={name => this.setState({ name })}
                        style={styles.userInput}
                        placeholder={'Name'}
                        />
                </View>
                <View>
                    <Icon name="ios-key" size={28} 
                        style={styles.inputIcon}/>
                    <TextInput
                        value={this.state.uroll}
                        onChangeText={uroll => this.setState({ uroll })}
                        style={styles.userInput}
                        placeholder={'University Roll No.'}
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
                    {this._maybeRenderUploadingOverlay()}
                    <StatusBar barStyle="default" />
                    <Text style={styles.errorTextStyle}>
                        {this.state.error}
                    </Text>
                    {this.renderSignUpButton()}
                </View>
            </View>
         );
     }
    renderButtons() {
        return(
            <View>
            <Button
                onPress={this._pickImage}
                title="Pick an image from camera roll"
            />

            <Button onPress={this._takePhoto} title="Take a photo" />
            </View>
        );
    }
    _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
        return (
        <View
            style={[
            StyleSheet.absoluteFill,
            {
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
            },
            ]}>
            <ActivityIndicator color="#fff" animating size="large" />
        </View>
        );
    }
    };
    _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
        return;
    }

    return (
        <View
        style={{
            marginTop: 30,
            width: 250,
            borderRadius: 3,
            elevation: 2,
        }}>
        <View
            style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
            }}>
            <Image source={{ uri: image }} style={{ width: 90, height: 90 }} />
        </View>

        <Text
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
            Image Upload Succesful
        </Text>
        </View>
    );
    };

    _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
    };

    _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
    try {
        this.setState({ uploading: true });

        if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
        }
    } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
    } finally {
        this.setState({ uploading: false });
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
  const snapshot = await ref.put( );

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}
 const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        justifyContent: 'center',
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
    userInput: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
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