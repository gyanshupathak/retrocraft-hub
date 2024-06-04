import { useNavigate } from "react-router-dom";
import homeImage from "../../assets/images/home/Image.png";
import logo from "../../assets/images/home/logo.png";
import BgVideo from "../../assets/images/home/BgVideo.mp4";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="onboarding-container">
      <video src={BgVideo} alt="home" autoPlay loop muted className="home-Video"/>
      <div className="about-section">
        
        <p className="name">RetroCraft Hub</p>
        <p className="about">
          The Premium platform connecting talented Artists with visionary
          producers! {" "}
        </p>
        <button type="button" className="btn-home" onClick={handleClick}>
          Let's Go
        </button>
      </div>
    </div>
  );
};

export default Home;
