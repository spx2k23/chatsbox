import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import VoteOptionEditor from './VoteOptionEditor';
import { IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const VoteInputEditor = ({ tempData, setTempData, index }) => {
    const [topic, setTopic] = useState(tempData[index].topic || '');
    const optionDatas = tempData[index].option || []; // Ensure option is an array

    const addNewOption = () => {
        const newOptions = [...optionDatas, { name: 'New Option', votes: 0 }];
        const newTempData = [...tempData];
        newTempData[index] = { ...newTempData[index], option: newOptions };
        setTempData(newTempData);
    };

    const handleTopicChange = (text) => {
        setTopic(text); // Update local state
        const newTempData = [...tempData];
        newTempData[index] = { ...newTempData[index], topic: text };
        setTempData(newTempData);
        console.log(tempData);
        
    };

    return (
        <View style={styles.voteBox}>
            <TextInput
                style={styles.topicInput}
                value={topic}
                onChangeText={handleTopicChange}
                placeholder="Enter the topic or question"
            />
            {optionDatas.map((item, idx) => (
                <VoteOptionEditor
                    key={idx}
                    index={index}
                    optionIndex={idx}
                    setTempData={setTempData}
                    tempData={tempData}
                    optionValue={item.name}
                />
            ))}
            <TouchableOpacity style={styles.addmore} onPress={addNewOption}>
                <IconButton icon="plus-circle-outline" iconColor="#6200EE" size={20} />
                <Text style={styles.addMoreText}>Add New Option</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VoteInputEditor;

const styles = StyleSheet.create({
    voteBox: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        margin: 8,
    },
    topicInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    addmore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    addMoreText: {
        marginLeft: 5,
        color: '#6200EE',
    },
});