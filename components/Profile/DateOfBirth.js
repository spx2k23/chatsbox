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
      <Text style={isEditing?styles.textField:styles.iseditTextField}>{formattedDate}</Text>
     {isEditing&&<TouchableOpacity onPress={showDatePicker} style={styles.calender} >
        <MaterialIcons name='calendar-month' size={24} color="#6200EE"/>
      </TouchableOpacity>}
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate}
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
    marginLeft:50,
    marginBottom:20
  },
  textField: {
    textAlign: 'center',
    flex: 1,
    marginTop: 10,
    paddingBottom: 2,
    letterSpacing:Platform.OS==='android'?2:4,
    color:'#6200EE',
  },
  calender:{
    marginLeft:20,
    marginBottom:8
  },
iseditTextField:{
  textAlign: 'left',
  flex: 1,
  marginTop: 5,
  paddingBottom:2,
  letterSpacing:Platform.OS==='android'?2:4,
  color:'#6200EE',
},
});

export default DateOfBirth;