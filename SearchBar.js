import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Text
} from 'react-native';

const SearchBar = ({onSearchChange, onGoBackInSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleSearchChange = (text) => {
      setSearchQuery(text);
      onSearchChange(text);
    };
    

  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchBarInput}
        placeholder="Search for a food item..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && searchQuery === '') {
              onGoBackInSearch(); // Call the prop function
            }
          }}
        returnKeyType="search" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row', // Arrange input and button horizontally
    alignItems: 'center', 
    padding: 5
  },
  searchBarInput: {
    flex: 1, // Allow input to take up available space
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, 
  },
  searchButton: {
    backgroundColor: 'black', // Customize button style
    padding: 10,
    borderRadius: 5,
  },
});

export default SearchBar;