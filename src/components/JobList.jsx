import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import colors from '../constants';
import LocationIcon from 'react-native-vector-icons/FontAwesome6';
import BookmarkIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92; 

const JobList = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [jobData, setJobData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    fetchJobs();
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('jobBookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async (jobId) => {
    try {
      const newBookmarks = {...bookmarks};
      if (newBookmarks[jobId]) {
        delete newBookmarks[jobId];
      } else {
        newBookmarks[jobId] = true;
      }
      setBookmarks(newBookmarks);
      await AsyncStorage.setItem('jobBookmarks', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  const fetchJobs = async (pageNumber = 1) => {
    try {
      pageNumber === 1 ? setIsLoading(true) : setIsLoadingMore(true);
      
      const response = await axios.get(
        `https://testapi.getlokalapp.com/common/jobs?page=${pageNumber}`,
      );

      if (typeof response.data === 'object') {
        const fetchedJobs = response.data.results;
        setJobData(prev => pageNumber === 1 ? fetchedJobs : [...prev, ...fetchedJobs]);
        setHasMore(response.data.next !== null);
      }

    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreJobs = () => {
    if (!isLoadingMore && hasMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchJobs(nextPage);
        return nextPage;
      });
    }
  };

  const handleApply = (job) => {
    navigation.navigate('JobDetails', {job});
  };

  const renderItem = ({item}) => {
    const hasValidData = item.title && item.primary_details?.Place;
    const imageUrl = item.creatives[0]?.thumb_url || item.creatives[0]?.image_url;
    const isDefaultImage = !imageUrl || imageUrl === item.creatives[0]?.image_url;
    const isBookmarked = bookmarks[item.id];

    return (
      <TouchableOpacity
        style={[styles.card, {width: CARD_WIDTH}]}
        onPress={hasValidData ? () => navigation.navigate('JobDetails', {job: item}) : null}
        activeOpacity={0.9}>
        
        {/* Job Image */}
        {imageUrl && (
          <Image
            source={{uri: imageUrl}}
            style={[styles.thumbnail, isDefaultImage && styles.defaultImage]}
            resizeMode={isDefaultImage ? 'contain' : 'cover'}
          />
        )}
        
        {/* Job Content */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>{item.title || 'Job Opportunity'}</Text>
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={() => toggleBookmark(item.id)}>
              <BookmarkIcon 
                name={isBookmarked ? "bookmark" : "bookmark-o"} 
                size={20} 
                color={isBookmarked ? colors.primary : '#6b7280'} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Company & Location */}
          <View style={styles.companyContainer}>
            {item.company_name && (
              <Text style={styles.companyText}>{item.company_name}</Text>
            )}
            <View style={styles.locationContainer}>
              <LocationIcon name="location-dot" size={14} color="#6b7280" />
              <Text style={styles.locationText}>{item.primary_details?.Place || 'Remote'}</Text>
            </View>
          </View>
          
          {/* Tags */}
          {item.job_tags?.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.job_tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.value}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Salary & Type */}
          <View style={styles.detailsRow}>
            {item.primary_details?.Salary && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Salary:</Text>
                <Text style={styles.detailValue}>{item.primary_details.Salary}</Text>
              </View>
            )}
            
            {item.job_hours && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{item.job_hours}</Text>
              </View>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={() => toggleBookmark(item.id)}>
              <Text style={styles.actionButtonText}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.applyButton]}
              onPress={() => handleApply(item)}>
              <Text style={[styles.actionButtonText, styles.applyButtonText]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={jobData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id?.toString() || index}_${Date.now()}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading more jobs...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Jobs Available</Text>
                <Text style={styles.emptySubtitle}>Check back later for new opportunities</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#f1f5f9',
  },
  defaultImage: {
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700', 
    color: '#111827', 
    flex: 1,
    marginRight: 8,
    lineHeight: 24,
  },
  bookmarkButton: {
    padding: 4,
  },
  companyContainer: {
    marginBottom: 12,
  },
  companyText: {
    fontSize: 15,
    color: '#374151', 
    fontWeight: '600', 
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#1e40af', 
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600', 
  },
  detailValue: {
    fontSize: 14,
    color: '#111827', 
    fontWeight: '600', 
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  applyButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default JobList;