import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';  // Import MaterialIcons for icons
import theme from '../config/theme';

const CustomDataNotFound = ({ title ,style}) => {
    return (
        <View style={[styles.container,style]}>
            {/* Data Not Found Icon */}
            <MaterialIcons name="search-off" size={48} color={theme.colors.basicColor} style={styles.icon} />

            {/* Data Not Found Message */}
            <Text style={styles.dataNotFoundText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',  // Light gray background to indicate no data found
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
    dataNotFoundText: {
        color: theme.colors.basicColor,  // Theme color
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CustomDataNotFound;
