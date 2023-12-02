import * as React from 'react';
import { Link } from 'react-router-dom';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useHistory } from 'react-router';
import { useMediaQuery } from '@mui/material';

import logo from '../assets/beyou2.png';

const actions = [
  { icon: <HomeIcon />, name: 'Home', link: '/' },
  { icon: <StoreIcon />, name: 'Products', link: '/products' },
  { icon: <ShoppingCartIcon />, name: 'Cart', link: '/cart' },
];
const adminActions = [
  { icon: <DashboardIcon />, name: 'Dashboard', link: '/dashboard' },
  { icon: <LogoutIcon />, name: 'Sign out', link: '/signout' },
  { icon: <PostAddIcon />, name: 'Add Product', link: '/addproduct' },
];

export default function MediaMenu({ user, setIsAuth }) {
  const vertical = useMediaQuery('(max-width:400px)');
  const history = useHistory();
  const handleClick = (action) => {
    if (action.name === 'Sign out') {
      setIsAuth(false);
      localStorage.setItem('token', '');
      history.push('/signin');
      return;
    }
    history.push(action.link);
  };
  return (
    <div className='mediaHeader'>
      <Link to='/' className='header__logo'>
        <img src={logo} alt='logo' />
      </Link>
      {!user && (
        <Link to='/signin' className='mediaHeader__signin'>
          <AccountCircleIcon />
          Sign In
        </Link>
      )}
      <SpeedDial
        direction={vertical ? 'down' : 'right'}
        ariaLabel='SpeedDial basic example'
        sx={{ position: 'absolute', top: 10, left: 10 }}
        icon={<SpeedDialIcon />}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => history.push(action.link)}
          />
        ))}
        {user &&
          adminActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleClick(action)}
            />
          ))}
      </SpeedDial>
    </div>
  );
}
