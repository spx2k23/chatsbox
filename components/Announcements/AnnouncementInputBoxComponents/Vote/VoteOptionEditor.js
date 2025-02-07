import React from 'react';
import { TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const VoteOptionEditor = ({ optionValue, index, optionIndex, setTempData, tempData }) => {
    const handleChange = (text) => {
        const newOptions = tempData[index].option.map((opt, i) =>
            i === optionIndex ? { ...opt, name: text } : opt
        );
        const newTempData = [...tempData];
        newTempData[index] = { ...newTempData[index], option: newOptions };
        setTempData(newTempData);
        
    };
//   console.log(optionValue);
  
    return (
        <View style={styles.optionBox}>
            <MaterialCommunityIcons name="circle-outline" size={20} color="grey" style={styles.circle} />
            <TextInput
                style={styles.optionInput}
                value={optionValue}
                onChangeText={handleChange}
                placeholder="Enter the option"
            />
        </View>
    );
};

export default VoteOptionEditor;

const styles = StyleSheet.create({
    optionBox: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    circle: {
        marginRight: 10,
    },
    optionInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});