import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Dimensions,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

console.disableYellowBox = true;
const { width: WIDTH } = Dimensions.get('window');

const url =
  'https://firebasestorage.googleapis.com/v0/b/blobtest-36ff6.appspot.com/o/Obsidian.jar?alt=media&token=93154b97-8bd9-46e3-a51f-67be47a4628a';

export default class setPicture extends React.Component {
  state = {
    image: null,
    uploading: false,
  };
  updateDatabase() {
    const { image } = this.state;
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}`)
    .set({ image })
    .then(() => Actions.profile())
    .catch(console.log('error'));
  }
  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }
  
  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {image ? null : (
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              textAlign: 'center',
              marginHorizontal: 15,
            }}>
            Upload uploadImage
          </Text>
        )}

        {this.renderButtons()}

        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
        <StatusBar barStyle="default" />
        <TouchableOpacity style={styles.btnLogin}
          onPress={this.updateDatabase.bind(this)}>
          <Text style={styles.text}>Sign up</Text>     
      </TouchableOpacity>
      </View>
    );
  }
  renderButtons() {
    if( this.state.image != null ) {
      return(
        <TouchableOpacity style={styles.btnLogin}
          onPress={() => Actions.profile()}>
            <Text style={styles.text}>Profile</Text>     
        </TouchableOpacity>
      );
    }
    else {
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
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
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
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
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
  }
};