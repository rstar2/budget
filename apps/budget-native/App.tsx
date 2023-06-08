import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "ui";

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Budget</Text>
            <Button
                onClick={() => {
                    console.log("Pressed!");
                    alert("Pressed");
                }}
                text="Boo"
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        fontWeight: "bold",
        marginBottom: 20,
        fontSize: 36,
    },
});
