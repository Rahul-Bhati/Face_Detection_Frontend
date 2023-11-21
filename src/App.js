import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/signIn';
import Register from './components/Register/register';
import { useState } from 'react';

import Clarifai from 'clarifai';

//You must add your own API key here from Clarifai.
// const app = new Clarifai.App({
//   apiKey: '70ac396ef88b4f1f97fec6c888643de2'
// });

function App() {
  let [inputImgLink, setInputImgLink] = useState("");
  const [IMAGE_URL, setIMAGE_URL] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSigninedIn, setIsSigninedIn] = useState(false);

  let calculateFaceLoc = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiFace);

    const img = document.getElementById('input_image');
    const width = Number(img.width);
    const height = Number(img.height);

    // console.log(width + " " + height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box_co) => {
    // console.log(box_co)
    setBox(box_co);
  }

  let onInputChange = event => setInputImgLink(event.target.value)

  let onButtonSubmit = () => {
    // console.log("click", inputImgLink);

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '8563ce47f74e4fa5a35782e3020b8f03';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = '2ws8w6ym7xvk';
    const APP_ID = 'face-detct-app';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    // const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
    // const IMAGE_URL = inputLink;
    setIMAGE_URL(inputImgLink);

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => displayFaceBox(calculateFaceLoc(result)))
      // .then(response => console.log(response))
      .catch(error => console.log('error', error));

  }

  const onRouteChange = (newRoute) => {
    if(newRoute === "home") setIsSigninedIn(true)
    else setIsSigninedIn(false);
    setRoute(newRoute);
  }
  return (
    <>
      <div className='App'>
        <Navigation isSigninedIn={isSigninedIn} onRouteChange={onRouteChange} />
        {route === "home" ?
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition set_img_url={IMAGE_URL} box={box} />
          </div>
          :
          route === "signin" ?
            <SignIn onRouteChange={onRouteChange} />
            :
            <Register onRouteChange={onRouteChange} />
        }
      </div>
    </>
  )
}

export default App;
