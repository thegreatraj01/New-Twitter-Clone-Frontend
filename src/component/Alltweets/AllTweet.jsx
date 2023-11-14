import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Config';
// import CONFIG_OBJ from '../../Config';
import TweetModel from '../Tweets/TweetModel';
import { useLocation, useParams } from 'react-router-dom';


const AllTweet = () => {
    const [tweets, setTweets] = useState("");

    const location = useLocation().pathname;
    const id = useParams().id
    // console.log(id);
    // console.log(location)
    // console.log(tweets);



    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("veryfication-token")
        }
    };

    const fetchdata = async () => {
        try {
            if (location === ("/explore")) {
                const newData = await axios.get(`${BASE_URL}/exploretweet`);
                if (newData.status === 200) {
                    setTweets(newData.data.posts);
                }
            }
            else if (location.includes("/profile")) {
                const newData = await axios.get(`${BASE_URL}/alltweetsbyuser/${id}`, CONFIG_OBJ);
                setTweets(newData.data.posts);
                // console.log(newData.data.posts)
            }
            else if (location === ("/")) {
                const newData = await axios.get(`${BASE_URL}/timelinetweets`, CONFIG_OBJ);
            
                if (newData.status === 200) {
                    setTweets(newData.data);
                  
                }
            }
        } catch (error) {
            console.log("all tweet error: " + error);
        }
    }



    useEffect(() => {
        fetchdata();
        // eslint-disable-next-line
    }, []);


    return (
        <div>
            {tweets && tweets.map(tweet => (
                <TweetModel key={tweet._id} tweet={tweet} setTweets={setTweets} fetchdata={fetchdata} />
            ))}
        </div>
    );

}

export default AllTweet;



