import React from 'react';
import { Link } from "react-router-dom";

const Navigation = () => (
    <nav>
      <ul>
        <li> <Link to="/profile">profile</Link> </li>
        <li> <Link to="/pchat">personal chat</Link> </li>
        <li> <Link to="/tchat">team chat</Link> </li>
        <li> <Link to="/setting">setting</Link> </li>
      </ul>
    </nav>
  );
  export default Navigation;