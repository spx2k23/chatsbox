import { View ,Text, StyleSheet, TouchableOpacity} from "react-native"
import theme from "../../../../config/theme";


const VoteOption=({data,totalVotes})=>{
    
    const precentage=((data.votes/totalVotes)*100).toFixed(1);
    return(
        <TouchableOpacity style={styles.optBox}>
            <View  style={styles.optdata}>
            <View style={styles.opt}>
                <View style={styles.circle}> </View>
                <Text>{data.name}</Text>
            </View>
            <View style={[styles.optBar,{width:precentage+'%'}]}></View>
            </View>
            <Text style={styles.precentage}>{precentage+'%'}</Text>
        </TouchableOpacity>
    )
}
export default VoteOption;

const styles=StyleSheet.create({
    optBox:{
        marginTop:20,
        flexDirection:'row'
    },
    circle:{
        height:10,
        width:10,
        borderWidth:1,
        borderRadius:5,
        marginRight:10
    },
    opt:{
        flexDirection:'row',
    },
    precentage:{
        position:'absolute',
        right:5
    },
    optBar:{
        backgroundColor:theme.colors.basicColor,
        height:5,
        marginTop:5,
        borderRadius:5,
        
    },
    optdata:{
        width:'70%'
    }
})