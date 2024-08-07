import storage from './Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from './SearchBar';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState, useEffect, useRef } from 'react'
import { Dropdown } from 'react-native-element-dropdown';


import {
  View,
  Share,
  TextInput,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'

var colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];

function getColor() {
  if (colors.length === 0) {
    // Reset the colors if all have been used
    colors = ['#C40C0C', '#FF6500', '#FF8A08', '#FFC100', '#00CC66', '#0A6847', '#7ABA78', '#756AB6', '#FF5BAE', '#6C3428', '#00224D'];
  }
  var index = Math.floor(Math.random() * colors.length);
  var color = colors[index];
  // Remove the selected color from the array
  colors.splice(index, 1);
  return color;
}




// const foodItems = [
//     { category: "Fruits", items: ["Apple", "Banana", "Orange"]},
//     { category: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"]},
//     // Add more categories and items
// ];

const FoodList = ({ filteredFoodItems, setFilteredFoodItems}) => {
  //react variables

  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false); 
  // Selected item state
  const [selectedItem, setSelectedItem] = useState(null);
  // Color state
  const [color, setColor] = useState(null);
  // Selected items state
  const [selectedItems, setSelectedItems] = useState({}); 
  // Formatted list state
  const [formattedList, setFormattedList] = useState([]); 
  // Show formatted list state
  const [showFormattedList, setShowFormattedList] = useState(false);
  // Colored categories state
  const [coloredCategories, setColoredCategories] = useState([]);
  // Input reference
  const inputRef = useRef(null);
  // Search history state
  const [searchHistory, setSearchHistory] = useState([]);
  // Is list dirty state
  const [isListDirty, setIsListDirty] = useState(true); 
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  // Selected items history state
  const [selectedItemsHistory, setSelectedItemsHistory] = useState([]);
  // Is modal visible state
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Bottom sheet offset
  const bottomSheetOffset = useRef(new Animated.Value(0)).current;
  // Button opacity
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  // Scroll timer reference
  const scrollTimer = useRef(null);
  // Edit modal visibility state
  const [editModalVisible, setEditModalVisible] = useState(false);
  // Editing item state
  const [editingItem, setEditingItem] = useState(null);
  // Edit input reference
  const editInputRef = useRef(null);
  // Edited item name state
  const [editedItemName, setEditedItemName] = useState('');
  // Is loading state
  const [isLoading, setIsLoading] = useState(true);
  const scrollPositionRef = useRef(0);

  
  


  const resetStorage = async () => {
    try {
      await AsyncStorage.removeItem('foodItems');
      console.log('Storage reset successfully');
    } catch (error) {
      console.error('Error resetting storage:', error);
    }
  };
  
  // Call the resetStorage function when you want to reset your storage

  useEffect(() => {

    const loadFoodItems = async () => {
      try {
        const storedItems = await storage.load({
          key: 'foodItems',
        });
        
        if (storedItems && storedItems.length > 0) {
          setFilteredFoodItems(storedItems);
          setColoredCategories(storedItems);
        } else {
          // If no stored items, initialize with your default data
          initializeFoodItems();
        }
      } catch (error) {
        // Handle error loading items, e.g., if the key doesn't exist yet
        console.error('Error loading food items:', error);
        initializeFoodItems(); 
      } finally {
        setIsLoading(false);
      }
    };

    const initializeFoodItems = () => {
      var foodData = [
        {
          "category": "Food",
          "items": [
            "Hot Dog",
            "Corn Dog",
            "Sausage",
            "Bread",
            "Churros",
            { "Pretzel": ["Regular", "Cheese"] },
          ],
          "color": "#000000"
        },
        {
          "category": "Beverages",
          "items": [
            "Water",
            "Small Water",
            "Sparkling Water",
            "Vitamin Water",
            "Red Bull",
            { "Gatorade": ["Red", "Lime", "Orange", "Blue"] },
            { "Soda": ["Coke", "Diet Coke", "Sprite", "Lemonade", "Fanta", "Pepsi", "Coke Zero", "Diet Pepsi"] },
            { "Snapple": ["Peach", "Lemon", "Kiwi", "Diet Peach", "Diet Lemon"] },
          ],
          "color": "#000000"
        },
        {
          "category": "Ice Cream",
          "items": [
            { "Magnum": ["2x Choc", "Almond", "Caramel", "Peanut B.", "Cookie Duet"] },
            { "Häagen-Dazs": ["Almond", "Dark Chocolate", "Coffee Almond"] },
            { "FrozFruit": ["Strawberry", "Coconut", "Mango", "Lime", "Pineapple"] },
            "Oreo Bar",
            "Klondike",
            "Strawberry Shortcake",
            "Vanilla Bar",
            "Giant Sandwich",
            "Chocolate Chip",
            "Cookie Sandwich",
            "Choc Éclair",
            "King Kone",
            "Birthday Cake",
            "Original",
            "Reeses",
          ],
          "color": "#000000"
        },
        {
          "category": "Popsicle",
          "items": [
            "Spiderman",
            "Spongebob",
            "Spacejam",
            "Sonic",
            "Batman",
            "Bomb Pop",
            "Ninja Turtle",
            "Snowcone",
          ],
          "color": "#000000"
        },
        {
          "category": "Frozen Cup",
          "items": [
            { "Minute Maid": ["Lemonade", "Strawberry"] }
          ],
          "color": "#000000"
        },
        {
          "category": "Nuts",
          "items": ["Peanuts", "Cashews", "Almonds", "Pecans"],
          "color": "#000000"
        },
        {
          "category": "Miscellaneous",
          "items": [
            "Onions",
            "Sauerkraut",
            "Mustard",
            "Ketchup",
            "Sterno",
            "Napkins",
            "Roll Towels",
            "Gloves",
            "Straws",
            "Foil",
            "Spoons",
            "Sugar",
            "Vanillin",
            { "Bags": ["Garbage Bags", "White Bags", "Brown Bags", "Black Bags"] }
          ],
          "color": "#000000"
        }
      ].map((category) => ({
        ...category,
        color: getColor(), 
      }))
      
      setFilteredFoodItems(foodData);
      setColoredCategories(foodData);
    };

    loadFoodItems();
  }, []);

  useEffect(() => {
    if (isListDirty) { 
      formatFoodList();
      setIsListDirty(false); // Reset the flag after updating
    }
  }, [isListDirty])


  const fadeOutButtons = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0,
      duration: 100, // Adjust fade-out duration
      useNativeDriver: true,
    }).start();
  };

  // Function to fade in the buttons
  const fadeInButtons = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 100,  // Adjust fade-in duration
      useNativeDriver: true,
    }).start();
  };

  
  


  const handleLongPressItem = (item) => {
      // setEditingItem(item);
      // setEditedItemName(item);
      // setEditModalVisible(true);
  };
  
  
  




  const EditModal = () => {

    const areObjectsDeepEqual = (obj1, obj2) => {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
    
      if (keys1.length !== keys2.length) {
        return false;
      }
    
      for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
    
        // Recursively check for nested objects
        if (typeof val1 === 'object' && typeof val2 === 'object' && 
            !Array.isArray(val1) && !Array.isArray(val2) 
        ) {
          if (!areObjectsDeepEqual(val1, val2)) {
            return false;
          }
        } else if (val1 !== val2) {
          return false;
        }
      }
    
      return true;
    };
      
    useEffect(() => {
      // Show the keyboard when the modal becomes visible
      if (editModalVisible) {
        setTimeout(() => { // Use setTimeout to ensure TextInput is rendered
          editInputRef.current.focus(); // This will automatically open the keyboard
        });
      }
    }, []);
    //  // State for edited item name

    const [editedItemName, setEditedItemName] = useState('')
    
    const handleSaveEdit = () => {
      if (editedItemName.trim() !== '') {
        setFilteredFoodItems(prevItems => {
          const updatedItems = prevItems.map(category => {
            return {
              ...category,
              items: category.items.map(foodItem => {
                if (typeof foodItem === 'string' && foodItem === editingItem) {
                  // Updating a regular item
                  return editedItemName;
                } else if (typeof foodItem === 'object' && typeof editingItem === 'string') {
                  // Updating a subcategory item 
                  const [key, values] = Object.entries(foodItem)[0];
                  const updatedValues = values.map(subItem => 
                    subItem === editingItem ? editedItemName : subItem 
                  );
                  return { [key]: updatedValues }; 
                } else {
                  // No changes to this foodItem 
                  return foodItem;
                }
              }),
            };
          });
    
          // Save updated items to AsyncStorage
          storage.save({
            key: 'foodItems',
            data: updatedItems,
            expires: null,
          }).then(() => {
            setColoredCategories(updatedItems);
            console.log('Food items saved to AsyncStorage after editing');
          }).catch(error => {
            console.error('Error saving food items to AsyncStorage after editing:', error);
          });
    
          
          return updatedItems;
        });
    
        setEditingItem(null);
        setEditModalVisible(false);
      }
    };
    
  
    const handleDeleteItem = () => {
      setFilteredFoodItems((prevItems) => {
        const updatedFoodItems = prevItems.map((category) => {
          return {
            ...category,
            items: category.items.reduce((acc, item) => {
              if (typeof item === 'string') {
                // Regular item: delete if it matches editingItem
                if (item !== editingItem) {
                  acc.push(item);
                }
              } else if (typeof item === 'object') {
                const [subcatName, subcatItems] = Object.entries(item)[0];
  
                // Subcategory item: delete if it matches editingItem 
                const updatedSubItems = subcatItems.filter(subItem => subItem !== editingItem); 
  
                // Add the subcategory back only if it has items left
                if (updatedSubItems.length > 0) {
                  acc.push({ [subcatName]: updatedSubItems }); 
                }
              } else {
                // Keep other item types
                acc.push(item); 
              }
              return acc;
            }, []),
          };
        });
  
        // AsyncStorage Logic to save updatedFoodItems 
        storage.save({
          key: 'foodItems',
          data: updatedFoodItems,
          expires: null,
        }).then(() => {
          setColoredCategories(updatedFoodItems);
          console.log('Food items saved to AsyncStorage after deleting item');
        }).catch(error => {
          console.error('Error saving food items to AsyncStorage after deleting item:', error);
        });
  
        return updatedFoodItems;
      });
  
      setEditingItem(null);
      setEditModalVisible(false);
    };
    
  
    const handleChangeEditInput = (text) => {
      setEditedItemName(text);
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}

      >
        <TouchableWithoutFeedback
          onPress={() => setEditModalVisible(false)}
        >
        <View style={styles.centeredView}>
          <View style={styles.editModalView}>
              <Text style={styles.modalText}>{editingItem}</Text>
            <TextInput
              style={styles.EditInput}
              value={editedItemName}
              onChangeText={handleChangeEditInput}
              ref={editInputRef}
              placeholder="Enter new item name"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.saveButton]} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton]} // Red button for delete
                onPress={handleDeleteItem}
              >
                <Image source={require('./assets/trash-icon.png')} style={styles.trashIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
  const itemExists = (arr, newItem) => {
    try {
      return arr.some(item => {
        if (typeof item === 'string' && typeof newItem === 'string') {
          return item === newItem;
        } else if (typeof item === 'object' && typeof newItem === 'object') {
          // Correctly compare objects in subcategories
          const [[key1, values1]] = Object.entries(item);
          const [[key2, values2]] = Object.entries(newItem);
          return key1 === key2 && JSON.stringify(values1) === JSON.stringify(values2);
        }
        return false;
      });
    } catch (error) {
      console.error('Error in itemExists:', error);
      return false;
    }
  };

  const addFoodItem = async (category, newItem) => {
    console.log('Adding item:', newItem, 'to category:', category);

    setFilteredFoodItems(prevItems => {
      console.log('Previous foodItems:', prevItems);
      const categoryIndex = prevItems.findIndex(item => item.category === category);
      console.log('Category Index:', categoryIndex);

      if (categoryIndex !== -1) {
        if (!itemExists(prevItems[categoryIndex].items, newItem)) {
          // *** CORRECT WAY TO UPDATE updatedItems ***
          const updatedItems = [
            ...prevItems.slice(0, categoryIndex), // Items before the category
            { 
              ...prevItems[categoryIndex], // Existing category data
              items: [...prevItems[categoryIndex].items, newItem] // Add newItem to items
            },
            ...prevItems.slice(categoryIndex + 1) // Items after the category 
          ];
          // ****************************************

          console.log('Updated foodItems:', updatedItems);

          // **AsyncStorage Logic**
          storage.save({
            key: 'foodItems',
            data: updatedItems,
            expires: null,
          }).then(() => {
            setFilteredFoodItems(updatedItems);
            setColoredCategories(updatedItems);
            console.log('Food items saved to AsyncStorage');
          }).catch(error => {
            console.error('Error saving food items to AsyncStorage:', error);
          });

          return updatedItems; 
        } else { 
          console.log('Item already exists:', newItem);
        }
      } else {
        console.log('Category not found:', category);
      }

      return prevItems;
    });
  };

  

  const AddModal = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newItemInput, setNewItemInput] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // State for selected subcategory
    const [selectedInsertIndex, setSelectedInsertIndex] = useState(null);
    const [isFocusCategory, setIsFocusCategory] = useState(false);
    const [IsFocusSubcategory, setIsFocusSubcategory] = useState(false);
    const [isFocusPosition, setIsFocusPosition] = useState(false);




    useEffect(() => {
      if (filteredFoodItems && filteredFoodItems.length > 0) {
        setSelectedCategory(filteredFoodItems[0].category);
      }
    }, [filteredFoodItems]);

    

    const handleAddItem = () => {
      if (newItemInput.trim() !== '') {
        const categoryIndex = filteredFoodItems.findIndex(
          (item) => item.category === selectedCategory
        );
    
        if (categoryIndex !== -1) {
          setFilteredFoodItems((prevItems) => {
            const updatedItems = [...prevItems];
            const categoryToUpdate = updatedItems[categoryIndex];
    
            if (categoryToUpdate && categoryToUpdate.items) { // Check if items exists
              if (selectedSubcategory) {
                // Adding to a subcategory
                const subCategoryItem = categoryToUpdate.items.find(
                  (item) =>
                    typeof item === 'object' &&
                    Object.keys(item)[0] === selectedSubcategory
                );
    
                if (subCategoryItem) {
                  // Ensure subCategoryItem is found
                  const subItems = [...subCategoryItem[selectedSubcategory]];
                  const insertAt =
                    selectedInsertIndex !== null
                      ? selectedInsertIndex
                      : subItems.length;
                  subItems.splice(insertAt, 0, newItemInput);
    
                  // Update the items array within categoryToUpdate
                  categoryToUpdate.items = categoryToUpdate.items.map((item) => {
                    if (
                      typeof item === 'object' &&
                      Object.keys(item)[0] === selectedSubcategory
                    ) {
                      return { [selectedSubcategory]: subItems };
                    } else {
                      return item;
                    }
                  });
                } else {
                  console.warn(
                    `Subcategory '${selectedSubcategory}' not found in category '${selectedCategory}'`
                  );
                }
              } else {
                // Adding to the main category
                const insertAt =
                  selectedInsertIndex !== null
                    ? selectedInsertIndex
                    : categoryToUpdate.items.length;
                categoryToUpdate.items.splice(insertAt, 0, newItemInput);
              }
            } else {
              console.warn(`'items' array not found in category '${categoryToUpdate?.category || selectedCategory}'`);
            }

            storage.save({
              key: 'foodItems',
              data: updatedItems,
              expires: null,
            }).then(() => {
              setFilteredFoodItems(updatedItems);
              console.log('Food items saved to AsyncStorage');
            }).catch(error => {
              console.error('Error saving food items to AsyncStorage:', error);
            });
            return updatedItems;
          });
        } 

        setNewItemInput('');
        setIsModalVisible(false);
        setSelectedSubcategory(null); 
        setSelectedInsertIndex(null);
      }
    };

    // Function to handle selection of insertion index
    const handleIndexSelect = (index) => {
      if (selectedCategory !== filteredFoodItems[0].category) {
        setSelectedCategory(filteredFoodItems[0].category); // Only update if necessary
      }
      setSelectedInsertIndex(index);
    };

    return (
      <View style={{ flex: 1 }}>
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
              <Dropdown
                style={[styles.dropdown, isFocusCategory && { borderColor: '#0098FF' }]} // Add dropdown style here
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={filteredFoodItems.map(item => ({ label: item.category, value: item.category }))}
                labelField="label"
                valueField="value"
                placeholder={!isFocusCategory ? 'Select category' : '...'} // Update placeholder
                searchPlaceholder="Search..."
                value={selectedCategory}
                onFocus={() => setIsFocusCategory(true)} 
                onBlur={() => setIsFocusCategory(false)}
                onChange={item => {
                  setSelectedCategory(item.value);
                  setIsFocusCategory(false); 
                }}
                
              />
                {selectedCategory && (
                  <Dropdown
                  style={[styles.dropdown, IsFocusSubcategory && { borderColor: '#0098FF' }]} // Add dropdown style here
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={filteredFoodItems
                    .find(item => item.category === selectedCategory)
                    .items.filter(item => typeof item === 'object')
                    .map(item => ({ label: Object.keys(item)[0], value: Object.keys(item)[0] }))}
                  labelField="label"
                  valueField="value"
                  placeholder={!IsFocusSubcategory ? 'Select subcategory' : '...'} // Update placeholder
                  searchPlaceholder="Search..."
                  value={selectedSubcategory}
                  onFocus={() => setIsFocusSubcategory(true)} 
                  onBlur={() => setIsFocusSubcategory(false)}
                  onChange={item => {
                    setSelectedSubcategory(item.value);
                    setIsFocusSubcategory(false); 
                  }}
                  
                />
                )}
  
                
                {selectedCategory && (
                <Dropdown
                  style={[styles.dropdown, isFocusPosition && { borderColor: '#0098FF' }]} 
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={(() => {
                    const categoryItems = filteredFoodItems.find(
                      (item) => item.category === selectedCategory
                    ).items;

                    const targetItems = selectedSubcategory
                      ? categoryItems.find(
                          (item) =>
                            typeof item === 'object' &&
                            Object.keys(item)[0] === selectedSubcategory
                        )
                        ? categoryItems.find(
                            (item) =>
                              typeof item === 'object' &&
                              Object.keys(item)[0] === selectedSubcategory
                          )[selectedSubcategory]
                        : categoryItems
                      : categoryItems;

                    // Create data for position dropdown
                    const positionData = [];
                    for (let i = 1; i <= targetItems.length; i++) {
                      if (i === targetItems.length) {
                        positionData.push({ label: 'End', value: i });
                      } else {
                        const itemName = typeof targetItems[i - 1] === 'object'
                          ? Object.keys(targetItems[i - 1])[0]
                          : targetItems[i - 1];
                        positionData.push({ 
                          label: `Before ${itemName}`, 
                          value: i 
                        });
                      }
                    }
                    return positionData;
                  })()}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocusPosition ? 'Select Position' : '...'}
                  value={selectedInsertIndex} 
                  onFocus={() => setIsFocusPosition(true)}
                  onBlur={() => setIsFocusPosition(false)}
                  onChange={(item) => {
                    setSelectedInsertIndex(item.value);
                    setIsFocusPosition(false);
                  }}
                />
              )}
  
                <TextInput
                  style={styles.AddInput}
                  placeholder="Enter new item"
                  value={newItemInput}
                  onChangeText={setNewItemInput}
                />
                <TouchableOpacity style={styles.AddButton} onPress={handleAddItem}>
                  <Text style={styles.textStyle}>Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  };




  const AddButton = () => {
    return (
      <TouchableOpacity 
        style={[styles.floatingButton, styles.addButton]} 
        onPress={() => {
         setIsModalVisible(true)
        }}
      >
        <Image source={require('./assets/add-icon.png')} style={styles.addButtonIcon} />
      </TouchableOpacity>
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      // Reset to the full list
      setFilteredFoodItems([...coloredCategories]); 
    } else {
      const filteredItems = coloredCategories.map((category) => {
        const matchingItems = category.items.filter((item) => {
          if (typeof item === 'object') {
            // Check subcategory name and items
            const [subcatName, subcatItems] = Object.entries(item)[0];
            return subcatName.toLowerCase().includes(query.toLowerCase()) || 
                   subcatItems.some(subItem => subItem.toLowerCase().includes(query.toLowerCase()));
          } else {
            // Regular item - check if it matches
            return item.toLowerCase().includes(query.toLowerCase());
          }
        });

        // Only include the category if it has matching items
        if (matchingItems.length > 0) {
          return { ...category, items: matchingItems };
        } else {
          return null; // This will remove the category from the filtered results
        }
      }).filter(Boolean); // Remove null entries

      setFilteredFoodItems(filteredItems);
    }
  };

  const handleGoBackInSearch = () => {
    setSearchHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1);
      const previousQuery = newHistory[newHistory.length - 1] || '';
  
      // Update searchQuery and apply the filter immediately 
      setSearchQuery(previousQuery);
      handleSearchChange(previousQuery);
  
      // Return the updated history
      return newHistory;
    });
  };

  const handleItemPress = (food, itemColor) => {
    const foodName = typeof food === 'object' ? Object.keys(food)[0] : food;

    setColor(itemColor); 
    setSelectedItem(foodName);
    setModalVisible(true); // Open the QuantityModal
  }; 

  const FoodItem = React.memo(({ food, color, onItemPress, onItemLongPress, style, onEditPress}) => {
    return ( 
      <TouchableOpacity
        style={[style, { backgroundColor: color }]}
        onPress={onItemPress}
      >
        <View style={styles.itemContentContainer}> 
        <Text style={styles.item}>{typeof food === 'object' ? Object.keys(food)[0] : food}</Text>
        <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
          <Image source={require('./assets/edit-icon.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      </TouchableOpacity>
    );
  }); 

  const FoodFlatList = () => {
    const [isScrolling, setIsScrolling] = useState(false); // Track scrolling state
    const flatListRef = useRef(null); // Scroll position reference
    

    const handleEditPress = (foodItem) => {
      let itemToEdit = foodItem; // Assume it's a regular item

      if (typeof foodItem === 'object') {
        // It's a subcategory, so extract the correct item
        const [subcategoryKey, subcategoryValues] = Object.entries(foodItem)[0];
        itemToEdit = subcategoryValues.find(subItem => subItem === editingItem); // Find the matching subitem
      }
    
      console.log("Edit item:", itemToEdit); // Should now log "Regular"
      setEditingItem(itemToEdit);
      setEditedItemName(itemToEdit);
      setEditModalVisible(true);
    };

    const handleScroll = () => {
      fadeOutButtons();
    };

    const handleScrollBegin = () => {
      setIsScrolling(true);
      fadeOutButtons(); // Fade out when scrolling starts 
    };

    const handleScrollEnd = (event) => {
      setIsScrolling(false);
      fadeInButtons(); // Fade in when scrolling ends
      scrollPositionRef.current = event.nativeEvent.contentOffset.y;
    };

  
    

    const renderItem = ({ item }) => (
      <View>
        <Text style={[styles.category, { color: item.color, borderColor: item.color }]}>
          {item.category}
        </Text>
  
        {item.items.map((food, index) => {
          const foodKey = typeof food === 'object'
            ? `${item.category}-${Object.keys(food)[0]}`
            : `${item.category}-${food}`;
  
          if (typeof food === 'object') {
            // This is a subcategory - render nested items
            const [brand, subcategories] = Object.entries(food)[0];
  
            return (
              <View key={foodKey}>
                <Text style={[styles.brand, { color: item.color }]}>{brand}</Text>
                {subcategories.map((subcategory, subIndex) => ( 
                  <FoodItem
                    key={`${foodKey}-${subIndex}`} // Unique key for subcategory
                    food={subcategory} 
                    color={item.color}
                    onItemPress={() => handleItemPress(`${subcategory} ${brand}`, item.color)} // Pass brand
                    onItemLongPress={() => handleLongPressItem(subcategory)}
                    style={[styles.itemContainer, { marginLeft: 10 }]}
                    onEditPress={()=> handleEditPress(subcategory)}
                  />
                ))}
              </View>
            );
  
          } else {
            // This is a regular item
            return (
              <FoodItem
                key={foodKey} 
                food={food}
                color={item.color}
                onItemPress={() => handleItemPress(food, item.color)}
                onItemLongPress={() => handleLongPressItem(food)}
                style={[styles.itemContainer]} 
                onEditPress={()=> handleEditPress(food)}
              />
            );
          }
        })}
      </View>
    );

    return (
      <FlatList
        ref={flatListRef}
        data={filteredFoodItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false} // Optional: Hide scroll indicator
        keyExtractor={(item, index) => {
          const generateKey = (cat, itm, parentKeys = []) => {
            const keyParts = [...parentKeys, cat, typeof itm === 'object' ? Object.keys(itm)[0] : itm];
            return keyParts.join('-');
          };
        
          return item.category 
            ? generateKey(item.category, item.items, ['category'])
            : generateKey(null, item); 
        }}
        contentContainerStyle={styles.scrollContainer} 
        onScroll={handleScroll} // Add this line to handle scroll events
        onLayout={
          useEffect(() => {
            const restoreScroll = requestAnimationFrame(() => {
              if (flatListRef.current && scrollPositionRef.current > 0) {
                flatListRef.current.scrollToOffset({
                  offset: scrollPositionRef.current,
                  animated: false, 
                });
              }
            }); 
        
            // Cleanup: Cancel the scheduled frame if the component unmounts
            return () => cancelAnimationFrame(restoreScroll);  
          }, [scrollPositionRef])
        } // Restore scroll position when layout changes
        onMomentumScrollBegin={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
      />
    );
  };
  

  const QuantityModal = () => {
    useEffect(() => {
      // Show the keyboard when the modal becomes visible
      if (modalVisible) {
        setTimeout(() => { // Use setTimeout to ensure TextInput is rendered
          inputRef.current.focus(); // This will automatically open the keyboard
        }, 100); 
      }
    }, [modalVisible]);

    

    const [quantity, setQuantity] = useState(0)
    const [isValidQuantity, setIsValidQuantity] = useState(false)

    const handleConfirm = () => {
      if (quantity === null || quantity <= 0 || isNaN(quantity) || quantity.includes('.')) {
        setIsValidQuantity(false)
        return
      } else {
        setIsValidQuantity(true)
      }
      console.log(`Selected ${quantity} of ${selectedItem}`)
      
      setModalVisible(false) // Close modal after confirmation
      setSelectedItems((prevItems) => ({
        ...prevItems,
        [selectedItem]: parseInt(quantity), // Store quantity as a number
      }));
      setSelectedItemsHistory((prevHistory) => [...prevHistory, { ...selectedItems }]);
      setIsListDirty(true); 
    };

    const handleCloseModal = () => {
      setModalVisible(false)
    }

    const handleChangeQuantity = (quantity) => {
      if (quantity === null || quantity <= 0 || isNaN(quantity) || quantity.includes('.') || quantity.includes(' ')) {
        setIsValidQuantity(false)
        setQuantity(quantity)
        return
      }
      setIsValidQuantity(true)
      setQuantity(quantity)
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPress={() => {
              handleConfirm(); // Call handleConfirm on button press
              handleCloseModal(); // Close the modal after confirmation
            }}
          />
          <View style={styles.modalView}>
              <Text style={[styles.modalText]}>
                How much{' '}
                <Text style={[{ fontStyle: 'italic', fontWeight: 'bold', color: color}]}>
                  {selectedItem}
                </Text>
                ?
              </Text>
              <TextInput
                style={[styles.input, { borderColor: color }]}
                onChangeText={handleChangeQuantity}
                value={quantity}
                inputMode="numeric"
                keyboardType="number-pad"
                maxLength={2}
                onBlur={() => handleConfirm()}
                ref={inputRef}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={
                    isValidQuantity
                      ? [styles.button, { backgroundColor: color }]
                      : styles.buttonError
                  }
                  onPress={handleConfirm}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>
      </View>
    )
  }

  const FormattedListModal = () => {
    return (
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          {
            height: showFormattedList ? 'auto' : 50, // Partially visible height
            opacity: showFormattedList ? 1 : 1, // Slightly transparent when hidden 
          },
        ]}
      >
        <View style={styles.modalView}>
          <TouchableOpacity onPress={toggleBottomSheet} style={styles.modalButton}>
            <Text style={styles.modalTitle}>Today's List:</Text>
            </TouchableOpacity>
          {showFormattedList && ( // Conditionally render ScrollView
            <ScrollView style={styles.modalList}>
              <Text>{formattedList}</Text>
            </ScrollView>
          )}
        </View>
      </Animated.View>
    );
  };

  const toggleBottomSheet = () => {
    formatFoodList();
    setShowFormattedList(!showFormattedList);
  };

  // Animation for the bottom sheet
  useEffect(() => {
    Animated.timing(bottomSheetOffset, {
      toValue: showFormattedList ? -300 : 0, 
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [showFormattedList, bottomSheetOffset]); 

    
  const shareFoodList = async () => {
      try {
        const result = await Share.share({
          message: formattedList
        });
        setFormattedList([])
        
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
            console.log("Shared with activity type:", result.activityType);
          } else {
            // Shared successfully
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
          console.log("Share dismissed");
        }
      } catch (error) {
        Alert.alert('Empty Food List', 'Add food items before sharing.');
      }
  };
  
  const ShareListButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.shareButton]}
        onPress={shareFoodList}
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/share-icon.png')} // Replace with your share icon
          style={styles.floatingButtonIcon}
        />
      </TouchableOpacity>
    );
  };
    

  const UndoButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.undoButton]}
        onPress={handleUndo}
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/undo-icon.png')} 
          style={styles.undoButtonIcon}
        />
      </TouchableOpacity>
    );
  };

  const handleUndo = () => {
    if (Object.keys(selectedItems).length === 0) {
      setFormattedList([])
      // List is empty, show an alert or handle it as needed
      Alert.alert('Empty Food List', 'There are no items to undo.');
      return; // Exit the function early
    }
    // Get the last added item from selectedItems
    const lastSelectedItemKey = Object.keys(selectedItems)
      .reduce((a, b) => (selectedItems[a] > selectedItems[b] ? a : b));

    if (lastSelectedItemKey) {
      setSelectedItems((prevItems) => {
        // Create a copy of prevItems without modifying the original object
        const newItems = { ...prevItems }; 
        delete newItems[lastSelectedItemKey];
        return newItems;
      });
       // Update the formatted list
      setIsListDirty(true);
    }
    formatFoodList()
  };

  const formatFoodList = () => {
    const formattedItems = {};
  
    for (const category of filteredFoodItems) {
      for (const item of category.items) {
        if (typeof item === 'object') {
          const [brand, subcategories] = Object.entries(item)[0];
          formattedItems[brand] = formattedItems[brand] || {}; 
  
          if (category.category === 'Beverages') {
            // ***CORRECTED PACKING LOGIC START***
            let currentPack = {};
            let packTotal = 0;
  
            for (const subcategory of subcategories) {
              const itemName = `${subcategory} ${brand}`;
              let quantity = selectedItems[itemName] || 0;
  
              // Only process if there's a quantity MORE THAN 3
              if (quantity > 3) { 
                while (quantity > 0) {
                  const availableSpace = 24 - packTotal;
                  const amountToAdd = Math.min(quantity, availableSpace);
  
                  if (amountToAdd > 0) {
                    const abbreviation = subcategory.split(' ').map(word => word[0].toUpperCase()).join('.'); 
                    currentPack[abbreviation] = (currentPack[abbreviation] || 0) + amountToAdd;
                    packTotal += amountToAdd;
                    quantity -= amountToAdd;
                  }
  
                  if (packTotal === 24) {
                    formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || [];
                    formattedItems[brand]['Pack'].push(currentPack);
                    currentPack = {}
                    packTotal = 0;
                  }
                }
              } else if (quantity > 0) { // Handle quantities 1-3
                formattedItems[brand][subcategory] = `${quantity}`; 
              }
            }
  
            if (Object.keys(currentPack).length > 0) {
              formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || [];
              formattedItems[brand]['Pack'].push(currentPack);
            }
            // ***CORRECTED PACKING LOGIC END***
  
          } else { // For non-beverage categories
            const selectedSubcategories = []; 
            for (const subcategory of subcategories) {
              const itemName = brand === 'Soda' ? subcategory : `${subcategory} ${brand}`;
              const quantity = selectedItems[itemName] || 0;

              if (quantity > 0) {
                selectedSubcategories.push(`${subcategory.slice(0, 2).toUpperCase()}-${quantity}`);
              }
            }
            if (selectedSubcategories.length > 0) {
              formattedItems[brand] = { // Store as an object with a special key
                'compact': `(${selectedSubcategories.join(', ')})` 
              };
            }
          }
        } else { // For non-subcategory items
          const quantity = selectedItems[item] || 0;
          if (quantity > 0) {
            // formattedItems[category.category] = formattedItems[category.category] || {};
            formattedItems[item] = quantity;
          }
        }
      }
    }
  
   // Format the output list (without category headers)
   let formattedListArray = [];

   for (const [brandOrItem, quantityData] of Object.entries(formattedItems)) {
     if (typeof quantityData === 'object') { 
       let hasSelectedSubcategories = false;
 
       // Check for selected items in different formats
       if (quantityData['Pack'] && quantityData['Pack'].length > 0) {
         hasSelectedSubcategories = true; // It has a pack with items
       } else if (quantityData['compact']) {
         hasSelectedSubcategories = true; // It's in compact format
       } else {
         // Check within nested subcategories
         hasSelectedSubcategories = Object.values(quantityData).some((subCategoryData) => {
           return typeof subCategoryData === 'number' && subCategoryData > 0;
         });
       }
 
       // Only add the brand if there are selected items
       if (hasSelectedSubcategories) {
         formattedListArray.push(`${brandOrItem}:\n`);
 
         if (quantityData['Pack']) {
           quantityData['Pack'].forEach((packContent) => {
             const formattedPackItems = Object.entries(packContent)
               .map(([initial, qty]) => `${initial}-${qty}`)
               .join(', ');
             formattedListArray.push(`\t(${formattedPackItems})\n`);
           });
         } else if (quantityData['compact']) {
           formattedListArray.push(`\t${quantityData['compact']}\n`); 
         } else {
           // Handle other subcategories, only if quantity > 0
           for (const [subItem, qty] of Object.entries(quantityData)) {
             if (qty > 0) {
               formattedListArray.push(`\t${subItem}: ${qty}\n`);
             }
           }
         }
       }
 
     } else if (quantityData > 0) { 
       formattedListArray.push(`${brandOrItem}: ${quantityData}\n`); 
     }
   }
 
   setFormattedList(formattedListArray.join(''));
  };
  

  return (
    <View style={{ flex: 1 }}>
      <SearchBar onSearchChange={handleSearchChange} onGoBackInSearch={handleGoBackInSearch} /> 
      <FoodFlatList />
      <QuantityModal />
      <AddModal />
      <FormattedListModal />
      <EditModal />
      <AddButton />
      <UndoButton /> 
      <ShareListButton />
    </View>
  );
}





const styles = StyleSheet.create({
  category: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    paddingBottom: 2,
    borderBottomWidth: 2,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderRadius: 5, // Rounded corners for items
    padding: 5,
    marginVertical: 3.5,
    transparency: 0.5,
  },
  item: {
    color: '#fff', // White text color for better contrast
    fontSize: 16,
    marginRight: 10,
    // fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  button: {
    disabled: true,
    borderRadius: 5,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 10,
    paddingHorizontal: '40%',
    marginHorizontal: 5,
    backgroundColor: '#2196F3',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  saveButton: {
    justifyContent: 'center',
    margin:7,
    borderRadius: 5,
    borderTopEndRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#2196F3'
  },
  deleteButton: {
    margin:7,
    borderRadius: 5,
    borderBottomStartRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#ff5050'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15
  },
  modalText: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    margin: 6,
    borderWidth: 3,
    fontWeight: 'bold',
    borderColor: '#ccc',
    borderRadius: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    textAlign: 'center',
    paddingHorizontal: '45%',
    paddingVertical: 5
  },
  buttonError: {
    borderRadius: 5,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 10,
    paddingHorizontal: '40%',
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#ccc'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  brand: {
    fontSize: 18,
    padding: 10,
    paddingBottom: 3,
    fontWeight: 'bold',
    marginLeft: 10,
    
  },
  subItemContainer: {
    borderRadius: 5,
    padding: 5,
    marginVertical: 3.5,
    transparency: 0.5,
    marginLeft: 20,
  },
  scrollContainer: {
    flexGrow: 1, // Allow ScrollView to take up available space
    paddingBottom: 80
  },
  doneButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // ... (Modal styles)
  modalList: {
    padding: 5,
    minWidth: 150,
    maxHeight: 300,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
  },
  editModalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    textDecorationLine: 'underline',
    fontSize: 16,
    color: '#0098FF'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  AddInput: {
    textAlign: 'center',
    color: '#0098FF',
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 7,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#0098FF'
  },
  AddButton: {
    backgroundColor: '#0098FF',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 7,
    padding: 7,
  },
  modalContent: { // Style for the inner content area
    backgroundColor: 'white',
    minWidth: 250,
    padding: 20,
    borderRadius: 10, 
    elevation: 5, 
  },
  floatingButton: {
    position: 'absolute',
    marginTop: 50,
    right: 5,
    width: 60,
    height: 60,
    borderRadius: 30, 
    backgroundColor: 'white', 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  floatingButtonIcon: {
    width: 25, 
    height: 25,
    tintColor: '#0098FF', // Optional: Set icon color 
  },

  undoButtonIcon: {
    width: 25,
    height: 25,
    tintColor: '#0098FF'
  },

  undoButton: {
    bottom: 140,
  },
  shareButton: {
    bottom: 65, // Position in between the other two buttons
  },
  addButtonIcon: {
    width: 25,
    height: 25,
    tintColor: '#0098FF'
  },
  addButton: {
    bottom: 220,
  },
  bottomSheetTrigger: {
    borderRadius: 7,
    height: 100,
    width: 100,
  },
  bottomSheetContainer: {
    borderRadius: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  itemContentContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', // Add some padding to the FoodItem
  },
  editButton: {
    padding: 2,  // Add some padding to the button
  },
  editIcon: {
    width: 30, 
    height: 30, // Adjust color as needed
  },
  trashIcon: {
    width: 25,
    height: 25,
    tintColor: '#FFFFFF'
  },

  // Dropdown Styles 
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10, 
  },
  dropdownIcon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  }, 
})

export default FoodList
