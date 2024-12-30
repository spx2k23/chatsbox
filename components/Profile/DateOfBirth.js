import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateOfBirth = ({ isEditing, selectedDate, setSelectedDate }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Ensure selectedDate is a valid date object or default to current date if invalid
  const dob = selectedDate && !isNaN(Number(selectedDate)) ? new Date(Number(selectedDate)) : new Date();
  const showDatePicker = () => {
    setIsVisible(true);
  };

  const hideDatePicker = () => {
    setIsVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date); // Send the selected date back to the parent component
    hideDatePicker();
  };

  // Format the date for display (you can change this to any other format)
  const formattedDate = dob.toLocaleDateString('en-GB'); // Change locale or format as needed

  return (
    <View style={[styles.container, isEditing && styles.date]}>
      <Text style={isEditing ? styles.textField : styles.isEditTextField}>
        {formattedDate}
      </Text>
      {isEditing && (
        <TouchableOpacity onPress={showDatePicker} style={styles.calendar}>
          <MaterialIcons name="calendar-month" size={24} color="#6200EE" />
        </TouchableOpacity>
      )}
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={dob} // Pass the date object directly to DateTimePickerModal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
    marginBottom: 20,
  },
  date: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
  },
  textField: {
    textAlign: 'center',
    flex: 1,
    marginTop: 10,
    paddingBottom: 2,
    letterSpacing: Platform.OS === 'android' ? 2 : 4,
    color: '#6200EE',
  },
  isEditTextField: {
    textAlign: 'left',
    flex: 1,
    marginTop: 5,
    paddingBottom: 2,
    letterSpacing: Platform.OS === 'android' ? 2 : 4,
    color: '#6200EE',
  },
  calendar: {
    marginLeft: 20,
    marginBottom: 8,
  },
});

export default DateOfBirth;
