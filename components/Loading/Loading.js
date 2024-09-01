import { ActivityIndicator, StyleSheet, View } from "react-native";



const Loading=()=>{
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'large'} color={'#6200EE'} />
        </View>
    );
}

export default Loading;

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
    }
});