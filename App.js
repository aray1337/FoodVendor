import FoodList from './FoodList'
import {StyleSheet, SafeAreaView} from 'react-native'
import React, { useState, useEffect } from 'react'

export default function App() {
  const [filteredFoodItems, setFilteredFoodItems] = useState([
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <FoodList
        filteredFoodItems={filteredFoodItems} 
        setFilteredFoodItems={setFilteredFoodItems} 
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  }
})
