import { View, Text } from "react-native";
import React from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from "../util/styles";

export default function MessageComponent({ item, user }) {
    // console.log({item})
    const isCurrentUser = item.user === user;
    return (
        <View>
            <View
                style={
                    isCurrentUser
                        ? [styles.mmessageWrapper, { alignItems: "flex-end" }]
                        : styles.mmessageWrapper
                }
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                        name='person-circle-outline'
                        size={30}
                        color='black'
                        style={styles.mavatar}
                    />
                    <View
                        style={
                            isCurrentUser
                                ? [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                                : styles.mmessage
                        }
                    >
                        <Text>{item.text}</Text>
                    </View>
                </View>
                <Text style={{ marginLeft: 40 }}>{item.time}</Text>
            </View>
        </View>
    );
}
