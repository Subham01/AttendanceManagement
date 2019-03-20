import react, { Component } from 'react';
import Modal from 'react-native-modalbox';
import {
    Text,
    Dimensions,
    View
} from 'react-native';

const screen = Dimensions.get('window');

export default class NoticeModal extends Component {
    showAddModal = () => {
        this.refs.myModal.open();
    }
    render() {
        return(
            <Modal style={styles.container}
                ref={"myModal"}
                position='center'
                backdrop={true}
                onClosed={()=> {alert("Added")} }
            >
                <Text>Title: </Text>
            </Modal>
        );
    }
}
const styles = {
    container: {
        justifyContent: 'center',
        borderRadius: 0,
        shadowRadius: 10,
        width: screen.width - 80,
        height: 280
    }
};