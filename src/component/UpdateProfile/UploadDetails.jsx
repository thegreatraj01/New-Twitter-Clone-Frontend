import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CONFIG_OBJ, { BASE_URL } from '../../Config';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const UploadDetails = ({ fetchdata }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        dateOfBirth: '',
    });

    // { name, location, dateOfBirth }
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location || !formData.dateOfBirth) {
            alert("Plese Fill All Frilds")
        }
        try {
            const resp = await axios.put(`${BASE_URL}/auth/updateuser`, formData, CONFIG_OBJ);
            if (resp.status === 200) {
                dispatch({ type: 'LOGIN', payload: resp.data.result });
            }
        } catch (error) {
            console.log(error);
        }
        setFormData({});
        fetchdata();
        handleClose(); // Close the modal after submission

    };

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setFormData({});
    }

    return (
        <>
            <Button className='fs-6 fw-bold text-dark' style={{ border: "none", backgroundColor: "transparent" }} onClick={handleShow}>
                Edit Profile
            </Button>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='mt-2'>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default UploadDetails;
