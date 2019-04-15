import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    StatusBar,
    Button,
    TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import DatePicker from 'react-native-datepicker';
import {
    BarChart,
} from 'react-native-chart-kit';
import Loader from './Loader';

const { width: WIDTH } = Dimensions.get('window');

export default class AttendanceGraph extends Component {
    state = {
        startDate: new Date(),
        endDate: new Date(),
        loading: true,
        studentList: [],
        studentKey: [],
        date: [],
        attendance: [],
        ylabels: [],
        labels: [],
        data: [],
        showOverall: false,
        displayClass: false,
        displayStudent: false,
        showStudentWise: false,
        isEmpty: true
    };
    componentDidMount() {
        let attendance = [];
        let studentList = [], studentKey = [];
        firebase.database().ref('users').orderByChild('stream_sem').equalTo(this.props.class)
            .once("value")
            .then(snapshot => {
                studentList = Object.values(snapshot.val());
                studentKey = Object.keys(snapshot.val());
                this.setState({
                    studentList: studentList,
                    studentKey: studentKey
                })
            });
        firebase.database().ref('attendance').child(this.props.class)
            .once("value")
            .then(snap => {
                dates = Object.keys(snap.val());
                this.setState({ DBdates: dates }, () => {
                    const { DBdates } = this.state;
                    for (let i = 0; i < DBdates.length; i++) {
                        firebase.database().ref(`attendance/${this.props.class}/${DBdates[i]}`)
                            .once("value")
                            .then(snapshot => {
                                const list = Object.values(snapshot.val());
                                attendance.push(list);
                            });
                    }
                })
            });
        setInterval(() => { this.setState({ loading: false, attendance: attendance }) }, 4000);
    };
    generateGraph = () => {
        if(this.state.isEmpty===true) {
            this.setState({ isEmpty: false })
        }
        const { startDate, endDate } = this.state;
        var start = new Date(startDate);
        var end = new Date(endDate);
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            var today = new Date(dt);
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
            arr.push(today);
            dt.setDate(dt.getDate() + 1);
        }
        this.setState({ date: arr }, () => {
            let ylabels=[], labels = [], data = [];
            const { DBdates, studentKey, studentList, attendance, date } = this.state;
            for (i = 0; i < date.length; i++) {
                const currentDate = date[i];
                const year = currentDate.substring(4);
                const month = currentDate.substring(0, 2);
                const day = currentDate.substring(2, 4);
                for (j = 0; j < DBdates.length; j++) {
                    if (DBdates[j] === date[i]) {
                        if(this.state.isEmpty===false){
                            this.setState({ isEmpty: true })
                        }
                        const _date = day.concat('-').concat(month).concat('-').concat(year);
                        labels = [...labels, _date];
                        const percentage = ((attendance[j].length - 1) / (studentKey.length)) * 100;
                        data = [...data, percentage];
                        break;
                    }
                }
            }
            for(i=0;i<labels.length;i++){
                ylabels = [...ylabels, i+1];
            }
            this.setState({ ylabels: ylabels, labels: labels, data: data, showOverall: true });
        });
    };
    generateStudentGraph = () => {
        if(this.state.isEmpty===true) {
            this.setState({ isEmpty: false })
        }
        const { startDate, endDate } = this.state;
        var start = new Date(startDate);
        var end = new Date(endDate);
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            var today = new Date(dt);
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
            arr.push(today);
            dt.setDate(dt.getDate() + 1);
        }
        this.setState({ date: arr }, () => {
            let ylabels=[],labels = [], data = [];
            let totalDays = 0;
            let countFlag = true;
            const { DBdates, studentKey, studentList, attendance, date } = this.state;
            for(i=0;i<studentList.length;i++) {
                const fname = studentList[i].firstname;
                const lname = studentList[i].lastname;
                let newObj = {
                    key: i.toString(),
                    name: fname.concat(' ').concat(lname),
                    roll: studentList[i].uroll
                }
                let count = 0;
                if(i>0) {
                    countFlag = false;
                }
                for(j=0;j<date.length;j++) {
                    let flag = 0, pre = 0;
                    for(k=0;k<DBdates.length;k++) {
                        if(DBdates[k] === date[j]) {
                            if(this.state.isEmpty===false) {
                                this.setState({ isEmpty: true })
                            }
                            if(countFlag === true) {
                                totalDays = totalDays + 1;
                            }
                            flag = 1;
                            let present = 0;
                            for(l=0;l<attendance[k].length-1;l++) {
                                if(attendance[k][l].userId === studentKey[i]) {
                                    present = 1;
                                    break;
                                }
                            }
                            if(present === 1) {
                                pre = 1;
                            }
                            break;
                        }
                    }
                    if (flag === 1 && pre === 1) {
                        count = count + 1;
                    }
                }
                ylabels = [...ylabels, i+1];
                labels = [...labels, newObj];
                data = [...data,((count/totalDays)*100)];
            }
            this.setState({ ylabels: ylabels, labels: labels, data: data, showStudentWise: true });
        });
    }
    showStudentWise = () => {
        const width = Dimensions.get('window').width
        const height = 300
        if (this.state.showStudentWise) {
            const data = {
                labels: this.state.ylabels,
                datasets: [{
                    data: this.state.data
                }]
            };
            const chartConfig = {
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16
                }
            };
            const graphStyle = {
                marginVertical: 8,
                alignSelf: 'center',
                ...chartConfig.style
            };
            const list = this.state.labels.map((label,index)=>{
                return(
                    <Text>{index+1} -> {label.roll}({label.name})</Text>
                );
            });
            if(this.state.isEmpty){
                return (
                    <ScrollView>
                        <ScrollView
                            horizontal={true}>
                            <BarChart
                                width={width * 2}
                                height={height}
                                data={data}
                                yAxisLabel={'%'}
                                chartConfig={chartConfig}
                                style={graphStyle}
                            />
                        </ScrollView>
                        <ScrollView>
                            {list}
                        </ScrollView>
                    </ScrollView>
                );
            } else {
                return(
                    <View style={{ alignItems: 'center' }}>
                        <Text>No Attendance Taken Between the Given Dates</Text>
                    </View>
                );
            }
        } 
    }
    showOverall = () => {
        const width = Dimensions.get('window').width
        const height = 300
        if (this.state.showOverall) {
            const data = {
                labels: this.state.ylabels,
                datasets: [{
                    data: this.state.data
                }]
            };
            const chartConfig = {
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16
                }
            };
            const graphStyle = {
                marginVertical: 8,
                alignSelf: 'center',
                ...chartConfig.style
            };
            const list = this.state.labels.map((label,index)=>{
                return(
                    <Text>{index+1} -> {label}</Text>
                );
            });
            if(this.state.isEmpty){
                return (
                    <ScrollView>
                        <ScrollView
                            horizontal={true}>
                            <BarChart
                                width={width * 2}
                                height={height}
                                data={data}
                                yAxisLabel={'%'}
                                chartConfig={chartConfig}
                                style={graphStyle}
                            />
                        </ScrollView>
                        <ScrollView>
                            {list}
                        </ScrollView>
                    </ScrollView>
                );
            } else {
                return(
                    <View style={{ alignItems: 'center' }}>
                        <Text>No Attendance Taken Between the Given Dates</Text>
                    </View>
                );
            }
        } 
    }
    renderDatePicker = () => {
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Start Date: </Text>
                    <DatePicker
                        style={{ width: 200 }}
                        date={this.state.startDate}
                        mode="date"
                        placeholder="Start Date"
                        format="YYYY-MM-DD"
                        minDate="2019-01-01"
                        maxDate="2030-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => { this.setState({ startDate: date }) }}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>End Date:   </Text>
                    <DatePicker
                        style={{ width: 200 }}
                        date={this.state.endDate}
                        mode="date"
                        placeholder="End Date"
                        format="YYYY-MM-DD"
                        minDate="2019-01-01"
                        maxDate="2030-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => { this.setState({ endDate: date }) }}
                    />
                </View>
            </View>
        );
    }
    renderStudentWise = () => {
        if(this.state.displayStudent) {
            return(
               <ScrollView>
                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                        <Text>Student Wise</Text>
                        {this.renderDatePicker()}
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={() => this.generateStudentGraph()}>
                            <Text style={styles.text}>Get Graph</Text>
                        </TouchableOpacity>
                        {this.showStudentWise()}
                    </View>
               </ScrollView>
            );
        }
    }
    renderAllClass = () => {
        if (this.state.displayClass) {
            return (
                <ScrollView>
                    <View style={{ alignItems: 'center', paddingTop: 20 }}>
                        <Text>Whole Class</Text>
                        {this.renderDatePicker()}
                        <TouchableOpacity style={styles.btnLogin}
                            onPress={() => this.generateGraph()}>
                            <Text style={styles.text}>Get Graph</Text>
                        </TouchableOpacity>
                        {this.showOverall()}
                    </View>
                </ScrollView>
            );
        }
    }
    displayClass = () => {
        const { displayClass, displayStudent, showOverall, data, labels, ylabels } = this.state;
        if(showOverall){
            this.setState({ showOverall: false })
        }
        if(data.length>0){
            this.setState({ data:[] })
        }
        if(labels.length>0){
            this.setState({ labels:[] })
        }
        if(ylabels.length>0){
            this.setState({ ylabels:[] })
        }
        if (displayClass === false) {
            this.setState({ displayClass: true });
        } else {
            this.setState({ displayClass: false });
        }
        if (displayStudent === true) {
            this.setState({ displayStudent: false });
        }
    };
    displayStudent = () => {
        const { displayClass, displayStudent, showStudentWise, data, labels, ylabels } = this.state;
        if(showStudentWise){
            this.setState({ showStudentWise: false })
        }
        if(data.length>0){
            this.setState({ data:[] })
        }
        if(labels.length>0){
            this.setState({ labels:[] })
        }
        if(ylabels.length>0){
            this.setState({ ylabels:[] })
        }
        if (displayStudent === false) {
            this.setState({ displayStudent: true });
        } else {
            this.setState({ displayStudent: false });
        }
        if (displayClass === true) {
            this.setState({ displayClass: false });
        }
    };
    renderButtons = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => this.displayClass()}>
                    <Text style={styles.text}>Whole Class</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnLogin}
                    onPress={() => this.displayStudent()}>
                    <Text style={styles.text}>Student</Text>
                </TouchableOpacity>
            </View>
        );
    }
    render() {
        return (
            <View style={{ alignItems: 'center' }}>
                <ScrollView>
                    <Loader loading={this.state.loading} />
                    {this.renderButtons()}
                    {this.renderAllClass()}
                    {this.renderStudentWise()}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
