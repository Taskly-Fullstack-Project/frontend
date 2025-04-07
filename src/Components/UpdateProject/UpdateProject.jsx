import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SideMenu from "../SideMenu/SideMenu";
import { authContext } from "../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Validation Schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long")
    .required("Name is required"),
  description: Yup.string().max(500, "Description too long"),
});

function UpdateProject() {
  const { token } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProject();
    }
  }, [id]);

  async function getProject() {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProject(response.data.data.project);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values) {
    try {
      const response = await axios.patch(
        `https://backend-production-574a.up.railway.app/api/v1/projects/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Project Updated Successfully");
      navigate("/myprojects");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }

  if (loading) {
    return <div className="p-6">Loading project data...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="max-[1080px]:hidden">
        <SideMenu />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Formik
          initialValues={{
            name: project?.name || "",
            description: project?.description || "",
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="p-4 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Update Project
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-5 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
                >
                  {isSubmitting ? "Updating..." : "Update Project"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UpdateProject;