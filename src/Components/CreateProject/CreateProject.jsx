import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideMenu from "../SideMenu/SideMenu";
import { authContext } from "../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long")
    .required("Name is required"),
  description: Yup.string().max(500, "Description too long"),
});

const initialValues = {
  name: "",
  description: "",
};

function CreateProject() {
  const { token } = useContext(authContext);
  const navigate = useNavigate();
  const [projectImage, setProjectImage] = useState(null);

  async function handleSubmit(values, { setSubmitting }) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (projectImage) {
        formData.append("photo", projectImage);
      }

      const response = await axios.post(
        "https://backend-production-574a.up.railway.app/api/v1/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Project Created Successfully");
      navigate("/myprojects");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="max-[1080px]:hidden">
        <SideMenu />
      </div>

      <div className="flex-1 p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="p-4 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Create Project
                </h2>

                {/* Project Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600"
                  >
                    Project Name
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Project Name"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-600"
                  >
                    Description
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    placeholder="Describe your project"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Project Image Upload */}
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="text-sm font-medium text-gray-600"
                  >
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProjectImage(e.currentTarget.files[0])}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-5 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <ScaleLoader width={2} height={10} color="#ffffff" />
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateProject;
