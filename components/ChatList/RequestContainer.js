import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';

const RequestContainer = ({ name, email, image }) => {
  const handleApprove = () => {
    console.log(`Approved request for ${email}`);
    // Add your logic here for approving the request
  };

  const handleReject = () => {
    console.log(`Rejected request for ${email}`);
    // Add your logic here for rejecting the request
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={styles.buttonContainer}>
          <Button 
            title="Approve" 
            buttonStyle={styles.approveButton} 
            onPress={handleApprove} 
          />
          <Button 
            title="Reject" 
            buttonStyle={styles.rejectButton} 
            onPress={handleReject} 
          />
        </View>
      </View>
    </View>
  );
};

export default RequestContainer;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#6200EE',
    marginRight: 10,
    width:100
  },
  rejectButton: {
    backgroundColor: '#B0BEC5',
    width:100
  },
});
