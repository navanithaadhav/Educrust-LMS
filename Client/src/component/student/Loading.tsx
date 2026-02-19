import { assets } from '../../assets/assets';

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center relative'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin absolute'></div>
      {assets && assets.logo && <img src={assets.logo} alt="Loading..." className='w-8 sm:w-10 animate-pulse' />}
    </div>
  )
}

export default Loading