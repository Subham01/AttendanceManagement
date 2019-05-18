import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    FlatList
} from 'react-native';
import { Container, List, SwipeRow } from 'native-base';
import * as firebase from 'firebase';
const screen = Dimensions.get('window');
export default class AddNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listViewData: [],
            present: false,
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
                            for (i = 0; i < data.length; i++) {
                                const newObj = {
                                    description: data[i].description,
                                    title: data[i].title,
                                    today: data[i].today
                                }
                                list = [...list, newObj];
                            }
                            this.setState({ listViewData: list, present: true });
                        });
                }
            })
    }
    renderContent = () => {
        if(this.state.present) {
            if (this.state.listViewData.length > 0) {
                return (
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
