import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AllTweet from '../../component/Alltweets/AllTweet';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Explore.css'; // Import your custom CSS file

const Explore = () => {
  const user = useSelector(state => state.userReducer.user);
  const isUser = Object.keys(user).length === 0 ? false : true;

  // Use useEffect to show the toast when the component mounts
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isUser) {
        toast.error(
          <div className="custom-toast">
            <span>You are not logged in! Please </span>
            <Link to="/login">
              <button className="toast-button">Log In</button>
            </Link>
            <span> or </span>
            <Link to="/register">
              <button className="toast-button">Register</button>
            </Link>
            <span> to access this feature.</span>
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000, // Close the toast after 5 seconds
          }
        );
      }
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isUser]);

  return (
    <div>
      <AllTweet />
      <ToastContainer className="toast-container" />
    </div>
  );
};

export default Explore;
