import AlternativeNavbar from '../components/AlternativeNavbar';
import MainNavbar from '../components/MainNavbar';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();

  const handleNavbarSelection = ()=>{
    if(location.pathname.includes("/weekieTalkie/popular") || location.pathname.includes("/users/profile/") || location.pathname.includes("/posts/")){
      return (
        < AlternativeNavbar />
      )
    }

    return (
      < MainNavbar />
    )
  }
  
  return (
    <>
        {
          handleNavbarSelection()
        }
        <Outlet />
    </>
  )
}

export default MainLayout;