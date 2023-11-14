import React from 'react';
import SearchIcon from '@mui/icons-material/Search';


const RightSide = () => {
  return (
    <div className="m-3 p-2 icons rounded-4 mx-2">
      <div className="position-relative">
        <SearchIcon className="position-absolute " style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
        <input type="text" className="form-control rounded-pill px-2 " />
      </div>
      <h2 className="fw-bold">Trending</h2>
      <p className="fw-bold">#gryffindor</p>
      <p className="fw-bold">#hufflepuff</p>
      <p className="fw-bold">#slytherin</p>
      <p className="fw-bold">#ravenclaw</p>
    </div>
  )
}

export default RightSide;

