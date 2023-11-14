import React, { useState } from 'react';
import './Tweetmodel.css';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CachedIcon from '@mui/icons-material/Cached';
import formatDistance from "date-fns/formatDistance";
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../Config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function TweetModel({ tweet, fetchdata }) {
  // console.log(tweet);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("veryfication-token")
    }
  };

  // const location = useLocation().pathname

  const user = useSelector(state => state.userReducer.user)
  // console.log(user._id);
  // debugger




  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());

  const handleCommentClick = () => {
    setShowCommentBox((prevShowCommentBox) => !prevShowCommentBox);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      toast.warn('🦄 Comment box cannot be empty ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      try {
        const data = await axios.put(`${BASE_URL}/comment/${tweet._id}`, { commentText: comment }, CONFIG_OBJ);
        console.log(data);
        // calling parent function 
        fetchdata();
      } catch (error) {
        console.log("comment a tweet error ", error);
      }
    }


    setComment('');
    setShowCommentBox(false);
  };

  // function for handle like 
  const handlelike = async (e) => {
    e.preventDefault();
    const userid = { userid: user._id }
    if (user._id) {
      try {
        // for like 
        const data = await axios.put(`${BASE_URL}/like/dislike/${tweet._id}`, userid);
        console.log("like dislike data ", data.data);
        fetchdata();
      } catch (error) {
        console.log('Network error:', error.message);
      }
    } else {
      alert("You are not loged in ")
    }

  }


  // function for delete a tweet 
  const handletweetdelete = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.delete(`${BASE_URL}/deletetweet/${tweet._id}`, CONFIG_OBJ);
      // calling the parent function for fetch new data 
      fetchdata();
      console.log(data)
    } catch (error) {
      console.log('delete tweet  error:', error);
    }

  }

  // function for delete a comment 
  const handlecommentdelete = async (id) => {
    try {
      const data = await axios.delete(`${BASE_URL}/tweet/${tweet._id}/comment/${id}`, CONFIG_OBJ);
      fetchdata();
      console.log("delete comment", data)

    } catch (error) {
      console.log('delete tweet error:', error);
    }

  }


  // function for retweet or undo a retweet 
  const handleretweet = async () => {
    try {
      const data = await axios.put(`${BASE_URL}/retweet/${tweet._id}`, {}, CONFIG_OBJ);
      console.log('retweet data ', data)
      fetchdata();
    } catch (error) {
      console.log('retweet error:', error);
    }
  }



  return (
    <div className=" p-3 border border-light-subtle mt-2 m-1 rounded-3 ">
      {/* div for show retweeted by users  */}
      {tweet.retweetBy.length > 0 && <div className="row">
        <div className="col">
          {tweet.retweetBy.map((retweet, i) => (
            <p key={i}>
              <CachedIcon /> <span>Retweeted by {retweet.username}</span>
            </p>
          ))}
        </div>
      </div>}
      {/* Use map to loop through retweetBy array and display each username */}


      {/* first row */}
      <div className="row">
        {/* for image */}
        <div className="col-10 d-flex">
          <img className='rounded-circle bg-primary' src={tweet.tweetedBy.profilePic} alt="profilepic" width="50" height="50" />
          <div className='mt-1'>
            <Link className='fw-semibold fs-5 p-1 cursor-pointer user-underline' to={`/profile/${tweet.tweetedBy._id}`}> <span className='text-black '>@username</span>{tweet.tweetedBy.username} </Link>
            <span className='fw-medium p-1'>{dateStr}</span>
          </div>
        </div>

        <div className="col text-end">
          {user._id === tweet.tweetedBy._id && <div className='cursor-pointer'>
            <button className='border' onClick={handletweetdelete}><DeleteIcon /> </button>
          </div>}

        </div>
      </div>
      {/* second row  */}
      <div className="row">
        <div className="col-12">
          <p className='ps-5 fw-semibold '>
            {tweet.content}
          </p>
        </div>
        {tweet.image && <div className='col-12 imghover rounded'>
          <img className="w-100  img-fluid " src={tweet.image} alt='tweetpic' />
        </div>}

      </div>

      {/* third row */}
      <div className="row mt-3">
        <div className="col-4 text-center cursor-pointer" onClick={handlelike}>
          {tweet.likes.includes(user._id) ? <FavoriteIcon className='text-danger' /> : <FavoriteBorderIcon />}
          <span>{tweet.likes.length} </span>
        </div>
        <div className="col-4 text-center cursor-pointer" onClick={handleCommentClick}>
          <ChatBubbleOutlineIcon />
        </div>
        {/* some retweet icon  */}
        <div className="col-4 text-center cursor-pointer">
          {tweet.retweetBy.some(obj => {
            return obj._id === user._id;
          }) ? <button className='border text-info' onClick={handleretweet}> <CachedIcon /> </button> :
            <button className='border ' onClick={handleretweet}> <CachedIcon /> </button>}
        </div>
        {/* Comment Box */}
        {showCommentBox && (
          <div className="comment-box mt-1 w-100">
            <textarea
              className="w-100"
              rows="3"
              placeholder="Type your comment here"
              value={comment}
              onChange={handleCommentChange}
            />
            <button className="btn btn-primary" onClick={handleCommentSubmit}>Comment</button>
          </div>
        )}
      </div>

      {/* for show comments  */}
      {/* fourth row  */}
      <span>Comments</span>
      {tweet.comments.map((comment, index) => (
        <div key={index} className="row border mt-1">
          <div className="col-10 d-flex pt-1">
            <img className="rounded-circle bg-primary" src={comment.commentedBy.profilePic} alt="profilepic" width="25" height="25" />
            <div className="mt-1">
              <span className="fw-bold p-1 cursor-pointer user-underline">@{comment.commentedBy.username}</span>
              <span className="fw-medium p-1">
                {formatDistance(new Date(comment.commentedAt), new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="col text-end">
            {comment.commentedBy._id === user._id && <div className="cursor-pointer">
              <DeleteIcon onClick={(e) => { handlecommentdelete(comment._id) }} />
            </div>}

          </div>
          <div className="col-12">
            <p className="ps-4 fs-6 fw-bold mt-2">{comment.commentText}</p>
          </div>
        </div>
      ))}



      {/* tost coantainer  */}
      <ToastContainer />

    </div>
  )
};

export default TweetModel;
