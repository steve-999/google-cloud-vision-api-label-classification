### Google Cloud Vision Image Label Classification App

#### Description

This project uses the [Google Cloud Vision API](https://cloud.google.com/vision) to automatically detect and classify labels for image files. 


#### Technologies

* React.js

* Google Cloud Vision API

* Firebase Storage

* Firebase Firestore

* Materialize CSS

#### Live version of app

LINK TO LIVE VERSION OF APP

#### Screenshot

INSERT SCREENSHOT HERE

#### Functionality

The app functions as follows:

1. The user can load an image file either from their own device or by copying and pasting an image file's URL into the app.

2. The image file is converted to base-64 and validation is performed to check that the file contains image data.

4. If validation passes, the base-64 data is POSTed to a Google Vision API REST endpoint, which returns a list of labels along with their associated confidence scores.

5. The image file is then uploaded to Firebase Storage and information about the image file is saved to a Firebase Firestore database.

6. The returned labels are displayed in the app alongside the image.

#### Installation instructions

To run this project locally requires the following steps:

* <code>git clone https://github.com/steve-999/google-cloud-vision-api-label-classification.git</code>

* Create a project on Firebase

* Click the <code></></code> symbol to register the project as a Web App.

* Replace the Firebase configuration code in <code>./src/firebase/config.js</code> with the equivalent code between the bottom <code>script</code> tags created by Firebase in the following screen (beginning with <code>var firebaseConfig = {</code> and ending with <code>  firebase.initializeApp(firebaseConfig);</code>). 

* To create a Firestore database, from the menu click: Cloud Firestore > Create database > Start in test mode.

* To create a Firebase Storage bucket, from the menu click: Storage > Get started > Next to accept the security rules suggested. Once the bucket has been created click on the Rules tab and replace the line <code>allow read, write: if request.auth != null;</code> with <code>allow read, write;</code> (both these and the security rules for Firestore will need to be strengthened once the project is working.)

* In the <code>./.firebaserc</code> file, change the <code>projects.default</code> string to the name of your new project.

* At the command line enter: 
<code>npm install</code><br>
<code>npm install firebase</code>
&nbsp;

[Follow all of the instructions](https://cloud.google.com/vision/docs/setup) to setup Google Cloud Vision API for the project created above:

* Go to Google Cloud Platform console and select the Firebase project.

* Enable billing for the project.

* From the main menu go to APIs & Services > Dashboard > + Enable APIs and Services > search for Vision > Cloud Vision API > Enable

* From the main menu go to APIs & Services > Credentials > + Create Credentials > API key. Copy the created API key. Create a .env file in the project root and add the following line:

<code>REACT_APP_API_KEY=\<paste the API key here\></code>

* Create a service account key JSON file and save this file. 

* At the command line set an environment variable to link to the service account key - e.g. for Windows:

<code> set GOOGLE_APPLICATION_CREDENTIALS=\<absolute path to json file\></code>

* Create service account and give it a role of "Owner"

* Finally, at the command line run <code>npm start</code> and the fully functioning application should then be served at localhost:3000.
