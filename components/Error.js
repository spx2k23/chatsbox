import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // Import the MaterialIcons component

const CustomError = ({ title }) => {
    return (
        <View style={styles.container}>
            {/* Error Icon */}
            <MaterialIcons name="error-outline" size={48} color="#6200EE" style={styles.icon} />
            
            {/* Error Message */}
            <Text style={styles.errorText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    icon: {
        marginBottom: 10,
    },
    errorText: {
        color: '#6200EE',  // Theme color
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CustomError;
