import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CONFIG_OBJ, { BASE_URL } from '../../Config';

function UploadImg({ fetchdata, id }) {
    const [show, setShow] = useState(false);
    const [img, setImg] = useState({ preview: '', data: '' });
    const [uploading, setUploading] = useState(false); // Add this line

    const handleClose = () => {
        setShow(false);
        setImg({})
    }
    const handleShow = () => setShow(true);

    const setPreview = (e) => {
        const file = e.target.files[0];
        setImg({
            preview: URL.createObjectURL(file),
            data: file,
        });
    };

    const uploadProfileImg = async () => {

        if (!img.data) {
            alert('No image selected');
            return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append('file', img.data);

        try {
            const uploadResponse = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const profileImageName = uploadResponse.data.profileimage;
            const profilePic = `${BASE_URL}/download/${profileImageName}`;
            return profilePic
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle the image upload error
        }
    };

    const updateurl = async (e) => {
        e.preventDefault();
        const url = await uploadProfileImg();
        // console.log(url)

        // Check if the image upload was successful
        if (url) {
            const profilePic = { profilePic: url }
            try {
                const updateResponse = await axios.put(`${BASE_URL}/update/profile-pic`, profilePic, CONFIG_OBJ);
                // Check the status of the second request
                console.log(updateResponse.status);
            } catch (updateError) {
                console.error('Error updating profile picture:', updateError);
            } finally {
                setUploading(false);
                fetchdata();
                handleClose();
            };
        } else {
            console.error('Image upload failed:');
            // Handle the failed image upload
        }
    }




    return (
        <>
            <Button className='fs-6 fw-bold text-dark' style={{ border: "none", backgroundColor: "transparent", padding: "0" }} onClick={handleShow}>
                Update Profile Picture
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Upload Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col">
                            <form>
                                <label htmlFor="imageUpload">Choose an image:</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    name="image"
                                    accept="image/*"
                                    onChange={setPreview}
                                />
                                {img.preview && (
                                    <img
                                        src={img.preview}
                                        alt="Preview"
                                        style={{ maxWidth: "100%", marginTop: "10px" }}
                                    />
                                )}
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={uploading}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" disabled={uploading} onClick={updateurl} >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UploadImg;
