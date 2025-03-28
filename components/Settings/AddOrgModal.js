import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View,Platform ,TextInput,TouchableOpacity} from "react-native";
import { useState ,useRef} from "react";
import theme from "../../config/theme";


const AddOrgModal=({addmodal,setaddmodal})=>{

    const inputs = useRef([]);
    const [joinCode,setJoinCode]=useState('');

    const handleInputChange = (text, index) => {
        setJoinCode(joinCode+text);
        if (text.length === 1) {
          // Move to the next input
          if (index < 5) {
            inputs.current[index + 1].focus();
          }
        } else if (text.length === 0 && index > 0) {
          inputs.current[index - 1].focus();
        }
      };

    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={addmodal}
        onRequestClose={() =>setaddmodal(false)} 
        >
                <TouchableWithoutFeedback onPress={()=>setaddmodal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Join Organization</Text>
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
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={styles.btn}>Join</Text>
                                    </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
        </Modal>
    );
}

export default AddOrgModal;

const styles =StyleSheet.create({
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(80, 80, 80, 0.6)', 
    },
    modalContent:{
        backgroundColor:'white',
        width:'60%',
        padding:20,
        borderRadius:5,
        alignItems:'center'
    },
    inputs:{
        flexDirection: 'row',
        gap:10,
        alignItems:'center'
   },
   input: {
    width:18,
    height:22,
    borderWidth: 1,
    borderColor: 'grey',
    padding:0,
    fontSize: 16,
    borderRadius: 5,
   textAlign:'center',
   fontWeight:Platform.OS==='android'?'800':'600'
  },
  inputWithMargin: {
    marginRight: 10, // Add space after the 3rd input
  },
  title:{
    fontSize:21,
    fontWeight:'600',
    marginBottom:20
  },
  btn:{
    backgroundColor:theme.colors.basicColor,
    color:'#fff',
    paddingHorizontal:25,
    borderRadius:8,
    marginTop:20
  }
});