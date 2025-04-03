import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import colors from '../constants';
import BookmarkIcon from 'react-native-vector-icons/FontAwesome';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import InfoIcon from 'react-native-vector-icons/AntDesign';
import PhoneIcon from 'react-native-vector-icons/Feather';
import WhatsAppIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const JobDetailsScreen = () => {
  const route = useRoute();
  const {job} = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const existingBookmarks = await AsyncStorage.getItem('bookmarks');
        if (existingBookmarks) {
          const bookmarks = JSON.parse(existingBookmarks);
          const isBookmarked = bookmarks.some(
            bookmark => bookmark.id === job.id,
          );
          setIsBookmarked(isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [job.id]);

  const showToast = message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleBookmark = async () => {
    try {
      let bookmarks = [];
      const existingBookmarks = await AsyncStorage.getItem('bookmarks');
      if (existingBookmarks) {
        bookmarks = JSON.parse(existingBookmarks);
      }

      const alreadyBookmarked = bookmarks.some(
        bookmark => bookmark.id === job.id,
      );

      if (!alreadyBookmarked) {
        bookmarks.push(job);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(true);
        showToast('Job bookmarked successfully!');
      } else {
        const updatedBookmarks = bookmarks.filter(
          bookmark => bookmark.id !== job.id,
        );
        await AsyncStorage.setItem(
          'bookmarks',
          JSON.stringify(updatedBookmarks),
        );
        setIsBookmarked(false);
        showToast('Job removed from bookmarks!');
      }
    } catch (error) {
      console.error('Error bookmarking job:', error);
      showToast('Failed to bookmark job');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast(isLiked ? 'Removed like' : 'Liked job');
  };

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${job.custom_link}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${job.whatsapp_no}`);
  };

  const handleApplyJob = () => {
    Alert.alert(
      'Apply for Job',
      'Are you sure you want to apply for this position?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Apply',
          onPress: () => showToast('Application submitted successfully!'),
        },
      ],
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {job.creatives && job.creatives.length > 0 && (
        <Image 
          source={{uri: job.creatives[0].file}} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.mainContainer}>
        {/* Job Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{job.job_role}</Text>
            <Text style={styles.companyText}>{job.company_name}</Text>
            
            <View style={styles.tagsContainer}>
              {job.job_tags?.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.value}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <LikeIcon name="eye" size={20} color={colors.bigText} />
              <Text style={styles.metaText}>{job.views} views</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.metaItem} 
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <LikeIcon
                name={isLiked ? 'like1' : 'like2'}
                size={20}
                color={isLiked ? colors.primary : colors.bigText}
              />
              <Text style={[styles.metaText, isLiked && styles.likedText]}>
                {isLiked ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.metaItem}
              onPress={handleBookmark}
              activeOpacity={0.7}
            >
              <BookmarkIcon
                name={isBookmarked ? 'bookmark' : 'bookmark-o'}
                size={20}
                color={isBookmarked ? colors.primary : colors.bigText}
              />
              <Text style={[styles.metaText, isBookmarked && styles.bookmarkedText]}>
                {isBookmarked ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Posted: {moment(job.created_on).format('MMM DD, YYYY')}
            </Text>
            <Text style={styles.applicantsText}>
              {job.num_applications} applicants
            </Text>
          </View>
        </View>

        {/* Job Details Section */}
        <View style={styles.detailsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <InfoIcon name="infocirlceo" color={colors.primary} size={20} />
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.descriptionText}>{job.title}</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Place}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Job Type:</Text>
            <Text style={styles.detailValue}>{job.job_hours}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{job.job_category}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Salary:</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Salary}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Experience:</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Experience}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Qualification:</Text>
            <Text style={styles.detailValue}>{job.primary_details?.Qualification}</Text>
          </View>
        </View>

        {/* Company Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>About Company</Text>
          <View style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{job.company_name}</Text>
          </View>
          
          <Text style={[styles.detailLabel, {marginTop: 8}]}>Contact HR:</Text>
          
          <View style={styles.contactContainer}>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={handlePhoneCall}
              activeOpacity={0.7}
            >
              <PhoneIcon name="phone-call" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>Call: {job.custom_link}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactButton, styles.whatsappButton]}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <WhatsAppIcon name="whatsapp" size={18} color="#fff" />
              <Text style={styles.contactButtonText}>WhatsApp: {job.whatsapp_no}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Available Timings:</Text>
            <Text style={styles.detailValue}>
              {job.contact_preference?.preferred_call_start_time} AM to{' '}
              {job.contact_preference?.preferred_call_end_time} PM
            </Text>
          </View>
        </View>

        {/* Other Details Section */}
        {job.contentV3?.V3 && job.contentV3.V3.length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Other Details</Text>
            <View style={styles.divider} />
            
            {job.contentV3.V3.map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.field_name}:</Text>
                <Text style={styles.detailValue}>{item.field_value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Apply Button */}
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApplyJob}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply for this Job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  mainContainer: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#4a5568',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  likedText: {
    color: colors.primary,
  },
  bookmarkedText: {
    color: colors.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    color: '#718096',
  },
  applicantsText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  descriptionText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 22,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    width: 110,
  },
  detailValue: {
    fontSize: 14,
    color: '#4a5568',
    flex: 1,
  },
  contactContainer: {
    marginTop: 8,
    gap: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JobDetailsScreen;