import React, {Component} from 'react';
import firebase from '@firebase/app';
require('firebase/auth');
import Router from './src/Router';
import Profile from './src/components/Profile';
import Loader from './src/components/Loader';

export default class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: "AIzaSyD6kJDDnPPCoj6AKpIXwRnGDJ0pfWsnxiU",
      authDomain: "attendancemanagement-13fb7.firebaseapp.com",
      databaseURL: "https://attendancemanagement-13fb7.firebaseio.com",
      projectId: "attendancemanagement-13fb7",
      storageBucket: "attendancemanagement-13fb7.appspot.com",
      messagingSenderId: "680452651401"
    };
    firebase.initializeApp(config);
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({ loggedIn: true });
    //   } 
    //   else {
    //     this.setState({ loggedIn: false });
    //   }
    // });
  }
  
  render() {
    return (
      <Router />
    );
  }
}
