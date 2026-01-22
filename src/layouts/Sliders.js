import Carousel from "react-bootstrap/Carousel";

import slider1 from "../assets/images/bg/Sliders/1.png";
import slider2 from "../assets/images/bg/Sliders/2.png";

import { useEffect, useState } from "react";
import { getSliderListApi } from "../services/api";
import { getDataFromApi } from "../services/commonServices";

const Sliders = () => {
  // const slides = [slider1, slider2];
  const [slides,setSlides]=useState([slider1])
  useEffect(() => {
    getSlidersListFunc();
    const handleStorageChange = (event) => {
      if (event.key === "user-logged-in") {
        localStorage.removeItem('user-logged-in');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  /**
   * get All sliders using api
   */
  const getSlidersListFunc= async() => {
    try {
      const res = await getDataFromApi(getSliderListApi+'?search=&show_all_users=true','','',1);

      if (res?.status === 200) {
        let slideimages=[]
        res.data.data.forEach((singleSlide) => {
          if(singleSlide.is_active){
            slideimages.push(singleSlide.slider_image)
          }
        });
        setSlides(slideimages)
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  }
  return (
    <Carousel fade controls={false} slide={false} className="tcrcLogo_login_bg" interval={3000}
      pause={false}>
      {slides.map((slide, slideIndex) => (
        <Carousel.Item key={"Slide" + slideIndex}>
          <img src={slide} alt={slide} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Sliders;
