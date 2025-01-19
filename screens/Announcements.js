import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, Dimensions, Platform, Animated } from 'react-native';
import AnnouncementsInputBox from '../components/Announcements/AnnouncementsInputBox';
import AnnouncementCard from '../components/Announcements/AnnouncementCard';
import AnnouncementInputContainer from '../components/Announcements/AnnouncementInputBoxComponents/AnnouncementInputContainer';
import { MaterialIcons } from '@expo/vector-icons';
import { Easing } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight=Dimensions.get('window').height;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]); // Original list of announcements
  const [showContainer, setShowContainer] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);  // Track visibility of search box
  const [searchQuery, setSearchQuery] = useState(''); // State to track search input
  const [highlightedIndex, setHighlightedIndex] = useState(null); // Track the index of the highlighted announcement
  const [noResultsFound, setNoResultsFound] = useState(false); // Track if no results were found
  const [overlayDate, setOverlayDate] = useState(null); // State for bottom overlay date
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animated value for opacity
  const slideAnim = useRef(new Animated.Value(windowHeight)).current;
  const flatListRef = useRef(null); // FlatList ref to scroll to a specific 
  const timeoutRef = useRef(null);

  // Viewable items change handler
  const handleViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0].item[0]; // Get the first visible announcement's date
      const announcementDate = new Date(firstVisibleItem.date).toISOString().split('T')[0];
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

      if (announcementDate === currentDate) {
        setOverlayDate('Today'); // Show "Today" if the date matches today's date
      } else {
        setOverlayDate(announcementDate); // Show the actual date if it's not today's date
      }
    }
  };

  // Initialize viewableItemsChanged callback once
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50, // Viewable if 50% of the item is visible
  });

  

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    // Show search box after scrolling 100 units, but only hide if searchQuery is empty
    if (contentOffsetY > 100 && searchQuery === '') {
      setShowSearchBox(true);

      // Reset timeout and set it to hide the search box after 2 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear previous timeout
      }

      timeoutRef.current = setTimeout(() => {
        setShowSearchBox(false); // Hide the search box after 2 seconds of inactivity
      }, 3000);
    } else {
      setShowSearchBox(false);
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setHighlightedIndex(null); // Reset highlight when the search query is cleared
      setNoResultsFound(false); // Reset no results found state
      return;
    }

    // Search through the announcements
    const foundIndex = announcements.findIndex((group, index) =>
      group.some((announcement) => {
        // Search only 'text' type announcements
        return (
          announcement.type === 'text' && 
          announcement.content.toLowerCase().includes(query.toLowerCase())
        );
      })
    );

    if (foundIndex !== -1) {
      setHighlightedIndex(foundIndex); // Set index of matched announcement
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: foundIndex, animated: true }); // Scroll to the matched item
      }
      setNoResultsFound(false); // Reset no results found state
    } else {
      setHighlightedIndex(null); // No match, clear highlight
      setNoResultsFound(true); // Set no results found state
    }
  };

  // If announcements are updated, reset the highlighted index
  useEffect(() => {
    setHighlightedIndex(null);
    setNoResultsFound(false); // Reset 'not found' message on data change
  }, [announcements]);

  // UseEffect to handle overlay timeout (hide after 3 seconds)
  useEffect(() => {
    if (overlayDate) {
      // Fade in the overlay when the date is set
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Fade-in duration
        useNativeDriver: true,
      }).start();

      // Hide the overlay after 3 seconds
      const timer = setTimeout(() => {
        // Fade out the overlay before hiding
        Animated.timing(slideAnim, {
          toValue: 0,                // Move to the center (0 position)
          duration: 1000,            // Duration (1000ms)
          easing: Easing.ease,       // Easing function
          useNativeDriver: true,     // Native driver for performance
        }).start();

        // Set overlayDate to null after the fade-out completes
        setTimeout(() => setOverlayDate(null), 500); // Delay overlayDate reset to match the fade-out duration
      }, 1000); // 3000ms = 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when overlayDate changes
    }
  }, [overlayDate, fadeAnim]);


  const bottomloadfirst = React.createRef();

  // Scroll to bottom when the list is rendered
  useEffect(() => {
    if (bottomloadfirst.current) {
      bottomloadfirst.current.scrollToEnd({ animated: false });
    }
  }, [announcements]);

  const renderMessage = ({ item: group, index }) => (
    <View
      style={[
        styles.groupContainer,
        highlightedIndex === index && styles.highlightedContainer, // Apply highlight if it's the matched item
      ]}
    >
      <AnnouncementCard group={group} />
    </View>
  );

  return (
    <View style={styles.containerAnnouncements}>
      <View style={styles.messageBox}>
        {/* Conditionally show the search box */}
        {(showSearchBox || searchQuery !== '') && (
          <View style={styles.searchBoxContainer}>
            <MaterialIcons name='search' size={24} color={'grey'}/>
            <TextInput
              style={styles.searchBox}
              placeholder="Search announcements..."
              value={searchQuery}
              onChangeText={handleSearch} // Update search query
            />
            {noResultsFound && searchQuery !== '' && (
              <Text style={styles.noResultsText}>Not found</Text> // Display "Not found" message
            )}
          </View>
        )}

        {showContainer && (
          <AnnouncementInputContainer 
            setShowContainer={setShowContainer} 
            tempData={tempData} 
            setTempData={setTempData}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
          />
        )}

        {/* FlatList to render all announcements */}
        <FlatList
          ref={flatListRef}
          data={announcements}
          renderItem={renderMessage}
          keyExtractor={(group, index) => `group-${index}`}
          style={styles.flatList}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}  // Detect scroll position
          onViewableItemsChanged={handleViewableItemsChanged} // Set onViewableItemsChanged statically
          viewabilityConfig={viewabilityConfig.current} // Static viewability config
        />
      </View>

      {/* Announcement Input Box */}
      <AnnouncementsInputBox 
        showContainer={showContainer} 
        setShowContainer={setShowContainer}
        tempData={tempData} 
        setTempData={setTempData} 
      />

      {/* Overlay Date at the Bottom */}
      {overlayDate && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.overlayText}>
            {overlayDate === 'Today' ? 'Today' : overlayDate}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerAnnouncements: {
    flex: 1,
  },
  flatList: {
    flex: 1,
    width: windowWidth,
    margin: 0,
  },
  messageBox: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  groupContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius:12,
    width: windowWidth * 0.90,
    borderWidth: Platform.OS === 'android' ? 0.7 : 0.5,
    borderColor: 'grey',
    zIndex: -10,
    paddingBottom:5
  },
  highlightedContainer: {
    backgroundColor: '#F9F7FD', // Light highlight color for matched items
    borderColor: '#6200EE', // Highlight border color
  },
  searchBoxContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
    flexDirection: 'row', // Make space for "Not found" message
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius:10,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#fff',
  },
  searchBox: {
    height: 40,
    flex: 1, // Take up available space
  },
  noResultsText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 10, // Space between the search box and the "Not found" message
  },
  overlay: {
    position: 'absolute',
    bottom: 65,
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
    color: '#6200EE',
  },
});

export default Announcements;
