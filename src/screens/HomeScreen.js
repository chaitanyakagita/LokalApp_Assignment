import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import colors from '../constants';
import JobList from '../components/JobList';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [errors, setErrors] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        'https://testapi.getlokalapp.com/common/jobs?page=1',
      );
      //console.log('API Response:', response.data);

      if (typeof response.data === 'object') {
        setJobData(response.data.results);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('API Error:', error);
      setErrors(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/naruto1.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.profileName}>Chaitu</Text>
          </View>
        </View>
       
        <TouchableOpacity 
          style={styles.settingsButton}
          activeOpacity={1} 
          onPress={() => {}} 
        >
        <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Available Jobs</Text>
          {!isLoading && (
            <Text style={styles.jobCountText}>{jobData.length} jobs available</Text>
          )}
        </View>

        {isLoading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : errors ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load jobs</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchJobs}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <JobList 
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileTextContainer: {
    marginLeft: 8,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  jobCountText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;