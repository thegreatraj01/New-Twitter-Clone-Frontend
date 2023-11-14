import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import ImageIcon from '@mui/icons-material/Image';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import { BASE_URL } from '../../Config';


const CreateTweet = () => {
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("veryfication-token")
        }
    };

    const [show, setShow] = useState(false);

    const [img, setImg] = useState({ preview: '', data: '' });
    const [tweetdis, setTweetdis] = useState("");;

    const handleClose = () => {
        setShow(false);
        setImg("");

    }
    const handleShow = () => setShow(true);

    const handleImageIconClick = (event) => {
        event.preventDefault();

        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImg(img)
    }


    // for tostify massage 
    const notify = () => toast("tweet created  ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });



    const handleimgupload = async () => {
        const formData = new FormData();
        formData.append('file', img.data);
        try {
            const response = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log(`${BASE_URL} / download${response.data.profileimage}`);
            const imapath = `${BASE_URL}/download/${response.data.profileimage}`
            return imapath

        } catch (error) {
            console.log('image upload error', error);
        }

    }


    const handletweet = async (e) => {
        e.preventDefault();

        if (tweetdis === "") {
            // Handle case where tweet description is empty
            toast.warn('🦄 Description is required', {
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
                let imagePath = ""; // Initialize imagePath variable

                if (img.data) {
                    imagePath = await handleimgupload(); // Get the returned image path
                }

                // Create the tweet with or without an image
                const resp = await axios.post(`${BASE_URL}/tweet`, {
                    content: tweetdis,
                    image: imagePath,
                }, CONFIG_OBJ);
                console.log("tweet created ", resp);

                notify(); // Notify the user of tweet creation success
                handleClose();
            } catch (error) {
                // Handle any errors that occur during tweet creation
                console.log('handletweet error', error);
                toast.error('Error creating the tweet', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    };



    return (
        <div>
            <ToastContainer />
            <>

                <Button variant="primary" onClick={handleShow}>
                    Tweet
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Tweet </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="border-bottom pb-3">
                            <div>
                                <textarea
                                    onChange={(e) => setTweetdis(e.target.value)}
                                    type="text"
                                    placeholder="What's happening"
                                    className="bg-light rounded w-100 p-2">
                                </textarea>
                            </div>
                            <div style={{ boxSizing: 'border-box' }}>
                                <label htmlFor="imageupload" style={{ cursor: 'pointer' }} > <ImageIcon /></label>
                                <input type="file" className='d-none' id="imageupload" accept="image/*" onChange={handleImageIconClick} />
                                {img.preview && (
                                    <img src={img.preview} alt="Preview" className="p-2 w-100" style={{ height: "300px" }} />
                                )}

                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>

                        {img.preview && (
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        )}
                        <Button variant="primary" onClick={handletweet}>
                            Tweet
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        </div>
    )
}

export default CreateTweet;
