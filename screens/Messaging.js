import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import socket from "../util/socket";
import MessageComponent from "../component/MessageComponent";
import { styles } from "../util/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Messaging = ({ route, navigation }) => {
	const [user, setUser] = useState("");
	const { name, id } = route.params;
	const flatListRef = useRef(null);
	const [chatMessages, setChatMessages] = useState([]);
	const [message, setMessage] = useState("");
	const getUsername = async () => {
		try {
			const value = await AsyncStorage.getItem("username");
			if (value !== null) {
				setUser(value);
			}
		} catch (e) {
			console.error("Error while loading username!");
		}
	};
	useLayoutEffect(() => {
		navigation.setOptions({ title: name });
		getUsername();
		socket.emit("findRoom", id);
		socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
		// socket.on("foundRoom", (roomChats) => setChatMessages(prevMessages=>[...prevMessages,roomChats]));

	}, []);

	// useEffect(() => {
	// 	socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
	// }, [socket]);
	useEffect(() => {
		console.log('Connecting to Socket.io server...');
		socket.on('foundRoom', (data) => {
			console.log('Message received:', data);
			// setChatMessages(prevMessages => [...prevMessages, data]);
			setChatMessages(data);

		});
		scrollToBottom();
		return () => {
			socket.disconnect();
		};
	}, []);

	const handleNewMessage = () => {
		const hour =
			new Date().getHours() < 10
				? `0${new Date().getHours()}`
				: `${new Date().getHours()}`;

		const mins =
			new Date().getMinutes() < 10
				? `0${new Date().getMinutes()}`
				: `${new Date().getMinutes()}`;

		if (user) {
			socket.emit('newMessage', {
				message,
				room_id: id,
				user,
				timestamp: { hour, mins },
			});
			setMessage('');
		}
	};

	const scrollToBottom = () => {
		flatListRef.current.scrollToEnd({ animated: true });
	};

	return (
		<View style={styles.messagingscreen}>
			<View style={[styles.messagingscreen, { paddingVertical: 15, paddingHorizontal: 10 }]}>
				<FlatList
					ref={flatListRef}
					data={chatMessages}
					renderItem={({ item }) => (
						<MessageComponent item={item} user={user} />
					)}
					keyExtractor={(item, index) => index.toString()}
					onContentSizeChange={scrollToBottom}
				/>
			</View>

			<View style={styles.messaginginputContainer}>
				<TextInput
					style={styles.messaginginput}
					value={message}
					onChangeText={(value) => setMessage(value)}
				/>
				<Pressable
					style={styles.messagingbuttonContainer}
					onPress={handleNewMessage}
				>
					<Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default Messaging;
