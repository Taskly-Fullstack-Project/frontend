import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../../assets/images/logo4.png";
import logo2 from "./../../assets/images/logolatest.png";

import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";
import Slider from "../mySlider/mySlider";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const user = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Must be 3 or more characters")
      .max(50, "Must be 50 characters or less")
      .required("this field is required"),
    lastName: Yup.string()
      .min(3, "Must be 3 or more characters")
      .max(50, "Must be 50 characters or less")
      .required("this field is required"),
    username: Yup.string()
      .min(3, "Must be 3 or more characters")
      .max(50, "Must be 50 characters or less")
      .required("this field is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("this field is required"),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        "password must be 8 or more characters with uppercase , lowercase and digits"
      )
      .required("this field is required"),
  });

  async function signup(values) {

    setIsLoading(true);
    try {

      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      if (profilePic) {
        formData.append('photo', profilePic);
      }
     
      const response = await axios.post(
        "https://backend-production-574a.up.railway.app/api/v1/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      navigate("/verificationcode", { state: { email: values.email } });
    } catch (error) {
      toast.error(error.response.data.message);
       
    }
    setIsLoading(false);
  }

  const formik = useFormik({
    initialValues: user,
    onSubmit: signup,
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="flex">
        <div className=" w-screen h-screen md:w-[60vw] px-12 pt-3 pb-12 ">
          
          <img src={logo} alt="" className="w-[50px]" />

          <div className=" lg:w-[80%] h-3/4 md:h-full mx-auto flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-black text-center mb-0">
              Welcome!
            </h2>
            <h2 className="text-3xl font-bold text-blue-500 text-center mb-4">
              Create an account
            </h2>

            <form onSubmit={formik.handleSubmit}>
              <ProfilePhoto image={profilePic} setImage={setProfilePic} />

              <div className="flex gap-3">
                <div className="w-[50%]">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    firstName
                  </label>
                  <input
                    value={formik.values.firstName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                  {formik.errors.firstName && formik.touched.firstName ? (
                    <div
                      class="p-1 ps-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span class="font-medium me-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </span>{" "}
                      {formik.errors.firstName}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="w-[50%]">
                  <label
                    htmlFor="lastName"
                    className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    lastName
                  </label>
                  <input
                    value={formik.values.lastName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                  {formik.errors.lastName && formik.touched.lastName ? (
                    <div
                      class="p-1 ps-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span class="font-medium me-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </span>{" "}
                      {formik.errors.lastName}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <label
                htmlFor="userName"
                className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                userName
              </label>
              <input
                value={formik.values.username}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                id="username"
                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
              {formik.errors.username && formik.touched.username ? (
                <div
                  class="p-1 ps-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span class="font-medium me-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </span>{" "}
                  {formik.errors.username}
                </div>
              ) : (
                ""
              )}

              <label
                htmlFor="email"
                className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                name="email"
                id="email"
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.errors.email && formik.touched.email ? (
                <div
                  class="p-1 ps-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span class="font-medium me-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </span>{" "}
                  {formik.errors.email}
                </div>
              ) : (
                ""
              )}

              <label
                htmlFor="password"
                className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                password
              </label>
              <div className="flex justify-between items-center w-full px-4  mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Min 8 characters"
                  required
                  className="w-full focus:outline-none py-2 "
                />
                {showPassword ? (
                  <FaRegEye
                    size={22}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => toggleShowPassword()}
                  />
                ) : (
                  <FaRegEyeSlash
                    size={22}
                    className="text-slate-400 cursor-pointer"
                    onClick={() => toggleShowPassword()}
                  />
                )}
              </div>
              {formik.errors.password && formik.touched.password ? (
                <div
                  class="p-1 ps-4 mb-1 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span class="font-medium me-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </span>{" "}
                  {formik.errors.password}
                </div>
              ) : (
                ""
              )}

              <button
                type="submit"
                className="w-full mb-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ScaleLoader width={2} height={20} color="#ffffff" />
                ) : (
                  "SignUp"
                )}
              </button>
              <p className="text-center">
                Already have an account?{" "}
                <Link to={"/login"} className="text-blue-600 underline ">
                  Login
                </Link>
              </p>
            </form>
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
    </>
  );
}

export default SignUp;
