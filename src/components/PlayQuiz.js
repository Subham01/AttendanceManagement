import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  AppState,
  Dimensions,
  BackHandler,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import CountDown from 'react-native-countdown-component';
import Loader from './Loader';
const { width, height } = Dimensions.get('window');
const { width: WIDTH } = Dimensions.get('window');
let selectedOption = '';
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
export default class PlayQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: 'Procede To Quiz',
      options: '',
      correctoption: '',
      loading: true,
      jsonData: null,
      countCheck: 0,
      jdata: null,
      scoreData: '',
      qno: 0,
      score: 0,
      duration: 0,
      appState: AppState.currentState,
      minimizeCount: 0,
      alreadyTaken: false,
      quizNo: 1,
      activeQuiz: true
    }

  }
  componentDidMount() {
    const { currentUser } = firebase.auth();
    AppState.addEventListener('change', this._handleAppStateChange);
    firebase.database().ref('quiz')
      .once("value")
      .then(snap => {
        const Exist = snap.child(this.props.class).exists();
        if (Exist) {
          firebase.database().ref(`quiz/${this.props.class}`)
            .once("value")
            .then(snaps => {
              const jsonDta = Object.values(snaps.val());
              this.setState({ jsonData: jsonDta, quizNo: snaps.val().countQuiz }, () => {
                firebase.database().ref(`quiz/${this.props.class}`)
                  .once("value")
                  .then(snapshot => {
                    const activeQuiz = snapshot.child('quiz').exists();
                    if (activeQuiz) {
                      const quiz = "quiz" + this.state.quizNo;
                      firebase.database().ref(`quiz/${this.props.class}/marks/${quiz}`)
                        .once("value")
                        .then(snap => {
                          const jsonDta = Object.values(snap.val());
                          this.setState({ scoreData: jsonDta }, () => {
                            const { scoreData } = this.state;
                            let flag = 0;
                            for (i = 0; i < scoreData.length; i++) {
                              if (scoreData[i].userId === currentUser.uid) {
                                flag = 1;
                                break;
                              }
                            }
                            if (flag === 1) {
                              this.setState({ alreadyTaken: true }, () => this.props.quizFinish(200))
                            }
                          })
                        });
                    } else {
                      this.setState({ activeQuiz: false }, () => this.props.quizFinish(404))
                    }
                  })
              })
            })
        } else {
          this.setState({ activeQuiz: false })
        }
      })
    setInterval(() => {
      const _this = this;
      let jdata, duration;
      if(this.state.activeQuiz) {
        if (this.state.jsonData.length === 3) {
          duration = this.state.jsonData[2].duration;
          jdata = this.state.jsonData[2].quiz1;
        }
        else {
          duration = this.state.jsonData[1].duration;
          jdata = this.state.jsonData[1].quiz1;
        }
        duration = duration * 60;
        this.setState({ loading: false, jdata: jdata, duration: duration });
      } else {
        this.setState({ loading: false},()=>this.props.quizFinish(404))
      }
    }, 4000);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this.state.minimizeCount === 0)
      alert('Minimize again, and QUIZ STOPS');
      else if(this.state.minimizeCount === 1)
      alert('QUIZ AUTO SUBMIT');
      this.setState({ minimizeCount: this.state.minimizeCount + 1 }, () => {
        if (this.state.minimizeCount === 2) {
          this.props.quizFinish(this.state.score * 100 / this.state.jdata.length);
        }
      })
    }
    this.setState({ appState: nextAppState });
  }
  handleBackButton() {
    return true;
  }
  next() {
    let marks = this.state.score;
    const { jdata, qno, question } = this.state;
    const ans = selectedOption;
    if (ans !== '') {
      if (ans === this.state.correctoption) {
        marks = marks + 1;
      }
    }
    this.setState({ score: marks }, () => {
      selectedOption = '';
      if (question === "Procede To Quiz") {
        this.setState({
          countCheck: 0,
          question: Object.values(jdata[qno])[0].question,
          options: Object.values(jdata[qno])[0].options,
          correctoption: Object.values(jdata[qno])[0].correctoption,
          qno: this.state.qno + 1
        })
      }
      else if (qno < jdata.length) {
        this.setState({
          countCheck: 0,
          question: Object.values(jdata[qno])[0].question,
          options: Object.values(jdata[qno])[0].options,
          correctoption: Object.values(jdata[qno])[0].correctoption,
          qno: this.state.qno + 1
        })
      } else {
        this.props.quizFinish(this.state.score * 100 / jdata.length)
      }
    })
  }
  _answer = (status, ans) => {
    if (status == true) {
      const count = this.state.countCheck + 1
      this.setState({ countCheck: count })
      if (ans == this.state.correctoption) {
        this.setState({ score: this.state.score + 1 })
      }
    } else {
      const count = this.state.countCheck - 1
      this.setState({ countCheck: count })
      if (this.state.countCheck < 1 || ans == this.state.correctoption) {
        this.setState({ score: this.state.score - 1 })
      }
    }

  }
  showCounter = () => {
    if (this.state.duration !== 0) {
      return (
        <View>
          <CountDown
            until={this.state.duration}
            size={30}
            onFinish={() => {
              alert('Time Up!');
              this.props.quizFinish(this.state.score * 100 / this.state.jdata.length);
            }}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: '#1CC625' }}
            timeToShow={['M', 'S']}
            timeLabels={{ m: 'MM', s: 'SS' }}
          />
        </View>
      );
    }
  }
  displayContent = () => {
    let _this = this
    const currentOptions = this.state.options
    const options = Object.keys(currentOptions).map(function (k) {
      return (<View key={k} style={{ margin: 10 }}>
        <TouchableOpacity style={[styles.btnLogin, { backgroundColor: selectedOption === k ? 'green' : '#432577' }]}
          onPress={() => selectedOption = k}>
          <Text style={styles.text}>{currentOptions[k]}</Text>
        </TouchableOpacity>
      </View>)
    });
    return (
      <View>
        <Loader loading={this.state.loading} />
        <View style={styles.container}>
          {this.showCounter()}
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: "space-between", alignItems: 'center', }}>

            <View style={styles.oval} >
              <Text style={styles.welcome}>
                {this.state.question}
              </Text>
            </View>
            <View>
              {options}
            </View>
            <View style={{ flexDirection: "row" }}>

              <TouchableOpacity onPress={() => this.next()} >
                <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 10, backgroundColor: "green" }}>
                  <Icon name="md-arrow-round-forward" size={30} color="white" />
                </View>
              </TouchableOpacity >

            </View>
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#F5FCFF', paddingTop: 10 }}>
        {this.displayContent()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  oval: {
    width: width * 90 / 100,
    borderRadius: 20,
    backgroundColor: '#432577'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    margin: 15,
    color: "white"
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
});