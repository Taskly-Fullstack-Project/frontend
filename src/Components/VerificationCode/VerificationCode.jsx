import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VerificationInput from "react-verification-input";
import logo from "./../../assets/images/logo4.png";
import logo2 from "./../../assets/images/logolatest.png";
import axios from "axios";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import Slider from "../mySlider/mySlider";


function VerificationCode() {
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};  
  const [code , setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false);


  async function verify(verificationToken) {
    
    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://backend-production-574a.up.railway.app/api/v1/users/verify",
      {
        verificationToken: String(verificationToken),
        email: String(email),
      }
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setIsLoading(false)
  }

  async function resendCode() {
    
    try {
      const response = await axios.post(
        "https://backend-production-574a.up.railway.app/api/v1/user/resendVerification",
      {
        email: String(email),
      }
      );
      toast.success(response.data.message)
    } catch (error) {
      
      toast.error(error.response.data.message)
    
    }
  }



  return (
    <div className="flex">
      <div className=" w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
       <img src={logo} alt="" className="w-[50px]"/>

        <div className=" lg:w-[80%] h-3/4 md:h-full mx-auto flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-black text-center mb-2">
            Welcome!
          </h2>
          <h2 className="text-3xl font-bold text-blue-500 text-center mb-5">
            Verification Code
          </h2>

          <div className="flex  justify-center  ">
            <div className="w-full  h-fit  max-w-md   p-6 rounded-lg ">
              <p className="my-5 text-center">
                Please enter the code sent to your email
              </p>

              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto mt-5 text-center">
                <VerificationInput
                  length={6}
                  autoFocus={true}
                  validChars={"/0-9/"}
                  onChange={(value) => setCode(value)}
                  classNames={{
                    container: "codeinput",
                    character: "char",
                    characterSelected: "character--selected",
                  }}
                />
              </div>

              <button
                type="submit"
                className="mx-auto mt-5 block w-full bg-blue-500 text-white hover:bg-blue-800
                 focus:ring-4 focus:outline-none focus:ring-blue-300 
                 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                 onClick={()=>{verify(code)}}
                 disabled={isLoading}
              >
                {isLoading ? (
                  <ScaleLoader width={2} height={10} color="#ffffff" />
                ) : (
                  "Send"
                )}
              </button>
              
              <p className="text-center mt-3 font-bold text-[#4B5563]">
                <Link onClick={()=>{resendCode()}} className=" underline hover:text-gray-500">Resend Code</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-[50vw] h-screen text-center  bg-blue-500 my-auto flex-col  py-10">
                <div>
                  <img
                    src={logo2}
                    alt=""
                    className=" w-[70%] lg:w-[60%] xl:w-[40%] mx-auto "
                  />
                </div>
                <div>
                   <Slider/>
                </div>
                <p className="p-3 text-white text-xl italic mt-24">
                  Organize, prioritize, and track your tasks effortlessly
                </p>
              </div>
    </div>
  );
}

export default VerificationCode;
