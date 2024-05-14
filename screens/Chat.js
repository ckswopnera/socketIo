import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import Modal from "../component/Modal";
import ChatComponent from "../component/ChatComponent";
import socket from "../util/socket";
import { styles } from "../util/styles";

const Chat = () => {
	const [visible, setVisible] = useState(false);
	const [rooms, setRooms] = useState([]);

	useLayoutEffect(() => {
		function fetchGroups() {
			fetch("http://10.0.2.2:4000/api")
				.then((res) => res.json())
				.then((data) => setRooms(data))
				.catch((err) => console.error(err));
		}
		fetchGroups();
	}, []);

	useEffect(() => {
		socket.on("roomsList", (rooms) => {
			setRooms(rooms);
		});
	}, [socket]);

	

	const handleCreateGroup = () => setVisible(true);
    const closeModal = () => setVisible(false);
    
	return (
		<SafeAreaView style={styles.chatscreen}>
			<View style={styles.chattopContainer}>
				<View style={styles.chatheader}>
					<Text style={styles.chatheading}>Chats</Text>
					<Pressable onPress={handleCreateGroup}>
						<Feather name='edit' size={24} color='green' />
					</Pressable>
				</View>
			</View>

			<View style={styles.chatlistContainer}>
				{rooms.length > 0 ? (
					<FlatList
						data={rooms}
						renderItem={({ item }) => <ChatComponent item={item} closeModal={closeModal}/>}
						keyExtractor={(item) => item.id}
					/>
				) : (
					<View style={styles.chatemptyContainer}>
						<Text style={styles.chatemptyText}>No rooms created!</Text>
						<Text>Click the icon above to create a Chat room</Text>
					</View>
				)}
			</View>
			{visible ? <Modal setVisible={setVisible} /> : <></>}
		</SafeAreaView>
	);
};

export default Chat;