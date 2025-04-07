import React from "react";
import Slider from "react-slick";
import img1 from "./../../assets/images/slider1-removebg-preview.png"
import img2 from "./../../assets/images/slider2-removebg-preview.png"
import img3 from "./../../assets/images/slider3-removebg-preview.png"
import img4 from "./../../assets/images/slider4-removebg-preview.png"




export default function mySlider(){
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:false,
    autoplay:true,
    autoplaySpeed:3000
  };
  return (

    <section className="px-10 mt-10 w-[95%] mx-auto">
        <div className="flex justify-center items-center">
        <div className="w-full">
        <Slider {...settings} className="">
       
        <img src={img1} alt="" className="w-[60%] h-[300px]"/>
        <img src={img2} alt="" className="w-[60%] h-[300px]" />
        <img src={img3} alt="" className="w-[60%] h-[300px]" />
        <img src={img4} alt="" className="w-[60%] h-[300px]" />
      
    </Slider>
    </div>
    
        </div>
    </section>
   
  );
}