import { useNavigate } from 'react-router-dom';
import homeImage from '../../assets/images/home/Image.png';
const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
    return (
      <div className="onboarding-container">
        <img src={homeImage} alt="home" className="home-Image" /> 
        <div className="about-section">
          <p className= "name">RetroCraft Hub</p>
          <p className="about">
         The Premium platform connecting talented actors with visionary producers! Whether you're an aspiring actor seeking exciting opportunities or a seasoned producer in search of the perfect talent for your next project, our platform is designed to meet your needs.      </p>
        <button type="button" className='btn-home' onClick={handleClick}>Let's Go</button>
        </div>
      </div>
    );
  };

  export default Home;