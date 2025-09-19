
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {

  // Always render the educator sidebar for the educator layout
  const { } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard', link: '/educator',icon:assets.home_icon },
    { name: 'Add Courses', link: '/educator/add-course',icon:assets.add_icon },
    { name: 'My Courses', link: '/educator/my-course',icon:assets.my_course_icon },
    { name: 'Student Enrolled', link: '/educator/student-enrolled',icon:assets.person_tick_icon },
  ];
  return (
  <div className='md:w-60 w-16 border-r border-gray-500 py-2 text-base bg-gray-100 min-h-screen flex flex-col '>
    {menuItems.map((item) => (
      <NavLink
      to={item.link}
      key={item.name}
      end={item.link === '/educator'}
      className={({isActive})=>`flex md:flex-row flex-col items-center md:justify-start justify-center   md:px-10 py-3.5 gap-3 ${isActive ? 'bg-blue-200 border-r-[6px] border-blue-400/90' : ' hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'} `}>
      
        <img src={item.icon} alt={item.name} className='w-6 h-6' />
        <p className='md:block hidden text-center'>{item.name}</p>
      </NavLink>
    ))}
  </div>
  )
}

export default Sidebar