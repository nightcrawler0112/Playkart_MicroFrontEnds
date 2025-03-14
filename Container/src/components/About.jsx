import React from "react";
import logo from "../images/logo.png";
import "./header.css";

const About = () => {
  return (
    <div className="bg-secondary d-flex flex-column justify-content-center align-items-center text-white p-6 ">
      <h1 className="text-center p-2  ">STYLES AND SPORTSWEAR AT PLAYKART</h1>
      <br></br>
      <p className="p-2 m-2 text-center ">
        <b>
          Sport keeps us fit. Keeps you mindful. Brings us together. Through
          sport we have the power to change lives. Whether it is through stories
          of inspiring athletes. Helping you to get up and get moving.
          Sportswear featuring the latest technologies, to up your performance.
          Beat your PB. offers a home to the runner, the basketball player, the
          soccer kid, the fitness enthusiast. The weekend hiker that loves to
          escape the city. The yoga teacher that spreads the moves. The
          3-Stripes are seen in the music scene. On stage, at festivals. Our
          sports clothing keeps you focused before that whistle blows. During
          the race. And at the finish lines.
          <br></br>
          <br></br>
          We’re here to support creators. Improve their game. Their lives. And
          change the world. Playkart is about more than sportswear and workout
          clothes. We partner with the best in the industry to co-create. This
          way we offer our fans the sports apparel and style that match their
          athletic needs, while keeping sustainability in mind. We’re here to
          support creators. Improve their game. Create change. And we think
          about the impact we have on our world.
        </b>
      </p>
      <div className="w-50 d-flex justify-content-center">
        <img src={logo} alt="Playkart" className="w-25 p-4" />
      </div>
    </div>
  );
};

export default About;
