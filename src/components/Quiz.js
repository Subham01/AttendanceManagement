import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import * as firebase from 'firebase';
import PlayQuiz from './PlayQuiz';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quizFinish: false,
      score: 0,
      userId: '',
      firstname: '',
      lastname: '',
      quizNo: -1,
    }
  }
  componentDidMount() {
    const { currentUser } = firebase.auth();
    firebase
      .database()
      .ref('users/')
      .child(currentUser.uid)
      .once('value', snap =>
        this.setState({
          userId: currentUser.uid,
          firstname: snap.val().firstname,
          lastname: snap.val().lastname
        })
      );
    firebase.database().ref('quiz')
      .once("value")
      .then(snapshot => {
        const exist = snapshot.child(this.props.class).exists();
        console.log(exist);
        if (exist) {
          firebase.database().ref(`quiz/${this.props.class}`)
            .once("value")
            .then(snap => {
              this.setState({ quizNo: snap.val().countQuiz },() => console.log(this.state.quizNo))
            });
        }
      })
  }
  _quizFinish(score) {
    score = Math.round( score * 10 ) / 10;
    this.setState({ quizFinish: true, score: score })
  }
  _scoreMessage(score) {
    if( score === 404) {
      return(
        <View style={styles.innerContainer}>
          <Text style={styles.score}>No Live Quiz</Text>
        </View>
      );
    }
    else if (score === 200) {
      return (<View style={styles.innerContainer}>
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You Have Already Given the Quiz</Text>
      </View>)
    }
    else if (score <= 40) {
      return (<View style={styles.innerContainer} >
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You need to work hard</Text>
        <Text style={styles.score}>You scored {score}%</Text>
      </View>)
    } else if (score > 40 && score < 80) {
      return (<View style={styles.innerContainer} >
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You are good</Text>
        <Text style={styles.score}>Congrats you scored {score}% </Text>
      </View>)
    } else if (score >= 80) {
      return (<View style={styles.innerContainer}>
        <View style={{ flexDirection: "row" }} >
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
          <Icon name="trophy" size={30} color="white" />
        </View>
        <Text style={styles.score}>You are the master</Text>
        <Text style={styles.score}>Congrats you scored {score}% </Text>
      </View>)
    }
  }
  storeMarks = () => {
    if (this.state.quizFinish && this.state.score !== 200 && this.state.score !== 404) {
      const quiz = "quiz" + this.state.quizNo;
      firebase.database().ref(`quiz/${this.props.class}/marks/${quiz}`)
        .push({
          score: this.state.score,
          name: this.state.firstname.concat(' ').concat(this.state.lastname),
          userId: this.state.userId,
        });
    }
  }
  renderContent = () => {
    if (this.state.quizFinish) {
      return (
        <View style={styles.container}>
          <View style={styles.circle}>
            {this.storeMarks()}
            {this._scoreMessage(this.state.score)}
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <PlayQuiz class={this.props.class} quizFinish={(score) => this._quizFinish(score)} />
        </View>
      );
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.toolbar}>
          <Text style={styles.toolbarButton}>Quiz</Text>
          <Text style={styles.toolbarTitle}></Text>
          <Text style={styles.toolbarButton}></Text>
        </View>
        {this.renderContent()}
      </View>
    );
  }
}
const scoreCircleSize = 300
const styles = StyleSheet.create({
  score: {
    color: "white",
    fontSize: 20,
    fontStyle: 'italic'
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scoreCircleSize,
    height: scoreCircleSize,
    borderRadius: scoreCircleSize / 2,
    backgroundColor: "#432577"
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#432577',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  toolbarButton: {
    width: 55,
    color: '#fff',
    textAlign: 'center'
  },
  toolbarTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1
  }
});