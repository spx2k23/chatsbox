import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Text, View,StyleSheet,TextInput, TouchableOpacity, Platform } from "react-native";
import theme from "../config/theme";
import {ms,s,vs} from 'react-native-size-matters';
const SettingsOrgCode =()=>{
    const inputs = useRef([]);
    const [newCode,setNewCode]=useState('');
    const [currentCode,setCurrentCode]=useState('123abc');
    const [codeChangeSucess,setCodeChangeSucess]=useState(false);
    const [changeFlag,setChangeFlag]=useState(false);
    const handleInputChange = (text, index) => {
        setNewCode(newCode+text);
        if (text.length === 1) {
          // Move to the next input
          if (index < 5) {
            inputs.current[index + 1].focus();
          }
        } else if (text.length === 0 && index > 0) {
          inputs.current[index - 1].focus();
        }
      };
      const handleCodeChange=()=>{
        //check if newCode available , if so change and setCodeChangeSucess to true
        setCodeChangeSucess(true);
        setChangeFlag(true);

      };
    return(
        <View style={styles.container}> 
            <MaterialCommunityIcons name="swap-horizontal" size={ms(24)} color={'grey'}/>
            <View style={styles.orgCodeBox}>
                <Text style={styles.title1}>Change Organization Code</Text>
                <Text style={styles.discription}>
                    <Text style={styles.note}>Note : </Text>
                    Only Numbers and Characters are permitted.
                </Text>
                <Text style={styles.title}>Current Code</Text>
                <View style={styles.currCodeBox}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <Text key={index} style={[styles.currText, index === 2 ? styles.inputWithMargin : null]} >{currentCode.charAt(index)}</Text>
                ))}
                </View>
       
                <Text style={styles.title}>New Code</Text>
                <View style={styles.inputs}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={[styles.input, index === 2 ? styles.inputWithMargin : null]}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={text => handleInputChange(text, index)}
                    onFocus={() => inputs.current[index].setNativeProps({ selection: { start: 0, end: 1 } })}
                    />
                ))}
                <TouchableOpacity onPress={handleCodeChange}>
                    <Text style={styles.change}>Change</Text>
                </TouchableOpacity>
                </View>
                {changeFlag&&<View style={styles.aproval}>
                        <Text style={styles.aprovalText}>{codeChangeSucess?'Approved':'Already Exists'}</Text>
                        <MaterialIcons name={codeChangeSucess?'check-circle-outline':'warning-amber'} color={codeChangeSucess?'green':'red'} size={ms(16)}/>
                    </View>}
                   
            </View>
        </View>
    );
}
export default SettingsOrgCode;

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        paddingTop:vs(25),
        paddingLeft:s(20),
        backgroundColor:'#fff'
    },
    orgCodeBox:{
        marginLeft:15
    },
    title1:{
        fontSize:ms(17),
        fontWeight:'500',
        marginBottom:vs(5),
    },
    discription:{
        color:'grey',
         fontSize:ms(12)
    },
    note:{
        color:theme.colors.basicColor,
        fontSize:ms(14)
    },
    inputs:{
         flexDirection: 'row',
         gap:10,
         alignItems:'center'
    },
    input: {
        width:vs(18),
        height:vs(22),
        borderWidth: 1,
        borderColor: 'grey',
        padding:0,
        fontSize: ms(14),
        borderRadius: 5,
       textAlign:'center',
       fontWeight:Platform.OS==='android'?'800':'600'
      },
      inputWithMargin: {
        marginRight: s(10), // Add space after the 3rd input
      },
      change:{
        color:theme.colors.basicColor,
        fontWeight:'500',
        marginLeft:20,
        fontSize:ms(12)
      },
      currCodeBox:{
        flexDirection:'row',
        gap:s(6),
      },
      currText:{
        width:18,
        height:vs(22),
        fontSize:ms(15),
        fontWeight:600
      },
      title:{
        fontSize:ms(16),
        fontWeight:'600',
        marginBottom:vs(5),
        marginTop:vs(8)
    },
    aproval:{
        flexDirection:'row',
        alignItems:'center',
        height:vs(20),
        marginTop:5 
    },
    aprovalText:{
        fontSize:ms(12),
        marginRight:5,
        color:'grey'
    },
   
});