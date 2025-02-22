import { StyleSheet,Modal,View,TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";

const ImagePreviewerModal=({selectedImage,modalVisible,closeImageModal})=>{

    return(
    <Modal visible={modalVisible} transparent={true} onRequestClose={closeImageModal}>
        <TouchableWithoutFeedback onPress={closeImageModal}>
             <View style={styles.modalContainer} >
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullSizeImage}
            contentFit="contain"
            onError={(error) => console.log('Failed to load image:', error.nativeEvent.error)}
          />
        </View>
        </TouchableWithoutFeedback>
      </Modal>);
}
export default ImagePreviewerModal;

const styles=StyleSheet.create({
    fullSizeImage: {
        width:'100%',
        height:'100%',
        alignSelf:'center',
        borderRadius:8,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }
});