import FoodList from './FoodList'
import {StyleSheet, SafeAreaView} from 'react-native'
import React, { useState, useEffect } from 'react'
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import 'expo-dev-client';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6871951592309624/4741181709'; // Replace with your actual Ad Unit ID

export default function App() {
  const [filteredFoodItems, setFilteredFoodItems] = useState([
  ]);
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false); // Track loaded state


  useEffect(() => {
    const newInterstitialAd = new InterstitialAd.createForAdRequest(adUnitId);
    setInterstitialAd(newInterstitialAd);

    const unsubscribe = newInterstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });
  

    // Start loading the interstitial straight away
    try {
      newInterstitialAd.load();
      console.log('ad loaded')
    } catch (error) {
      console.log(error)
    }
    

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  const showInterstitialAd = () => {
    if (interstitialLoaded) {
        return new Promise((resolve, reject) => {
            interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
              console.log('Interstitial ad closed');
              setInterstitialLoaded(false);
              resolve();

              // Load next ad:
              const nextInterstitial = new InterstitialAd.createForAdRequest(adUnitId);
              setInterstitialAd(nextInterstitial);
              nextInterstitial.addAdEventListener(AdEventType.LOADED, () => {
                console.log('Next interstitial loaded');
                setInterstitialLoaded(true);
              });
              nextInterstitial.load();
            });

            try {
              interstitialAd.show();
            } catch (error) {
              console.error('Error showing interstitial ad:', error);
              reject(error); // Reject if the ad fails to show
            }
        });
    } else {
      console.warn('Interstitial ad not loaded yet');
      return Promise.resolve(); // Resolve if not loaded to avoid blocking
    }
};




  return (
    <SafeAreaView style={styles.container}>
      <FoodList
        filteredFoodItems={filteredFoodItems} 
        setFilteredFoodItems={setFilteredFoodItems}
        showInterstitialAd={showInterstitialAd}
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
