import React from 'react';
import { View,StyleSheet,FlatList } from 'react-native';

import RequestContainer from '../components/ChatList/RequestContainer';

const ApproveRequest = ({ navigation }) => {
  const data = [
    {
      name: 'Drago',
      email: 'drago@gmail.com',
      image: 'https://cdn.pixabay.com/photo/2023/01/06/12/38/ai-generated-7701143_640.jpg',
    },
    {
      name: 'Witcher',
      email: 'witcher@gmail.com',
      image: 'https://scontent.fmaa15-1.fna.fbcdn.net/v/t39.30808-1/306163119_395338919425615_8855944441524828272_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=Qc6QCKqPcf0Q7kNvgFOXnQv&_nc_ht=scontent.fmaa15-1.fna&oh=00_AYD3p5oBwrA3IbmzfB2EE1PLZDAk7YiOg4AGVjkm5dTAXQ&oe=66D865ED',
    },
  ];
 

  return (
    <View style={styles.container}>
      <FlatList 
        data={data}
        renderItem={({item})=><RequestContainer name={item.name} email={item.email} image={item.image} />}
        keyExtractor={(item) => item.email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
 
});

export default ApproveRequest;
