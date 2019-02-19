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
import { Constants, ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
const api = 'http://106.51.58.118:5000/compare_faces?face_det=1';
class Attendance extends Component {
    state = {
        image: null,
        face: null
    };
    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA);
        const { currentUser } = firebase.auth();
        firebase
         .database()
         .ref('users/')
         .child(currentUser.uid)
         .on('value', snap => 
            this.setState({ 
                face: snap.val().image
            })
         );
    }
    submitAttendance = async () => {
        const { image, face } = this.state;
        // return(
        //     <View>
        //         <Text>
        //             {image}
        //         </Text>
        //         <text>
        //             {face}
        //         </text>
        //     </View>
        // );
        try{
            fetch('http://106.51.58.118:5000/compare_faces?face_det=1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'user_id': 'e5b0be890da6cf78a09b',
                'user_key': 'aa93ecaf267451c1119e',
            },
            body: JSON.stringify({
                img_1: image,
                img_2: face,
            })
            })
            .then(response => {alert(response.json()); })
                .then((responseData) => {
                alert(responseData);
            }).catch((error) => {
            alert('error!');
            })
            .done();
        } catch(error){
            alert(error);
        };
    }
    render(){
        return(
            <View style={styles.Conatiner}>
                {this.state.image ? null : (
                <Text style={styles.textContainer}>
                    Take Image
                </Text>
                )}
    
                {this.renderButtons()}
                {this._maybeRenderImage()}
                <StatusBar barStyle="default" />
                <Button onPress={this.submitAttendance.bind(this)} title="Submit Attendance" />
            </View>
        );
    }
    renderButtons() {
        return(
            <View>
                <Button onPress={this._takePhoto} title="Take a photo" />
            </View>
        );
    }
    _maybeRenderImage = () => {
        let { image, face } = this.state;
        if (!image) {
            return;
        }

        return (
            <View>
                <Image source={{uri: image}} style={{width:90, height: 90}} />
            </View>
        );
    };
    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [6, 6],
        });
        this._handleImagePicked(pickerResult);
    }
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
    .child(currentUser.uid.substring(1, 4));
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
}
const styles = {
    Conatiner: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        marginHorizontal: 15,
    }
};

export default Attendance;