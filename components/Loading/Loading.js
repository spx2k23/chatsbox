import { ActivityIndicator, StyleSheet, View } from "react-native";
import theme from "../../config/theme";

const Loading=()=>{
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={theme.colors.basicColor} />
        </View>
    );
}

export default Loading;

const styles=StyleSheet.create({
    container:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    }
});
