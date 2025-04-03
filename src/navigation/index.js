import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookmarkScreen from '../screens/BookmarkScreen';
import {NavigationContainer} from '@react-navigation/native';
import {Text, StyleSheet, View} from 'react-native';
import colors from '../constants';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }
          return (
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={24}
                color={focused ? colors.primary : colors.text}
              />
            </View>
          );
        },
        tabBarLabel: ({focused}) => (
          <Text style={[
            styles.label, 
            {color: focused ? colors.primary : colors.text}
          ]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      })}
      initialRouteName="Jobs">
      <Tab.Screen name="Jobs" component={HomeScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarkScreen} />
    </Tab.Navigator>
  );
};

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="TabNavigator">
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen 
          name="JobDetails" 
          component={JobDetailsScreen} 
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarItem: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StackNavigation;