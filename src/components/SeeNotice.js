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
        };
    }
    componentDidMount() {
        let list = [];
        firebase.database().ref(`/notice/${this.props.class}`)
            .once("value", snapshot => {
                const data = Object.values(snapshot.val());
                for(i=0;i<data.length;i++){
                    const newObj = {
                        description: data[i].description,
                        title: data[i].title,
                        today: data[i].today
                    }
                    list = [...list, newObj];
                }
                this.setState({listViewData: list});
            })
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
                                    body={
                                            <View>
                                                <Text style={{ fontSize: 17, fontWeight: 'bold', }}>{item.title}</Text>
                                                <Text>{item.today}</Text>
                                                <Text>{item.description}</Text>
                                            </View>
                                    }
                                    
                                />
                            }
                        />
                    </List>
                </Container>
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
