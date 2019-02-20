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

const api_url = 'http://106.51.58.118:5000/compare_faces?face_det=1';
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
    upload = async (requestUrl, data) => {
    let options = {
        headers: {
        'Content-Type': 'multipart/form-data',
        'user_id': 'e5b0be890da6cf78a09b',
        'user_key': 'aa93ecaf267451c1119e',
        },
        method: 'POST'
    };
    
    options.body = new FormData();
    for (let key in data) {
        options.body.append(key, data[key]);
    }
    
    return fetch(requestUrl, options)
        .then(response => {
        return response.json()
        .then(responseJson => {
            //You put some checks here
            return responseJson;
        });
    });
}
    submitAttendance = async () => {
        const { image, face } = this.state;
        this.upload(api_url,{
            'img_1': {
                name: 'img_1',
                type: 'image/jpg',
                uri: image
            },
            'img_2': {
                name: 'img_2',
                type: 'image/jpg',
                uri: face
            }
        }).then(r => {
            console.log(r);
        });
        // const data = {
        //     'img_1': face,
        //     'img_2': image
        // }
        // data.append('img_1', {
        //     name: 'img_1',
        //     type: 'image/jpg',
        //     uri: image
        // });
        // data.append('img_2', {
        //     name: 'img_2',
        //     type: 'image/jpg',
        //     uri: face
        // });
        // const data = new FormData()
        // data.append('img_1', {
        //     uri: image,
        //     type: 'image/jpg',
        //     name: 'img_1.jpg'
        // });
        // data.append('img_2', {
        //     uri: face,
        //     type: 'image/jpg',
        //     name: 'img_2.jpg'
        // });
        // RNFetchBlob.fetch('POST', api_url, {
        //     Authorization : "Bearer access-token",
        //     otherHeader : "foo",
        //     'Content-Type' : 'multipart/form-data',
        //     'user_id': 'e5b0be890da6cf78a09b',
        //     'user_key': 'aa93ecaf267451c1119e',
        // }, [
        // // element with property `filename` will be transformed into `file` in form data
        // { name : 'img_1', filename : image, type:'image/png', data: binaryDataInBase64},
        // // custom content type
        // { name : 'img_2', filename : face, type:'image/png', data: binaryDataInBase64},
        // // part file from storage
        // ]).then((resp) => {
        //     console.log('Data Stored');
        // }).catch((err) => {
        //     console.log('Error Occoured');
        // })
        // const api_body = {
        //     'img_1': image,
        //     'img_2': face,
        // };
        // try{
        //     let response = await fetch(api_url, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //             //'Accept': 'application/json',multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
        //             'user_id': 'e5b0be890da6cf78a09b',
        //             'user_key': 'aa93ecaf267451c1119e',
        //         },
        //         body: data//JSON.stringify(data)
        //     });
        //     console.log(data);
        //     console.log(response);
        //     responseJson = await response.json();
        //     console.log(responseJson);
        // } catch (error) {
        //     alert(error);
        // }
        // var http = require('http');

        // var options = {
        //     'method': 'POST',
        //     'hostname': '106.51.58.118',
        //     'path': '/compare_faces?face_det=1',
        //     'headers': {
        //         'Content-Type': 'multipart/form-data;boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        //         'user_id': 'e5b0be890da6cf78a09b',
        //         'user_key': 'aa93ecaf267451c1119e'
        //     }
        // };

        // var req = fetch (options, function (res) {
        // var chunks = [];

        // res.on("data", function (chunk) {
        //     chunks.push(chunk);
        // });

        // res.on("end", function (chunk) {
        //     var body = Buffer.concat(chunks);
        //     console.log(body.toString());
        // });

        // res.on("error", function (error) {
        //     console.error('error');
        // });
        // });

        // var postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"img_1\"\r\n\r\n${image}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"img_2\"\r\n\r\n${face}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

        // //req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

        // req.write(postData);

        // req.end();
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