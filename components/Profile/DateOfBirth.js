// DatePickerComponent.js
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { View, Text, Button, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateOfBirth = ({isEditing,selectedDate, setSelectedDate}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showDatePicker = () => {
    setIsVisible(true);
  };

  const hideDatePicker = () => {
    setIsVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  const datestaticstyles=StyleSheet.create({
    date:{
      borderBottomWidth: isEditing?2:0,
      borderBottomColor: '#6200EE',
    }
  })

  const formattedDate = selectedDate.toLocaleDateString(); // Format the date as needed

  return (
    <View style={[styles.container,datestaticstyles.date]}>
      <Text style={styles.dateText}>{formattedDate}</Text>
     {isEditing&&<TouchableOpacity onPress={showDatePicker} style={styles.calender} >
        <MaterialIcons name='calendar-month' size={24} color="#6200EE"/>
      </TouchableOpacity>}
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    width:'70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:50
  },
  dateText: {
    fontSize: 16, // You can adjust the font size as needed
    marginBottom: 10,
    letterSpacing:Platform.OS==='android'?2:4
  },
  calender:{
    marginLeft:20,
    marginBottom:8
  },
});

export default DateOfBirth;