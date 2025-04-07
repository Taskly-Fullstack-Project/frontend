import React, { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { authContext } from "../../Context/AuthContext";
import { ScaleLoader } from "react-spinners";

import logo from "./../../assets/images/logo4.png";
import logo2 from "./../../assets/images/logolatest.png";
import taskImg from "./../../assets/images/task_bg.png";


function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // const { settoken } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const user = {
    usernameOrEmail: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({

    usernameOrEmail: Yup.string().required("this field is required"),

    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
        "password must be 8 or more characters with uppercase , lowercase and digits"
      )
      .required("this field is required"),

  });

  async function signin(values) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://backend-production-574a.up.railway.app/api/v1/users/login",
        values
      );
      // console.log(response);
      setIsLoading(false);
      // settoken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  }

  const formik = useFormik({
    initialValues: user,
    onSubmit: signin,
    validationSchema: validationSchema,
  });

  return (
    <div className="flex">
      <div className=" w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12  ">
        <img src={logo} alt="" className="w-[50px]" />

        <div className=" lg:w-[80%] h-3/4 md:h-full mx-auto  flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-black text-center mb-2">
            Welcome!
          </h2>
          <h2 className="text-3xl font-bold text-blue-500 text-center mb-5">
            Login
          </h2>

          <form onSubmit={formik.handleSubmit}>
            <label
              htmlFor="email"
              className="block mb-2 ps-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              value={formik.values.usernameOrEmail}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              name="usernameOrEmail"
              id="email"
              placeholder="name@example.com"
              required
              className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.usernameOrEmail && formik.touched.usernameOrEmail ? (
              <div
                class="p-1 ps-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span class="font-medium me-2">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                </span>{" "}
                {formik.errors.usernameOrEmail}
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
            <div className="flex justify-between items-center w-full px-4  mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                class="p-1 ps-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
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
              disabled={isLoading} // Optional: disable while loading
            >
              {isLoading ? (
                <ScaleLoader width={2} height={20} color="#ffffff" />
              ) : (
                "Login"
              )}
            </button>

            <p className="text-center">
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-blue-600 underline ">
                SignUp
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
          <img
            src={taskImg}
            alt=""
            className=" w-[70%] lg:w-[55%] xl:w-[50%] mx-auto mt-20"
          />
        </div>
        <p className="p-3 text-white text-xl italic mt-24">
          Organize, prioritize, and track your tasks effortlessly
        </p>
      </div>
    </div>
  );
}

export default Login;
