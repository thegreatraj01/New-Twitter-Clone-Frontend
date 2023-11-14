import React, { useEffect, useState } from 'react';
import './Profile.css';
import { Avatar } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AllTweet from '../../component/Alltweets/AllTweet';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CONFIG_OBJ, { BASE_URL } from '../../Config';
import { parseISO, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadImg from '../../component/UpdateProfile/UploadImg';
import UploadDetails from '../../component/UpdateProfile/UploadDetails';

function Profile() {

  const currentuser = useSelector(state => state.userReducer.user);
  // console.log(currentuser)
  let id = useParams().id;
  // console.log(id)

  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);

  // console.log(user);
  // debugger

  const fetchdata = async () => {
    try {
      const newData = await axios.get(`${BASE_URL}/profile/${id}`);
      setUser(newData.data.result);
      // Format the date after data is fetched
      if (newData.data.result && newData.data.result.createdAt) {
        const dateObject = parseISO(newData.data.result.createdAt);
        const dateFormatted = format(dateObject, 'dd/MM/yy');
        setFormattedDate(dateFormatted);
      }
    } catch (error) {
      console.log('profile error', error);
    }
  };

  // all tweets in tweet model 
  const [alltweets, setAlltweets] = useState([])
  const alltweetsindb = async () => {
    const newData = await axios.get(`${BASE_URL}/exploretweet`);
    if (newData.status === 200) {
      setAlltweets(newData.data.posts);
    }
  }

  const UserTweets = alltweets.filter(tweet => tweet.tweetedBy._id === user._id);
  const numberOfCurrentUserTweets = UserTweets.length;
  const UserReTweets = alltweets.filter(tweet => tweet.retweetBy._id === user._id);
  const numberOfCurrentUserReTweets = UserReTweets.length;

  // console.log(numberOfCurrentUserTweets);
  // debugger


  // function for follow or unfollow a user 
  const handelefollowunfollow = async (id) => {
    try {
      const newData = await axios.put(`${BASE_URL}/follow/unfollow/${id}`, {}, CONFIG_OBJ);
      // console.log(newData.data.message);
      toast.success(`${newData.data.message}`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000, // Close the toast after 3 seconds
      });
      fetchdata();

    } catch (error) {
      console.log('follow unfollow error', error);
    }
  }


  // for user date of birth 
  useEffect(() => {
    if (user && user.dateOfBirth) {
      const dateObject = parseISO(user.dateOfBirth);
      const dateFormatted = format(dateObject, 'dd/MM/yy');
      setDateOfBirth(dateFormatted);
    }
  }, [user]);




  useEffect(() => {
    fetchdata();
    alltweetsindb();

    // eslint-disable-next-line 
  }, [id]);

  return (
    <div className="container">
      <ToastContainer />
      {user ? ( // Render only when user is not null
        <>
          {/* first row */}
          <div className="row">
            <div className="col-12 profile-sec">
              {/* only for create an empty div */}
            </div>
            <div className="col-12 profile-img-sec">
              <div className="profile-img">
                <Avatar
                  alt="User Profile Picture"
                  src={user.profilePic}
                  style={{ width: 90, height: 90 }}
                />
              </div>
              <div className="float-end mt-1 ">
                {id === currentuser._id && <span className="mt-1 me-2 px-2  border border-info rounded-pill edit-button">
                  {/* Upload Profile Picture */}
                  <UploadImg fetchdata={fetchdata} id={id} />
                </span>}

                {id === currentuser._id ? <span className="mt-1 me-2 px-2  border border-info rounded-pill edit-button">
                  {/* Upload Profile Details */}
                  <UploadDetails fetchdata={fetchdata} />
                </span> : <button className="mt-1 px-2 fs-6 fw-bold border border-info rounded-pill edit-button">
                  👻
                </button>}

              </div>
            </div>
          </div>

          {/* second row */}
          <div className="row">
            <div className="col mt-3">
              <div className="my-1">
                <h5 className="fw-bold">@username <span className='text-info '> {user.username}</span> </h5>
                <h6 className="fw-bold">name :  <span className='text-info '>{user.name}</span></h6>
              </div>
              <p className=' d-flex justify-content-between'>
                <span className=' fs-6 fw-bold '>
                  <CalendarMonthIcon />Joined : &nbsp;
                  {formattedDate}
                </span>
                <span className='me-3 fs-6 fw-bold '> {user.location && <> Location : &nbsp; {user.location}</>}  </span>
              </p>
              {user.dateOfBirth &&
                <p>
                  <span className=' fs-6 fw-bold '>
                    <CalendarMonthIcon />Date of Birth : &nbsp;
                    {dateOfBirth}
                  </span>
                </p>}

              <p>  Tweets By User <span className='fw-bold ms-3 '> {numberOfCurrentUserTweets}</span> </p>
              <p>  ReTweets By User <span className='fw-bold ms-3 '> {numberOfCurrentUserReTweets}</span> </p>
              <ul className="list-inline">
                <li className="list-inline-item mx-2">
                  <span className='fw-bolder text-danger  '>{user.followers.length}</span>{' '}
                  <span className="fw-medium  ">Followers</span>
                </li>
                <li className="list-inline-item mx-2">
                  <span className='fw-bolder text-danger'>{user.following.length}</span>{' '}
                  <span className="fw-medium ">Following</span>
                </li>
                {currentuser._id !== id && <>
                  {user.followers.includes(currentuser._id) &&
                    <li className="list-inline-item mx-5">
                      <button type="button" onClick={() => handelefollowunfollow(user._id)} className="btn btn-primary">
                        UnFollow
                      </button>
                    </li>}
                  {!user.followers.includes(currentuser._id) &&
                    <li className="list-inline-item mx-5">
                      <button type="button" onClick={() => handelefollowunfollow(user._id)} className="btn btn-primary">
                        Follow
                      </button>
                    </li>}
                </>}
              </ul>
            </div>
          </div>
          {/* for showing tweets */}
          <div className="row">
            <AllTweet />
          </div>

        </>
      ) : (
        // Render a loading state or placeholder if user is null
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
