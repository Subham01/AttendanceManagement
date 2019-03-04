import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import * as firebase from 'firebase';
import { Calendar } from 'react-native-calendars';
import Loader from './Loader';

class AttendanceView extends Component {
    state = {
        set: false,
        marked: null,
        date: [],
        loading: true,
        presentDay: [],
        absentDay: []
    };
    componentDidMount() {
        const { currentUser } = firebase.auth();
        const promices = new Promise((resolve, reject) => {
            firebase.database().ref('attendance').child(this.props.class)
                .once("value")
                .then(snapshot => {
                    let absent = [];
                    let present = [];
                    const dates = Object.keys(snapshot.val());
                    this.setState({ date: dates });
                    for (i = 0; i < dates.length; i++) {
                        let flag = 0;
                        const currentDate = dates[i];
                        const year = currentDate.substring(4);
                        const month = currentDate.substring(0, 2);
                        const day = currentDate.substring(2, 4);
                        const date = year.concat('-').concat(month).concat('-').concat(day);
                        firebase.database().ref(`attendance/${this.props.class}/${dates[i]}`)
                            .once("value")
                            .then(snapshot => {
                                const list = Object.values(snapshot.val());
                                for (j = 0; j < (list.length - 1); j++) {
                                    if (list[j].userId == currentUser.uid) {
                                        flag = 1;
                                        present = [...present, date];
                                        this.setState({ presentDay: present });
                                        console.log("presentDay");
                                        console.log(this.state.presentDay);
                                        break;
                                    }
                                }
                                if (flag == 0) {
                                    absent = [...absent, date];
                                    this.setState({ absentDay: absent });
                                    console.log("absentDay");
                                    console.log(this.state.absentDay);
                                }
                            });
                    }
                    //this.setState({presentDay: present, absentDay: absent}, () => this.anotherFunc())
                })
                setInterval(() => {resolve()},5000);
        });
        promices.then(() =>{
            this.anotherFunc();
        });
    }
    anotherFunc = () => {
        let obj1 = this.state.presentDay.reduce((c, v) => Object.assign(c, { [v]: { selected: true, marked: true, disabled: true, startingDay: true, color: 'green', endingDay: true } }), {});
        let obj2 = this.state.absentDay.reduce((c, v) => Object.assign(c, { [v]: { selected: true, marked: true, disabled: true, startingDay: true, color: 'red', endingDay: true } }), {});
        const days = Object.assign({}, obj1, obj2);
        this.setState({ marked: days, loading: false })
    }
    render() {
        return (
            < View style={styles.container} >
                <Loader loading={this.state.loading} />
                <Calendar
                    style={styles.calendar}
                    onMonthChange={(month) => { console.log('month changed', month) }}
                    onDayPress={(day) => { console.log('selected day', day) }}
                    markedDates={this.state.marked}
                    markingType={'period'}
                />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
    }
});
export default AttendanceView;
