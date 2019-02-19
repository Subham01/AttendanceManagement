import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    ImageBackground,
    Dimensions,
    TextInput,
    TouchableOpacity
} from 'react-native';
import firebase from '@firebase/app';
require('firebase/auth');
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../Images/logo.png';
import bgImage from '../Images/bgImage.png';

const { width: WIDTH } = Dimensions.get('window');

 export default class Login extends Component {
    state = {
        email: '',
        password: '',
        error: '',
        loading: false,
        hidePassword: true
    };

    onLoginButtonPress() {
        //this.setState({ loading: true });
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(this.onLoginSuccess.bind(this))
        .then(() => Actions.profile())
        .catch(this.onLoginFail.bind(this));
    }
    onLoginFail() {
        this.setState({ email: '',password: '', error: 'Authentication Failed', loading: false });
      }
    
    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: ''
        });
    }
    renderButton() {
        if(this.state.loading){
            return(
                <ActivityIndicator size="small" />
            );
        }
        else{
            return (
                <TouchableOpacity style={styles.btnLogin}
                onPress={this.onLoginButtonPress.bind(this)}>
                   <Text style={styles.text}>Sign In</Text>     
                </TouchableOpacity>
            );
        }
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
                onPress={() => Actions.signUp()}>
                   <Text style={styles.text}>Sign Up</Text>     
                </TouchableOpacity>
            );
        }
    }

     render() {
         return(
            <ImageBackground source={bgImage} style={styles.backgroundContainer}>
                <View style={StyleSheet.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.logoText}>Welcome User</Text>
                </View>
                <View>
                    <Icon name="ios-person" size={28} 
                        style={styles.inputIcon}/>
                    <TextInput
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        style={styles.userInput}
                        placeholder={'user@gmail.com'}
                        />
                </View>
                <View>
                    <Icon name="ios-lock" size={28} 
                        style={styles.inputIcon}/>
                    <TextInput
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        secureTextEntry={this.state.hidePassword}
                        style={styles.userInput}
                        placeholder={'password'}
                        />
                    <TouchableOpacity style={styles.showPassword}
                        onPress={()=>this.setState({hidePassword: ~this.state.hidePassword})}>
                        <Icon name={'ios-eye'} size={26} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorTextStyle}>
                    {this.state.error}
                </Text>
                {this.renderButton()}
                {this.renderSignUpButton()}
            </ImageBackground>
         );
     }
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