import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Linking
} from 'react-native';
import io from 'socket.io-client';
import Entypo from 'react-native-vector-icons/Entypo';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isCancel,
    isInProgress,
    types,
} from 'react-native-document-picker';
import { urlRegex } from './util/regex';



const ChatScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = io('http://10.0.2.2:3000'); // Connect to Socket.io server

    useEffect(() => {
        console.log('Connecting to Socket.io server...');
        socket.on('chat message', (data) => {
            console.log('Message received:', data);
            setMessages(prevMessages => [...prevMessages, { message: data.message, currentTime: data.currentTime }]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('chat message', message);
            setMessage('');

        }
    };

    const ChatView = ({ item, index }) => {
        console.log({ item })
        const link = urlRegex.test(item.message) ? true : false;
        console.log({ link })
        return (
            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#000',
                    backgroundColor: Colors.dark,
                    marginVertical: 4,
                    elevation: 4,
                    width: '60%',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10
                }}
            >
                {link === true ?
                    <TouchableOpacity onPress={() => Linking.openURL(item?.message)}>
                        <Text style={{ color: 'blue' }}>{item.message}</Text>
                    </TouchableOpacity> :
                    <Text style={{ color: '#fff' }}>{item.message}</Text>
                }
                <Text style={{
                    color: '#fff',
                    paddingRight: 2,
                    fontSize: 16,
                    textAlign: 'right',
                }}>
                    {item.currentTime}
                </Text>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={ChatView}
                keyExtractor={(item, index) => index.toString()}
            // ListFooterComponentStyle={{
            //     backgroundColor: 'red',
            //     height: 80,
            //     position:'absolute',
            //     bottom:10
            // }}


            />
            <View style={{ backgroundColor: '#000' }}>
                <View style={styles.inputContainer}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        borderRadius: 15,
                        paddingRight: 8,
                        backgroundColor: '#333',
                        elevation: 4,
                    }}>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type your message..."
                            placeholderTextColor={'#fff'}
                            multiline={true}
                        />
                        <Entypo name='attachment' color={'#fff'} size={20}
                            onPress={() => console.log('attchment pressed')}
                            style={{
                                alignSelf: 'center',
                            }} />
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#333',
                            borderRadius: 15,
                            paddingHorizontal: 20,
                            height: 50,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 4,
                        }}
                        onPress={sendMessage}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 16, fontWeight: 'bold', color: '#fff'
                        }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.darker,
    },
    inputContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal:4
    },
    input: {
        flex: 1,
        padding: 8,
        color: '#fff',
    },
});

export default ChatScreen;
