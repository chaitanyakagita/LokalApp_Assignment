import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import colors from '../constants';
import LocationIcon from 'react-native-vector-icons/FontAwesome6';
import PhoneIcon from 'react-native-vector-icons/Feather';
import WhatsAppIcon from 'react-native-vector-icons/FontAwesome';
import BookmarkIcon from 'react-native-vector-icons/FontAwesome';

const BookmarkScreen = () => {
  const navigation = useNavigation();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      const existingBookmarks = await AsyncStorage.getItem('bookmarks');
      if (existingBookmarks) {
        const parsedBookmarks = JSON.parse(existingBookmarks);
        setBookmarks(parsedBookmarks);
      } else {
        setBookmarks([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching bookmarks:', error);
    }
  }, []);

  const removeBookmark = async (jobId) => {
    try {
      const updatedBookmarks = bookmarks.filter(item => item.id !== jobId);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBookmarks();
    }, [fetchBookmarks]),
  );

  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (whatsappNumber) => {
    Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`);
  };

  const renderItem = ({item}) => {
    const imageUrl = item.creatives?.[0]?.thumb_url || item.creatives?.[0]?.image_url;
    const isDefaultImage = !imageUrl || imageUrl === item.creatives?.[0]?.image_url;
    const location = item.primary_details?.Place;
    const vacancies = item.job_tags?.map(tag => tag.value).join(', ');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('JobDetails', {job: item})}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {imageUrl && (
            <Image
              source={{uri: imageUrl}}
              style={[styles.thumbnail, isDefaultImage && styles.defaultImage]}
            />
          )}
          
          <View style={styles.jobInfoContainer}>
            <View style={styles.jobHeader}>
              <Text style={styles.title} numberOfLines={2}>{item.title || 'No Title'}</Text>
              <TouchableOpacity 
                onPress={() => removeBookmark(item.id)}
                style={styles.bookmarkButton}
                activeOpacity={0.7}
              >
                <BookmarkIcon name="bookmark" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {(location || vacancies) && (
              <View style={styles.locationVacancyContainer}>
                {location && (
                  <View style={styles.locationContainer}>
                    <LocationIcon name="location-dot" size={14} color="#6b7280" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {location}
                    </Text>
                  </View>
                )}
                {vacancies && (
                  <View style={styles.vacancyContainer}>
                    <Text style={styles.vacancyText} numberOfLines={1}>
                      {vacancies}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {item.primary_details?.Salary && (
              <Text style={styles.salaryText}>
                Salary: {item.primary_details.Salary}
              </Text>
            )}
            
            {(item.custom_link || item.whatsapp_no) && (
              <View style={styles.contactContainer}>
                {item.custom_link && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handlePhoneCall(item.custom_link)}
                    activeOpacity={0.8}
                  >
                    <PhoneIcon name="phone" size={14} color="#fff" />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </TouchableOpacity>
                )}
                
                {item.whatsapp_no && (
                  <TouchableOpacity 
                    style={[styles.contactButton, styles.whatsappButton]}
                    onPress={() => handleWhatsApp(item.whatsapp_no)}
                    activeOpacity={0.8}
                  >
                    <WhatsAppIcon name="whatsapp" size={14} color="#fff" />
                    <Text style={styles.contactButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item, index) => {
    return item.id ? item.id.toString() : index.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
        <Text style={styles.headerSubtitle}>{bookmarks.length} bookmarked jobs</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.emptyState}>
          <BookmarkIcon name="bookmark" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateTitle}>No bookmarks yet</Text>
          <Text style={styles.emptyStateText}>
            Save jobs you're interested in by tapping the bookmark icon
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9',
  },
  defaultImage: {
    resizeMode: 'contain',
    backgroundColor: '#f1f5f9',
  },
  jobInfoContainer: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  locationVacancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 6,
    maxWidth: 150,
  },
  vacancyContainer: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vacancyText: {
    fontSize: 12,
    color: '#4b5563',
  },
  salaryText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    marginBottom: 12,
  },
  contactContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default BookmarkScreen;