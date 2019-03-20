import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    FlatList
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Container, Header, Content, List, ListItem, SwipeRow, Left, Body, Right, Button, Icon } from 'native-base';
import * as firebase from 'firebase';
const screen = Dimensions.get('window');
export default class AddNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listViewData: [],
            title: '',
            description: '',
        };
    }
    componentDidMount() {
        let list = [];
        const that = this;
        firebase.database().ref(`/notice/${this.props.class}`)
            .on("child_added", snapshot => {
                var newData = [...that.state.listViewData]
                newData.push(snapshot)
                that.setState({ listViewData: newData })
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
        firebase.database().ref(`/notice/${this.props.class}`)
            .push({ title, description, today })
            .then(this.added.bind(this))
    }
    added = () => {
        this.setState({
            title: '',
            description: ''
        })
        this.refs.addNotice.close();
    }
    async removeItem(item) {
        await firebase.database().ref(`/notice/${this.props.class}/${item.key}`).set(null);
        this.setState({listViewData: this.state.listViewData.filter(function(data) { 
            return data.key !== item.key 
        })});
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Container>
                    <List>
                        <FlatList
                            data={this.state.listViewData}
                            renderItem={({ item }) =>
                                <SwipeRow
                                    rightOpenValue={-75}
                                    body={
                                            <View>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold', }}>{item.val().title}</Text>
                                                <Text>{item.val().today}</Text>
                                                <Text>{item.val().description}</Text>
                                            </View>
                                    }
                                    right={
                                        <Button danger onPress={() => this.removeItem(item)}>
                                            <Icon active name="trash" />
                                        </Button>
                                    }
                                />
                                    //<ListItem avatar>
                                     //   <Body>
                                       //     <Text style={{fontSize: 15,fontWeight: '200', }}>{item.val().title}</Text>
                                     //       <Text>{item.val().description}</Text>
                                       // </Body>
                                      //  <Right>
                                      //      <Text note>{item.val().today}</Text>
                                     //   </Right>
                                   // </ListItem>
                            }
                        />
                    </List>
                </Container>

                < TouchableOpacity style={styles.addButton} onPress={() => this.refs.addNotice.open()}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <Modal ref={"addNotice"}
                    style={styles.modal} position={"center"}>
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
