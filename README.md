### Google Cloud Vision Image Label Classification App

#### Description

This project uses the [Google Cloud Vision API](https://cloud.google.com/vision) to automatically detect and classify labels for image files. 


#### Technologies

* React.js

* Google Cloud Vision API

* Firebase Storage

* Firebase Firestore

* Materialize CSS

#### Functionality

The app functions as follows:

1. The user can load an image file either from their own device or by copying and pasting an image file's URL into the app.

2. The image file is converted to base-64 and validation is performed to check that the file contains image data.

4. If validation passes, the base-64 data is POSTed to a Google Vision API REST endpoint, which returns a list of labels along with their associated confidence scores.

5. The image file is then uploaded to Firebase Storage and information about the image file is saved to a Firebase Firestore database.

6. The returned labels are displayed in the app alongside the image.

#### Instructions

To run this project locally requires the following steps:

* <code>git clone https://github.com/steve-999/google-cloud-vision-api-label-classification.git</code>

* Create a project on Firebase

* Click the <code></></code> symbol to register the project as a Web App.

* Replace the Firebase configuation code in <code>./src/firebase/config.js</code> with the equivalent code between the bottom <code>script</code> tags created by Firebase in the following screen (beginning with <code>var firebaseConfig = {</code> and ending with <code>  firebase.initializeApp(firebaseConfig);</code>). Then add the following lines to this file:








Image files can either be sourced from a user's device or by copying and pasting an image file's URL. Once an image file has been entered, the app converts the file to base-64 and POSTs this to the Google Cloud Vision API, and the API returns a list of relevant labels along with their associated scores. 

Once the labels have been returned by the API, the app uploads the image file to Firebase Storage and the list of labels and other file-specific information are stored in a Firebase Firestore database. Previously processed image files can be viewed on the Gallery page of the app.





Image file types supported: JPEG, PNG, GIF, WEBP ...

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.




