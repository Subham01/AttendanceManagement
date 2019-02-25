import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import Loader from './Loader';
import successgif from '../Images/success.gif';
import { Actions } from 'react-native-router-flux';

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
today = mm + dd + yyyy;
const api_url = 'http://106.51.58.118:5000/compare_faces?face_det=1';
const { width: WIDTH } = Dimensions.get('window');

class AllowAttendance extends Component {
    state = {
        userId: '',
        firstname: '',
        lastname: '',
        image: null,
        submit: false,
        loading: false,
        setDatabase: true,
        face: null,
        confidence: 0,
        Error: false,
        class: '',
        flag: null,
    };
    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA);
        const { currentUser } = firebase.auth();
        firebase
            .database()
            .ref('users/')
            .child(currentUser.uid)
            .once('value', snap =>
                this.setState({
                    face: snap.val().image,
                    userId: currentUser.uid,
                    firstname: snap.val().firstname,
                    lastname: snap.val().lastname
                })
            );
        firebase
            .database()
            .ref('attendance/')
            .child(this.props.class)
            .child(today)
            .on('value', snap =>
                this.setState({
                    flag: snap.val().flag,
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
                        return responseJson;
                    });
            });
    }
    submitAttendance = async () => {
        const { image, face } = this.state;
        this.setState({ loading: true });
        this.upload(api_url, {
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
            this.setState({ submit: true, loading: false, confidence: r.confidence });
        });
    }
    render() {
        return (
            <View style={styles.Conatiner}>
                <Loader loading={this.state.loading} />
                {this.renderContent()}
            </View>
        );
    }
    renderContent() {
        if (this.state.Error == false) {
            if (this.state.flag == false) {
                return (
                    <Text>
                        Attendance Not Allowed
                    </Text>
                );
            }
            else {
                if (this.state.submit == false) {
                    return (
                        <View>
                            {this.renderButtons()}
                            {this._maybeRenderImage()}
                            {this.submitButtons()}
                        </View>
                    );
                }
                else {
                    return (
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <Image source={successgif} style={styles.logo} />
                            {this.identified()}
                        </View>
                    );
                }
            }
        }
        else {
            return (
                <Text>
                    Teacher Not Started Attendance
                </Text>
            );
        }
    }
    identified() {
        if (this.state.confidence > 0.70) {
            const { firstname, lastname } = this.state;
            if (this.state.setDatabase) {
                firebase
                    .database()
                    .ref('attendance/')
                    .child(this.props.class)
                    .child(today)
                    .push({
                        userId: this.state.userId,
                        image: this.state.image,
                        name: firstname.concat(' ').concat(lastname)
                    });
                if(this.state.setDatabase) {
                    this.setState({ setDatabase: false });
                }
            }
            return (<Text>Identified! Confidence: {this.state.confidence}</Text>);
        }
        else {
            return (<Text>Couldn't recognize you</Text>);
        }
    }
    submitButtons() {
        return (
            <TouchableOpacity style={styles.btnLogin}
                onPress={this.submitAttendance.bind(this)}>
                <Text style={styles.text}>Submit Attendance</Text>
            </TouchableOpacity>
        );
    }
    renderButtons() {
        return (
            <TouchableOpacity style={styles.btnLogin}
                onPress={this._takePhoto}>
                <Text style={styles.text}>Take a photo</Text>
            </TouchableOpacity>
        );
    }
    _maybeRenderImage = () => {
        let { image, face } = this.state;
        if (!image) {
            return;
        }
        return (
            <View>
                <Image source={{ uri: image }} style={{ width: 140, height: 140, paddingLeft: 20 + 0 }} />
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
            this.setState({ loading: true });

            if (!pickerResult.cancelled) {
                uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ loading: false });
        }
    };
}
async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
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
    logo: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        marginHorizontal: 15,
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
};
export default AllowAttendance;