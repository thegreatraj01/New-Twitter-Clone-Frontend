import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import img from '../../images/twitter-logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';


function Login() {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loder, setLoder] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);
  const isUser = Object.keys(user).length === 0 ? false : true;
  // console.log(Object.keys(user).length);


  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
    }
    if (!password) {
      setPasswordError('Password is required');
    }
    if (email && password) {
      const user = { email, password };
      try {
        setLoder(true);
        const resp = await axios.post(`${BASE_URL}/auth/login`, user);
        if (resp.status === 200) {
          setLoder(false);
          localStorage.setItem("veryfication-token", resp.data.result.token);
          localStorage.setItem("user", JSON.stringify(resp.data.result.user));

          setEmail("");
          setPassword("");

          dispatch({
            type: "LOGIN",
            payload: resp.data.result.user
          });

          toast.success('Login successful!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3500, // Close the toast after 3.5 seconds
            onClose: () => navigate('/explore') // Navigate when the toast is closed
          });
        }
      } catch (error) {
        setEmail("");
        setPassword("");
        setLoder(false);
        toast.error('Login failed. Please try again.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000, // Close the toast after 3 seconds
        });
        console.log('login error', error);
      }
    }
  };
  React.useEffect(() => {
    if (isUser) {
      // navigate('/profile/id');
    }
    // eslint-disable-next-line
  }, [isUser]);

  return (
    <div className="">

      <ToastContainer />
      {loder ? <div className="spinner-border text-primary mx-auto d-block m-1" role="status">
        <span className="sr-only"></span>
      </div> : ""
      }
      {showLogin && (
        <div className='container shadow mt-2'>
          <div className="row text-end">
            <Link to="/explore">
              <p onClick={() => setShowLogin(false)}> <CancelIcon /> </p>
            </Link>
          </div>
          <div className=' row '>
            <div className='col-6 d-flex mx-auto '>
              <img src={img} alt="logo" style={{ width: "20vw", margin: "auto" }} />
            </div>
          </div>

          <div className='col-6 mx-auto '>
            <form onSubmit={handleLogin}>
              <div className='mt-3  '>
                <input type="text" className="rounded-pill border w-100 p-2" placeholder='Email:' value={email} onChange={(e) => setEmail(e.target.value)} />
                {emailError && <p>{emailError}</p>}
              </div>

              <div className='mt-3 '>
                <input type="password" className="rounded-pill border w-100 p-2" placeholder='Password:' value={password}
                  onChange={(e) => setPassword(e.target.value)} />
                {passwordError && <p>{passwordError}</p>}
              </div>
              <button type='submit' className='btn btn-primary my-3 w-100 rounded-pill'> submit </button>
            </form>

            <div className=' p-3'>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <span className='text-secondary'> Dont Have An Account </span>
                <span className='text-primary'> Register Here </span>
              </Link>
            </div>
          </div>

        </div>)}

    </div>

  );
}

export default Login;
