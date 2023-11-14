import React, { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import img from '../../images/twitter-logo.jpg'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';


function Register() {
  const navigate = useNavigate()

  const [shwoLogin, setShowLogin] = useState(true);
  const [loder, setLoder] = useState(false);

  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector(state => state.userReducer.user);
  const isUser = Object.keys(user).length === 0 ? false : true;
  // console.log(Object.keys(user).length);


  const notify = () => toast("Registration Successfull ", {
    type: toast.TYPE.SUCCESS,
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    onClose: () => navigate('/login')
  });
// console.log(img)

  // Use the trim method to remove any whitespace from the input values

  useEffect(() => {
    if (isUser) {
      navigate('/explore');
    }
    // eslint-disable-next-line
  }, [isUser]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Full Name is required');
    }
    if (!username.trim()) {
      setUsernameError('Username is required');
    }
    if (!email.trim()) {
      setEmailError('Email is required');
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
    }
    if (name && username && email && password) {
      try {

        const user = { name, username, email, password };
        setLoder(true);
        const resp = await axios.post(`${BASE_URL}/auth/register`, user);
        setName("");
        setUsername("");
        setEmail('');
        setPassword('');
        if (resp.status === 201) {
          setLoder(false);
          notify()
        } else if (resp.status === 400) {
        }
      } catch (error) {
        console.log('registeration error', error)
        setLoder(false);
        const notify2 = () => toast(`${error.response.data.error}`, {
          type: toast.TYPE.ERROR,
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
        notify2()
        setName("");
        setUsername("");
        setEmail('');
        setPassword('');

      }
    }

  };

  return (
    <div className="">
      <ToastContainer />
      {shwoLogin && (
        <div className='container shadow mt-2'>

          <div className="row text-end">
            <Link to="/explore">
              <span onClick={() => setShowLogin(false)}> <CancelIcon /> </span>
            </Link>
          </div>

          {loder ? <div className="spinner-border text-primary mx-auto d-block m-1" role="status">
            <span className="sr-only"></span>
          </div> : ""
          }

          <div className=' row '>
            <div className='col-6 d-flex mx-auto '>
              <img src={img} alt="logo" style={{ width: "16vw", margin: "auto" }} />
            
            </div>
          </div>

          <div className='col-6 mx-auto '>

            <form onSubmit={handleRegister}>
              <div className='mt-3  '>
                <input type="text" id='name' className="rounded-pill border w-100 p-2" placeholder='Full Name:' value={name} onChange={(e) => setName(e.target.value)} />
                {nameError && <p>{nameError}</p>}
              </div>
              <div className='mt-3  '>
                <input type="text" id='UserName' className="rounded-pill border w-100 p-2" placeholder='UserName:' value={username} onChange={(e) => setUsername(e.target.value)} />
                {usernameError && <p>{usernameError}</p>}
              </div>
              <div className='mt-3  '>
                <input type="text" id='email' className="rounded-pill border w-100 p-2" placeholder='Email:' value={email} onChange={(e) => setEmail(e.target.value)} />
                {emailError && <p>{emailError}</p>}
              </div>

              <div className='mt-3 '>
                <input type="password" id='password' className="rounded-pill border w-100 p-2" placeholder='Password:' value={password} onChange={(e) => setPassword(e.target.value)} />
                {passwordError && <p>{passwordError}</p>}
              </div>
              <button type='submit' className='btn btn-primary my-1 w-100 rounded-pill' > submit </button>
            </form>

            <div className=' p-3'>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <span className='text-secondary'> Already Have A Account  </span>
                <span className='text-primary'>Login Here </span>
              </Link>
            </div>
          </div>


        </div>)}

    </div >

  );
}

export default Register;
