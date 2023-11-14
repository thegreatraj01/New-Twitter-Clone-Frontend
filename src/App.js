import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import LeftSidebar from './component/sidenavbar/Leftsidenav';
import RightSide from './component/sidenavbar/Rightside';
import Explore from './pages/Explore/Explore';
import Error from './component/Error/Error'; // Import the Error component
import { useSelector } from 'react-redux';

function App() {
  const location = useLocation();
  const user = useSelector(state => state.userReducer.user);
  const isUser = Object.keys(user).length === 0 ? false : true;
  // console.log(Object.keys(user).length);

  // Determine if the user is on the login or register page
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className='app row d-flex justify-content-center p-0 m-0'>
      {isLoginPage || isRegisterPage ? null : (
        <div className='col-3'>
          <LeftSidebar />
        </div>)
      }

      <div className='col-5 scrollable-content p-0 m-0'>
        <Routes>
          {isLoginPage && <Route path='/login' element={<Login />} />}
          {isRegisterPage && <Route path='/register' element={<Register />} />}

          {isUser ? <Route path='/' element={<Home />} /> :
            <Route path='/' element={<Explore />} />}
          {isUser && <Route path='/profile/:id' element={<Profile />} />}

          <Route path='/explore' element={<Explore />} />

          {/* Error route should be placed at the end */}
          <Route path='*' element={<Error />} />
        </Routes>
      </div>

      {isLoginPage || isRegisterPage ? null : (
        <div className='col-3'>
          <RightSide />
        </div>)
      }
    </div>
  );
}

export default App;
