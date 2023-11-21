import React from 'react'

function Navigation({ onRouteChange, isSigninedIn }) {
  if (isSigninedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p className='3 link dim black underline pa3 pointer' onClick={() => onRouteChange("signin")} >Sign Out</p>
      </nav>
    )
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p className='3 link dim black underline pa3 pointer' onClick={() => onRouteChange("signin")} >Sign In</p>
        <p className='3 link dim black underline pa3 pointer' onClick={() => onRouteChange("register")} >Register</p>
      </nav>
    )
  }
}

export default Navigation