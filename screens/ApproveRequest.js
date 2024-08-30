import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { useLazyQuery, gql } from '@apollo/client';

const ApproveRequest = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  }
});

export default ApproveRequest;
