import React, { useRef, useState, useEffect} from 'react';


import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    Animated,

    PixelRatio,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import DocViewer from '../Announcements/AnnouncementInputBoxComponents/DocViewer';
import { Image } from 'expo-image';
import ImagePreviewerModal from './ImagePreviewerModal';
import AudioPlayer from '../Announcements/AnnouncementInputBoxComponents/AudioPlayer';
import VideoPlayer from '../Announcements/AnnouncementInputBoxComponents/VideoPlayer';
import theme from '../../config/theme';


const isIosPlatform = Platform.OS === 'ios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ChatContentBox = ({ messages, currentUserID }) => {
    const flatListRef = useRef(null);
    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndices, setHighlightedIndices] = useState([]); // Array of matching indices
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1); // Index of the current match
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [overlayDate, setOverlayDate] = useState(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(windowHeight)).current;
    const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);




  





    // Handle date display based on visible items
    const handleViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const firstVisibleItem = viewableItems[0].item;
            const messageDate = new Date(firstVisibleItem.createdAt).toISOString().split('T')[0];
            const currentDate = new Date().toISOString().split('T')[0];

            setOverlayDate(messageDate === currentDate ? 'Today' : messageDate);
        }
    };
    const openImageModal = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
      };
    
      // Function to close the modal
      const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
       
      };

    // Render individual messages
    const renderMessage = ({ item, index }) => {
        const isHighlighted =
            currentMatchIndex !== -1 &&
            highlightedIndices[currentMatchIndex] === index;

        const isCurrentUser = item.user._id === currentUserID;
        // console.log(item.uri);
    
        
        return (
            <View
                style={[
                    styles.groupContainer,
                    isCurrentUser ? styles.rightAligned : styles.leftAligned,
                    isHighlighted && styles.highlightedContainer,
                    item.type==='audio'&&{width:'60%'},
                    item.type!=='text'&&{padding:2,width:'60%'}
                ]}
            >
                {item.type === 'text' && <Text style={{color:'#fff',maxWidth:'70%'}}>{item.text}</Text>}
                {item.type === 'image'&& <TouchableOpacity onPress={()=>openImageModal(item.uri)}><Image source={{ uri:item.uri}} style={styles.image} contentFit="cover" onError={() => console.log('Failed to load image')}/></TouchableOpacity>}
                {item.type === 'audio' && <AudioPlayer uri={item.uri}/>}
                {item.type==='document' && <DocViewer uri={item.documentData.uri} name={item.documentData.name}  isSent={isCurrentUser}/>}
                {item.type==='video'&&<VideoPlayer item={{uri:item.uri}}/>}
                {item.type === 'announcement' && <Text>Announcement</Text>}
            </View>
        );
    };

    // Handle scroll events
    const handleScroll = (event) => {
        const contentOffsetY = event.nativeEvent.contentOffset.y;

        if (contentOffsetY > 100 && searchQuery === '') {
            setShowSearchBox(true);
        } else {
            setShowSearchBox(false);
        }
    };

    // Handle search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setHighlightedIndices([]);
            setCurrentMatchIndex(-1);
            setNoResultsFound(false);
            return;
        }

        const matchingIndices = messages.reduce((indices, message, index) => {
            if (
                message.type === 'text' &&
                message.text.toLowerCase().includes(query.toLowerCase())
            ) {
                indices.push(index);
            }
            return indices;
        }, []);

        if (matchingIndices.length > 0) {
            setHighlightedIndices(matchingIndices);
            setCurrentMatchIndex(0);
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: matchingIndices[0],
                    animated: true,
                });
            }
            setNoResultsFound(false);
        } else {
            setHighlightedIndices([]);
            setCurrentMatchIndex(-1);
            setNoResultsFound(true);
        }
    };

    // Navigate to the next match
    const navigateNext = () => {
        if (highlightedIndices.length === 0) return;

        const nextIndex = (currentMatchIndex + 1) % highlightedIndices.length;
        setCurrentMatchIndex(nextIndex);

        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: highlightedIndices[nextIndex],
                animated: true,
            });
        }
    };

    // Navigate to the previous match
    const navigatePrevious = () => {
        if (highlightedIndices.length === 0) return;

        const previousIndex =
            (currentMatchIndex - 1 + highlightedIndices.length) % highlightedIndices.length;
        setCurrentMatchIndex(previousIndex);

        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index: highlightedIndices[previousIndex],
                animated: true,
            });
        }
    };

    // Reset highlighted indices when messages change
    useEffect(() => {
        setHighlightedIndices([]);
        setCurrentMatchIndex(-1);
        setNoResultsFound(false);
    }, [messages]);

    // Handle overlay animation
    useEffect(() => {
        if (overlayDate) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => setOverlayDate(null), 500);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [overlayDate, fadeAnim]);

    return (
        <>
         {(showSearchBox || searchQuery !== '') && (
                <View style={styles.searchBoxContainer}>
                     <MaterialIcons name="search" size={24} color="grey" />
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {highlightedIndices.length > 0 && (
                        <View style={styles.navigationButtons}>
                            <TouchableOpacity onPress={navigateNext}>
                                <MaterialIcons name="keyboard-arrow-up" size={24} color={theme.colors.basicColor} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigatePrevious}>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.colors.basicColor} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {noResultsFound && searchQuery !== '' && (
                        <Text style={styles.noResultsText}>Not found</Text>
                    )}
                </View>
            )}
        <View style={{ flex: 6 ,backgroundColor:'#fff'}} >
            
           
             <ImagePreviewerModal modalVisible={modalVisible} closeImageModal={closeImageModal} selectedImage={selectedImage}/>
            {/* FlatList */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => `group-${index}`}
                style={[styles.flatList, { flex: 1 }]} // Ensure FlatList fills its container
                contentContainerStyle={styles.contentContainer} // Preserve existing styles
                scrollEnabled={true}
                bounces={Platform.OS === 'ios' ? false : undefined}
                keyboardShouldPersistTaps="handled"
                onScroll={handleScroll}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                inverted={true}
                keyboardDismissMode="interactive" 
            />
            
            {/* Overlay Date */}
            {overlayDate && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.overlayText}>
            {overlayDate === 'Today' ? 'Today' : overlayDate}
          </Text>
        </Animated.View>
        
        )}
     </View>

        </>
    );
};

export default ChatContentBox;

// Styles
const styles = StyleSheet.create({
    chatContent: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: '#fff',
        marginBottom:100,
    },
    flatList: {
        width: windowWidth,
        paddinsg:20,
        paddingBottom:'20%'
    },
    groupContainer: {
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        margin: 10,
    },
    leftAligned: {
        alignSelf: 'flex-start',
        backgroundColor: 'grey',
    },
    rightAligned: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.basicColor,
    },
    highlightedContainer: {
        backgroundColor: 'red',
    },
    searchBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dad9d9',
       
        borderRadius: 8,
        // zIndex: 1,
        minHeight:'5%',
        paddingHorizontal:5,
        marginHorizontal:5,
    },
    searchBox: {
        flex: 1,
        marginLeft: 10,
        fontSize: PixelRatio.getFontScale() * 16,
       
    },
    noResultsText: {
        color: 'red',
        marginLeft: 10,
    },
    navigationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    overlay: {
        position: 'absolute',
        bottom:isIosPlatform?20:5,
        left: '35%',
        right: 0,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'grey',
    },
    overlayText: {
        fontSize: 14,
        color: theme.colors.basicColor,
    },
    image: {
        minWidth:200,
        minHeight:200,
        borderRadius:10
      },
    
});