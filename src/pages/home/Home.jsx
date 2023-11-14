import React from 'react'
import AllTweet from '../../component/Alltweets/AllTweet'
import CreateTweet from '../../component/CreateTweet/CreateTweet';
// import { useLocation } from 'react-router-dom'

const Home = () => {
  // const location = useLocation();
  // console.log(location)
  return (
    <div className=''>
      <CreateTweet />
      <AllTweet />

    </div>
  )
}

export default Home;