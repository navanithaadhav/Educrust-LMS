import Header from "../../component/student/Header"
import { FaWhatsapp } from "react-icons/fa"

const Home = () => {
  return (
    <>
      <Header />
      <a
        href="https://wa.me/918778543730"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>
    </>
  )
}

export default Home