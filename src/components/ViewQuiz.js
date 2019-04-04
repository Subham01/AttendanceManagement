import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Button,
} from 'react-native';
import Modal from 'react-native-modalbox';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';
const { width: WIDTH } = Dimensions.get('window');

export default class ViewQuiz extends Component {
    state = {
        loading: true,
        jsonData: null,
        jsonKey: null,
        duration: '',
        jdata: null,
        showMarks: false,
        showQuestion: false,
        duration: 0,
        qno: 0,
        selectedQuiz: -1,
        exist: true,
        marksFlag: false,
        quizFlag: false
    }
    componentDidMount() {
        firebase.database().ref('quiz')
        .once("value")
        .then(snap => {
            const Exist = snap.child(this.props.class).exists();
            if(Exist) {
                firebase.database().ref(`quiz/${this.props.class}`)
                .once("value")
                .then(snap => {
                    const jsonDta = Object.values(snap.val());
                    const jsonkey = Object.keys(snap.val());
                    this.setState({ jsonData: jsonDta, jsonKey: jsonkey })
                })
            } else {
                this.setState({ exist: false })
            }
        })
        setInterval(() => {
            const _this = this;
            let jdata, duration;
            let marksFlag = 0, quizFlg = 0;
            const { jsonData, exist, jsonKey } = this.state;
            if(exist) {
                for(i=0;i<jsonKey.length;i++) {
                    if(jsonKey[i] === 'marks') {
                        marksFlag = 1;
                    }
                    if(jsonKey[i] === 'quiz') {
                        quizFlg = 1;
                    }
                }
            }
            if(marksFlag === 1) {
                this.setState({ marksFlag: true })
            }
            if(quizFlg === 1) {
                if (jsonData.length === 3) {
                    duration = jsonData[2].duration;
                    jdata = jsonData[2].quiz1;
                }
                else {
                    duration = jsonData[1].duration;
                    jdata = jsonData[1].quiz1;
                }
                duration = duration * 60;
                this.setState({ loading: false, jdata: jdata, duration: duration, quizFlag: true });
            } else {
                this.setState({ loading: false })
            }
        }, 4000);
    }
    showQuestionButton = () => {
        if (!this.state.showQuestion) {
            return (
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => this.setState({ showQuestion: true })}>
                    <Text style={styles.text}>Show Question</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => this.setState({ showQuestion: false })}>
                    <Text style={styles.text}>Hide Question</Text>
                </TouchableOpacity>
            );
        }
    }
    next = () => {
        const { qno, jdata } = this.state;
        if (qno + 1 < jdata.length) {
            this.setState({ qno: qno + 1 });
        } else {
            alert('You have reached END!');
        }

    }
    prev = () => {
        const { qno } = this.state;
        if (qno - 1 >= 0) {
            this.setState({ qno: qno - 1 });
        } else {
            alert('You have reached BEGINNING!');
        }

    }
    endQuiz = () => {
        firebase.database().ref(`quiz/${this.props.class}/quiz`).set(null);
        //this.setState({ jdata: null,quizFlag: false, loading: false })
        Actions.teacherProfile();
    }
    showQuestion = () => {
        if (this.state.showQuestion) {
            const { jdata, qno, quizFlag } = this.state;
            if (quizFlag) {
                const question = Object.values(jdata[qno])[0].question;
                const options = Object.values(jdata[qno])[0].options;
                const correctoption = Object.values(jdata[qno])[0].correctoption;
                const option = Object.keys(options).map(function (k) {
                    return (<View key={k} style={{ margin: 10 }}>
                        <View style={{ borderWidth: 0.5, }}>
                            <Text style={styles.Optiontext}>{options[k]}</Text>
                        </View>
                    </View>)
                });
                return (
                    <View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.endBttn}
                                onPress={() => this.refs.endQuiz.open()}>
                                <Text style={styles.text}>End Quiz</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.welcome}>
                                {question}
                            </Text>
                            <View>
                                {option}
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.displayContent}>
                                        Correct Option:
                                    </Text>
                                    <Text style={styles.valueContent}>
                                        {options[correctoption]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: WIDTH, flexDirection: "row", justifyContent: 'space-between', }}>
                            <TouchableOpacity onPress={() => this.prev()}>
                                <Icon name="md-arrow-round-back" size={60} color="#841584" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.next()}>
                                <Icon name="md-arrow-round-forward" size={60} color="#841584" />
                            </TouchableOpacity>
                        </View>
                        <Modal ref={"endQuiz"}
                            style={styles.modal} position={"center"}>
                            <View style={{ alignItems: 'center' }}>
                                <Text>
                                    Are you sure, you want to end the Quiz.
                            </Text>
                                <View style={{ flexDirection: "row", paddingTop: 10 }}>
                                    <Button title="End Quiz" 
                                        onPress={() => { this.setState({ loading: true });this.endQuiz() }} 
                                        style={styles.modalBtn} />
                                    <Button title="Close" onPress={() => this.refs.endQuiz.close()} style={styles.modalBtn} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                );
            } else {
                return (
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.displayContent}>
                            No Live Quiz
                        </Text>
                    </View>
                );
            }
        }
    }
    showMarksList = () => {
        const { jsonData, selectedQuiz } = this.state;
        if (selectedQuiz !== -1) {
            let studentList = Object.values(jsonData[1])[selectedQuiz];
            studentList = Object.values(studentList)
            studentList = studentList.map(student => {
                return (
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingTop: 10 }}>
                        <Text>{student.name}</Text>
                        <Text>{student.score}</Text>
                    </View>
                );
            })
            return (
                <View>
                    {studentList}
                </View>
            );
        }
    }
    showMarks = () => {
        const { jsonData, marksFlag } = this.state;
        if (this.state.showMarks && !this.state.showQuestion) {
            if (!marksFlag) {
                return (
                    <Text>
                        No Marks Available
                    </Text>
                );
            }
            else {
                console.log();
                const quizList = Object.keys(jsonData[1]).map((quiz, index) => {
                    return (
                        <View key={quiz}>
                            <TouchableOpacity style={styles.quizbttn}
                                onPress={() => this.setState({ selectedQuiz: index })}>
                                <Text style={styles.text} style={{ color: 'black' }}>
                                    {quiz}
                                </Text>
                            </TouchableOpacity>
                            {this.showMarksList()}
                        </View>
                    );
                })
                return (
                    <View>
                        {quizList}
                    </View>
                );
            }
        }
    }
    showMarksButton = () => {
        if (!this.state.showQuestion) {
            if (!this.state.showMarks) {
                return (
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={() => this.setState({ showMarks: true })}>
                        <Text style={styles.text}>Show Marks</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity style={styles.btnLogin}
                        onPress={() => this.setState({ showMarks: false, selectedQuiz: -1 })}>
                        <Text style={styles.text}>Hide Marks</Text>
                    </TouchableOpacity>
                );
            }
        } else {
            if (this.state.selectedQuiz !== -1)
                this.setState({ selectedQuiz: -1 })
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <Loader loading={this.state.loading} />
                    {this.showQuestionButton()}
                    {this.showMarksButton()}
                    {this.showQuestion()}
                    {this.showMarks()}
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    quizbttn: {
        width: WIDTH / 2,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 20
    },
    modalBtn: {
        width: WIDTH / 4,
        height: 35,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#432577',
        marginTop: 20,
        marginLeft: 30
    },
    btnLogin: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#432577',
        marginTop: 20
    },
    endBttn: {
        width: WIDTH / 2,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginTop: 20
    },
    Optiontext: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black'
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: 0,
        shadowRadius: 10,
        width: WIDTH - 80,
        height: 280
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
    welcome: {
        fontSize: 20,
        margin: 15,
        color: "black"
    },
    displayContent: {
        fontSize: 20,
        fontWeight: '200',
    },
    valueContent: {
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: '200',
        opacity: 0.5,
    },
});