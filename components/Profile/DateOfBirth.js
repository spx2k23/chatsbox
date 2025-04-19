import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from '../../config/theme';

const DateOfBirth = ({ isEditing, selectedDate, setSelectedDate }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const dob = selectedDate && !isNaN(Number(selectedDate)) ? new Date(Number(selectedDate)) : new Date();

  const handleChange = (event, date) => {
    setIsVisible(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formattedDate = dob.toLocaleDateString('en-GB');

  return (
    <View style={[styles.container, isEditing && styles.date]}>
      <Text style={isEditing ? styles.textField : styles.isEditTextField}>
        {formattedDate}
      </Text>
      {isEditing && (
        <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.calendar}>
          <MaterialIcons name="calendar-month" size={24} color={theme.colors.basicColor} />
        </TouchableOpacity>
      )}
      {isVisible && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()} // optional: prevent selecting future dates
        />
      )}
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
    borderBottomColor: theme.colors.basicColor,
  },
  textField: {
    textAlign: 'center',
    flex: 1,
    marginTop: 10,
    paddingBottom: 2,
    letterSpacing: Platform.OS === 'android' ? 2 : 4,
    color: theme.colors.basicColor,
  },
  isEditTextField: {
    textAlign: 'left',
    flex: 1,
    marginTop: 5,
    paddingBottom: 2,
    letterSpacing: Platform.OS === 'android' ? 2 : 4,
    color: theme.colors.basicColor,
  },
  calendar: {
    marginLeft: 20,
    marginBottom: 8,
  },
});

export default DateOfBirth;
