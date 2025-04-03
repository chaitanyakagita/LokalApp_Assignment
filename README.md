# React Native Assignment - Lokal App
This project demonstrates the React Native application that presents users with a job listing interface. The application features bottom navigation with "Jobs" and "Bookmarks" sections, infinite scroll for job listings, detailed job views, and the ability to bookmark jobs for offline viewing/storage using AsyncStorage. The application is user-friendly, easy to navigate, and ensures a smooth experience for users looking for job listings and bookmarking them for future reference.
      
## Technologies Used

- **React Native**: For building the mobile application.
- **React Navigation**: For handling navigation within the app.
- **Axios**: For making API calls.
- **AsyncStorage**: For offline storage of bookmarked jobs.
- **react-native-vector-icons**: For using icons in the application.


## Features

1. **Bottom Navigation**
    - The app opens with a bottom navigation UI with “Jobs” and “Bookmarks” as sections.

2. **Jobs Screen**
    - Fetches data from the API in an infinite scroll manner.
    - Displays title, location, salary, and phone data in each job card.
    - Appropriate states for loading, error, and empty states are maintained.

3. **Job Details Screen**
    - Clicking on a job card shows more details about the job on another screen.

4. **Bookmarking Jobs**
    - Users can bookmark a job, and the bookmarked jobs appear in the “Bookmarks” tab.
    - Bookmarked jobs are stored using AsyncStorage for offline viewing.
      
5. **Application Confirmation Dialog**
    - When clicking "Apply" on a job, a clean modal dialog appears with "Apply Now" and "Cancel" buttons shows confirmation feedback.

6. **Interactive Feedback**
    - Toast notifications appear when " Bookmarking/removing bookmark ("Successfully saved Job!"/"Bookmark removed"), Applying for a job ("Application submitted successfully!"), Error states ("Failed to save bookmark") "
    - Small animation on icon presses for tactile feedback
      


## Video
I have recorded a video from my laptop demonstrating the features and functionality of the application. You can watch the video [https://drive.google.com/file/d/1KamLCLsA91wMJ0QlfEo5XZUhiCz7lZNF/view?usp=sharing](https://drive.google.com/file/d/11AyIhHPvPwuoQjriF7_pd-8U3HMJULsH/view?usp=sharing)

  
## Given API

- The Jobs screen fetches data from the following API:
    ```
    GET https://testapi.getlokalapp.com/common/jobs?page=1
    ```

    
## How to Run

1. Clone the repository:
    ```bash
    git clone https://github.com/chaitanyakagita/LokalApp_Assignment.git
    cd LokalApp_Assignment
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the Metro bundler:
    ```bash
    npm start
    ```

4. Run the application on your device/emulator:
    ```bash
    npx react-native run android
    ```
