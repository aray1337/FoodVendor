import storage from './Storage';
import SearchBar from './SearchBar';
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
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [color, setColor] = useState(null)
  const [selectedItems, setSelectedItems] = useState({}); // Store selected items and quantities
  const [formattedList, setFormattedList] = useState([]); // Store the formatted list string
  const [showFormattedList, setShowFormattedList] = useState(false);
  const [coloredCategories, setColoredCategories] = useState([]);
  const inputRef = useRef(null)
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListDirty, setIsListDirty] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemsHistory, setSelectedItemsHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Start with null
  const [newItemInput, setNewItemInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const bottomSheetOffset = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const scrollTimer = useRef(null);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const editInputRef = useRef(null)
  const [editedItemName, setEditedItemName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null); // Reference to the FlatList
  const scrollPositionRef = useRef(0); // Reference to store the scroll position







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
            "Sausage",
            "Bread",
            { "Pretzel": ["Regular", "Cheese"] },
            "Churros"
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
            { "Gatorade": ["Red", "Lime", "Orange", "Blue"] },
            { "Soda": ["Coke", "Diet Coke", "Sprite", "Lemonade", "Fanta", "Pepsi", "Coke Zero", "Diet Pepsi"] },
            { "Snapple": ["Peach", "Lemon", "Kiwi", "Diet Peach", "Diet Lemon"] },
            "Red Bull",
          ],
          "color": "#000000"
        },
        {
          "category": "Ice Cream",
          "items": [
            "Oreo Bar",
            "Klondike",
            "Strawberry Shortcake",
            "Vanilla Bar",
            "Giant Sandwich",
            "Cookie Sandwich",
            "Choc Éclair",
            "King Kone",
            "Birthday Cake",
            "Original",
            "Reeses",
            { "Magnum": ["2x Choc", "Almond", "Caramel", "Peanut B.", "Cookie Duet"] },
            { "Häagen-Dazs": ["Almond", "Dark Chocolate", "Coffee Almond"] },
            { "FrozFruit": ["Strawberry", "Coconut", "Mango", "Lime", "Pineapple"] },
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
      duration: 275, // Adjust fade-out duration
      useNativeDriver: true,
    }).start();
  };

  // Function to fade in the buttons
  const fadeInButtons = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 275,  // Adjust fade-in duration
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event) => {
    // Clear any existing timer to prevent immediate fade-in 
    clearTimeout(scrollTimer.current); 

    // Fade out buttons immediately on scroll
    fadeOutButtons();

    // Set a timer to fade buttons back in after a delay
    scrollTimer.current = setTimeout(() => {
      fadeInButtons();
    }, 500); // Adjust delay (in ms) before fade-in

    scrollPositionRef.current = event.nativeEvent.contentOffset.y;
  };

  const restoreScrollPosition = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: scrollPositionRef.current,
        animated: false, // Set to true for a smooth scroll back
      });
    }
  };
  


  const handleLongPressItem = (item) => {
      setEditingItem(item);
      setEditedItemName(item);
      setEditModalVisible(true);
  };
  
  
  

  const handleSaveEdit = () => {
    if (editedItemName.trim() !== '') {
      const updatedFoodItems = filteredFoodItems.map((category) => {
        return {
          ...category,
          items: category.items.map((foodItem) => {
            if (
              (typeof foodItem === 'string' && foodItem === editingItem) ||
              (typeof foodItem === 'object' &&
                Object.keys(foodItem)[0] === Object.keys(editingItem)[0])
            ) {
              // Update the item name if it's a string or an object
              return typeof foodItem === 'string'
                ? editedItemName
                : { [editedItemName]: Object.values(foodItem)[0] }; 
            }
            return foodItem;
          }),
        };
      });
      setFilteredFoodItems(updatedFoodItems);
      setEditingItem(null);
      setEditedItemName('');
      setEditModalVisible(false);
    }
  };

  const handleDeleteItem = () => {
    const updatedFoodItems = filteredFoodItems.map((category) => {
      return {
        ...category,
        items: category.items.filter((foodItem) => {
          return (
            (typeof foodItem === 'string' && foodItem !== editingItem) ||
            (typeof foodItem === 'object' &&
              Object.keys(foodItem)[0] !== Object.keys(editingItem)[0])
          );
        }),
      };
    });

    // **AsyncStorage Logic**
    storage.save({
      key: 'foodItems',
      data: updatedFoodItems,
      expires: null,
    }).then(() => {
      setFilteredFoodItems(updatedFoodItems);
      console.log('Food items saved to AsyncStorage after deletion');
    }).catch(error => {
      console.error('Error saving food items to AsyncStorage after deletion:', error);
    });

    setEditingItem(null);
    setEditModalVisible(false);
  };

  const handleChangeEditInput = (text) => {
    setEditedItemName(text);
  };


  const EditModal = () => {
    useEffect(() => {
      // Show the keyboard when the modal becomes visible
      if (editModalVisible && !editInputRef.current.isFocused()) {
        setTimeout(() => { // Use setTimeout to ensure TextInput is rendered
          editInputRef.current.focus(); // This will automatically open the keyboard
        }, 100); 
      }
    }, [editModalVisible]);
 // State for edited item name

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
            <Text style={styles.modalText}>Edit Item</Text>
            <TextInput
              style={styles.EditInput}
              value={editedItemName}
                onChangeText={handleChangeEditInput}
              ref={editInputRef}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.editButton]} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton]} // Red button for delete
                onPress={handleDeleteItem}
              >
                <Text style={styles.textStyle}>Delete</Text>
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



    useEffect(() => {
      if (filteredFoodItems && filteredFoodItems.length > 0) {
        setSelectedCategory(filteredFoodItems[0].category);
      }
    }, [filteredFoodItems]);

    const handleAddItem = () => {
      if (newItemInput.trim() !== '') {
        if (selectedSubcategory) {
          // Adding a subcategory item
          const categoryIndex = filteredFoodItems.findIndex(item => item.category === selectedCategory);
          if (categoryIndex !== -1) {
            setFilteredFoodItems(prevItems => {
              const updatedItems = [...prevItems];
              updatedItems[categoryIndex].items = updatedItems[categoryIndex].items.map(item => {
                if (typeof item === 'object' && Object.keys(item)[0] === selectedSubcategory) {
                  return { [selectedSubcategory]: [...Object.values(item)[0], newItemInput] };
                }
                return item;
              });
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
        } else {
          // Adding a regular item
          addFoodItem(selectedCategory, newItemInput);
        }
        setNewItemInput('');
        setIsModalVisible(false);
        setSelectedSubcategory(null); // Reset subcategory after adding
      }
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
                  data={filteredFoodItems.map(item => ({ label: item.category, value: item.category }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select category"
                  value={selectedCategory}
                  onChange={item => setSelectedCategory(item.value)}
                  style={styles.dropdown} 
                />
                {selectedCategory && (
                  <Dropdown
                    data={filteredFoodItems.find(item => item.category === selectedCategory).items.filter(item => typeof item === 'object' || typeof item === 'string').map(item => {
                      if (typeof item === 'object') {
                        return { label: Object.keys(item)[0], value: Object.keys(item)[0] };
                      } else {
                        return { label: item, value: item };
                      }
                    })}
                    labelField="label"
                    valueField="value"
                    placeholder="Select subcategory"
                    value={selectedSubcategory}
                    onChange={item => setSelectedSubcategory(item.value)}
                    style={styles.dropdown} 
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
      // Filtering logic (unchanged)
      const filteredItems = coloredCategories.map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const itemName = typeof item === 'object'
            ? Object.entries(item)[0][1].join(' ')
            : item;
          return itemName.toLowerCase().includes(query.toLowerCase());
        }),
      }));
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

  const FoodItem = React.memo(({ food, color, onItemPress, onItemLongPress }) => {
    return ( 
      <TouchableOpacity
        style={[styles.itemContainer, { backgroundColor: color }]}
        onPress={onItemPress}
        onLongPress={onItemLongPress}
      >
        <Text style={styles.item}>{typeof food === 'object' ? Object.keys(food)[0] : food}</Text>
      </TouchableOpacity>
    );
  }); 

  const FoodFlatList = () => {
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
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.scrollContainer} 
        onScroll={handleScroll} // Add this line to handle scroll events
        onLayout={restoreScrollPosition} // Restore scroll position when layout changes
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

    

    const [quantity, setQuantity] = useState('')
    const [isValidQuantity, setIsValidQuantity] = useState(false)

    const handleConfirm = () => {
      if (quantity === null || quantity <= 0 || isNaN(quantity) || quantity.includes('.') || quantity.includes(' ')) {
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
            height: showFormattedList ? 'auto' : 60, // Partially visible height
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
    
  const ViewFormattedListButton = () => {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.viewListButton]}
        onPress={toggleBottomSheet} // Toggle bottom sheet on button press
        activeOpacity={0.7}
      >
        <Image
          source={require('./assets/eye-icon.png')}
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
                    currentPack[subcategory[0].toUpperCase()] = (currentPack[subcategory[0].toUpperCase()] || 0) + amountToAdd;
                    packTotal += amountToAdd;
                    quantity -= amountToAdd;
                  }
  
                  if (packTotal === 24) {
                    formattedItems[brand]['Pack'] = formattedItems[brand]['Pack'] || []; 
                    formattedItems[brand]['Pack'].push(currentPack);
                    currentPack = {};
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
              // Compact format: "Initial-Quantity" 
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
            formattedItems[category.category] = formattedItems[category.category] || {};
            formattedItems[category.category][item] = quantity;
          }
        }
      }
    }
  
    // Format the output list
    let formattedListArray = [];
  
    for (const [brand, itemsData] of Object.entries(formattedItems)) {
      if (Object.keys(itemsData).length > 0) {
        formattedListArray.push(`${brand}:\n`);
  
        for (const itemKey in itemsData) {
          if (itemKey === 'Pack') {
            itemsData['Pack'].forEach((packContent, index) => {
              const formattedPackItems = Object.entries(packContent)
                .map(([initial, qty]) => `${initial}-${qty}`)
                .join(', ');
              formattedListArray.push(`\t(${formattedPackItems})\n`);
            });
          } else if (itemKey === 'compact') {
            formattedListArray.push(`\t${itemsData[itemKey]}\n`);
          }
          else {
            formattedListArray.push(`\t${itemKey}: ${itemsData[itemKey]}\n`);
          }
        }
  
        formattedListArray.push(''); 
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
      <Animated.View style={[
        styles.floatingButtonContainer,
        { opacity: buttonOpacity }
      ]
    }> 
        <EditModal />
        <AddButton />
        <UndoButton /> 
        <ShareListButton />
      </Animated.View>
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
    borderRadius: 5, // Rounded corners for items
    padding: 7,
    marginVertical: 3.5,
    transparency: 0.5,

    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    //shadow for android
    elevation: 3
  },
  item: {
    color: '#fff', // White text color for better contrast
    fontSize: 16
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
    elevation: 2,
    marginHorizontal: 5,
    backgroundColor: '#2196F3'
  },
  editButton: {
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
    // shadow for ios
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    //shadow for android
    elevation: 3
  },
  scrollContainer: {
    flexGrow: 1, // Allow ScrollView to take up available space
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    paddingVertical: 7,
    paddingHorizontal: 2,
  },
  AddButton: {
    backgroundColor: '#0098FF',
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
    right: 20,
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
})

export default FoodList
