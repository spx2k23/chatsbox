import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import theme from '../../config/theme';
import Octicons from '@expo/vector-icons/Octicons';

const CreateGroupMemberBox = ({
  firstName,
  lastName,
  role,
  image,
  userId,
  id,
  isSelected,
  selectedMembers,
  setSelectedMembers,
}) => {
  const handleSelect = (id) => {
    if (isSelected) {
      // Remove the member if already selected
      setSelectedMembers((prevSelected) =>
        prevSelected.filter((memberId) => memberId !== id)
      );
    } else {
      // Add the member if not selected
      setSelectedMembers([...selectedMembers, id]);
    }
    
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => handleSelect(id)}>
        <View>
        <Image
          source={{ uri: `data:image/jpeg;base64,${image}` }}
          style={styles.image}
        />
        {isSelected && (
          <Octicons
            name="check-circle-fill"
            size={20}
            color={theme.colors.basicColor}
            style={styles.checkIcon}
          />
        )}
        </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{firstName} {lastName}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
       { !isSelected&&<Octicons
          name={ "plus"}
          size={24}
          color={theme.colors.basicColor}
          style={styles.icon}
        />}
   
    </TouchableOpacity>
  );
};

export default CreateGroupMemberBox;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    marginHorizontal:5,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  checkIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#555',
  },
  icon:{
    marginRight:40
  }
});