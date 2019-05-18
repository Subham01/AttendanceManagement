import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    FlatList
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Container, List, SwipeRow, Button, Icon } from 'native-base';
import * as firebase from 'firebase';
const screen = Dimensions.get('window');
export default class AddNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listViewData: [],
            title: '',
            description: '',
            present: false,
            key: []
        };
    }
    componentDidMount() {
        let list = [];
        firebase.database().ref(`notice`)
            .once("value", snapshot => {
                const exist = snapshot.child(this.props.class).exists();
                if (exist) {
                    firebase.database().ref(`notice/${this.props.class}`)
                        .once("value")
                        .then(snap => {
                            const data = Object.values(snap.val());
                            const key = Object.keys(snap.val());
                            for (i = 0; i < data.length; i++) {
                                const newObj = {
                                    description: data[i].description,
                                    title: data[i].title,
                                    today: data[i].today
                                }
                                list = [...list, newObj];
                            }
                            this.setState({ listViewData: list, present: true, key: key });
                        });
                }
            })
    }
    addNotice = () => {
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
        today = mm + '-' + dd + '-' + yyyy;
        const { title, description } = this.state;
        const newObj = { description, title, today };
        this.setState({
            listViewData: [...this.state.listViewData, newObj]
        });
        firebase.database().ref(`/notice/${this.props.class}`)
            .push({ title, description, today })
            .then(res => {
                this.setState({
                    key: [...this.state.key, res.getKey()],
                    title: '',
                    description: ''
                }, () => this.refs.addNotice.close());
            })
    }
    async removeItem(index) {
        const ID = this.state.key[index], indx = index;
        await firebase.database().ref(`/notice/${this.props.class}/${ID}`).set(null);
        this.setState({
            listViewData: this.state.listViewData.filter(function (data, index) {
                return index !== indx
            }),
            key: this.state.key.filter(function (data, index) {
                return index !== indx;
            })
        });
    }
    renderContent = () => {
        if (this.state.present) {
            if (this.state.listViewData.length > 0) {
                console.log(this.state.listViewData);
                return (
                    <Container>
                        <List>
                            <FlatList
                                data={this.state.listViewData}
                                renderItem={({ item, index }) =>
                                    <SwipeRow
                                        rightOpenValue={-75}
                                        body={
                                            <View>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold', }}>{item.title}</Text>
                                                <Text>{item.today}</Text>
                                                <Text>{item.description}</Text>
                                            </View>
                                        }
                                        right={
                                            <Button danger onPress={() => this.removeItem(index)}>
                                                <Icon active name="trash" />
                                            </Button>
                                        }
                                    />
                                }
                            />
                        </List>
                    </Container>
                );
            } else {
                return (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>No Notice</Text>
                    </View>
                );
            }
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderContent()}
                < TouchableOpacity style={styles.addButton} onPress={() => this.refs.addNotice.open()}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <Modal ref={"addNotice"}
                    style={styles.modal} position={"top"}>
                    <KeyboardAvoidingView style={{ alignItems: 'center' }} behavior="height">
                        <View>
                            <Text style={styles.title}>New Notice</Text>
                            <TextInput
                                style={styles.userInput}
                                value={this.state.title}
                                onChangeText={title => this.setState({ title })}
                                placeholder={'Title'}
                                placeholderTextColor="#000"
                            />
                            <TextInput
                                style={styles.userInput}
                                value={this.state.description}
                                onChangeText={description => this.setState({ description })}
                                placeholder={'Description'}
                                placeholderTextColor="#000"
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.btnLogin}
                                    onPress={this.addNotice.bind(this)}>
                                    <Text style={styles.text}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnLogin}
                                    onPress={() => { this.setState({ title: '', description: '' }) }}>
                                    <Text style={styles.text}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        );
    }
}
const styles = {
    btnLogin: {
        width: screen.width / 4,
        height: 35,
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: '#432577',
        marginTop: 20,
        marginLeft: 30
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    modal: {
        justifyContent: 'center',
        borderRadius: 0,
        shadowRadius: 10,
        width: screen.width - 80,
        height: 280
    },
    userInput: {
        height: 40,
        borderBottomColor: 'gray',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#E91E63',
        width: 90,
        height: 90,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24
    },
};
