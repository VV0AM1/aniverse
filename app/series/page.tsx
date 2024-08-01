import * as React from 'react';
import NavBar from './NavBar';
import "./global.css";
import Card from './Card';
import Home from './Home';


export default function BasicPagination() {
  return (
    <div>
          <NavBar/>
          <Home>
            <Card name={'BLUE LOCK'}>
            </Card>
          </Home>
    </div>
  );
}





