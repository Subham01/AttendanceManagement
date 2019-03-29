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
import Loader from './Loader';
const { width, height } = Dimensions.get('window');
const { width: WIDTH } = Dimensions.get('window');
let selectedOption = ''
export default class PlayQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: 'Procede To Quiz',
      options: '',
      correctoption: '',
      loading: true,
      jsonData: {},
      countCheck: 0,
      jdata: '',
      qno: 0,
      score: 0,
      appState: AppState.currentState,
      minimizeCount: 0
    }

  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    firebase.database().ref(`quiz/${this.props.class}`)
      .once("value")
      .then(snap => {
        const jsonDta = Object.values(snap.val());
        this.setState({ jsonData: jsonDta })
      })
    setInterval(() => {
      const _this = this;
      const jdata = this.state.jsonData[0].quiz1;
      this.setState({ loading: false, jdata: jdata });
    }, 6000);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      alert('Dont Minimize again');
      this.setState({ minimizeCount: this.state.minimizeCount + 1 },() => {
        console.log(this.state.minimizeCount);
        if(this.state.minimizeCount === 2) {
          this.setState({ qno:  this.state.jdata.length })
        }
      })
    }
    this.setState({appState: nextAppState});
  }
  handleBackButton() {
    return true;
  }
  next() {
    let marks = this.state.score;
    const { jdata, qno, question } = this.state;
    console.log(qno);
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
    console.log(status);
    if (status == true) {
      const count = this.state.countCheck + 1
      this.setState({ countCheck: count })
      if (ans == this.state.correctoption) {
        console.log("Correct");
        this.setState({ score: this.state.score + 1 })
      }
    } else {
      const count = this.state.countCheck - 1
      this.setState({ countCheck: count })
      if (this.state.countCheck < 1 || ans == this.state.correctoption) {
        console.log("Wrong");
        this.setState({ score: this.state.score - 1 })
      }
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
    backgroundColor: 'green'
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