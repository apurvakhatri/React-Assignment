import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";


import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDAlert from "components/MDAlert";


import LockIcon from "@mui/icons-material/Lock";
const BACKEND_API_URL = process.env.REACT_APP_API_URL;

const CourseHomePage = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(BACKEND_API_URL+`/courses/${course_id}`);
        const courseData = response.data;
        console.log(courseData)

        setCourse(courseData); // Setting course data
        setLoading(false);

        const modulePromises = courseData.modules.map((moduleId) =>
          axios.get(BACKEND_API_URL+`/modules/${moduleId}`).catch(() => null) // Handle individual module fetch failures
        );
        const modulesData = await Promise.all(modulePromises);
        setModules(modulesData.filter((mod) => mod !== null).map((mod) => mod.data)); // Only use successful module fetches


      } catch (err) {
        setError("Failed to fetch course or module data.");
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course_id]);

  // Unlock course handler
  const unlockCourse = async () => {
    try {
      await axios.put(BACKEND_API_URL + `/courses/${course_id}/unlock`); // Backend API to unlock course
      setCourse({ ...course, isLocked: false }); // Update course state to unlocked
    } catch (err) {
      setError("Failed to unlock course.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDTypography variant="h4">Loading...</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <MDAlert color="error">{error}</MDAlert>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={3} mb={3}>
        {/* Course Title and Description */}
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold">
            {course.title}
          </MDTypography>
          <MDTypography variant="body1" color="text">
            {course.Description}
          </MDTypography>
        </MDBox>

        {/* Lock Status */}
        <MDBox mt={2}>
          {course.isLocked ? (
            <MDBox display="flex" alignItems="center">
              <MDTypography variant="body2" color="error" fontWeight="bold">
                Course is Locked. Purchase to view all content
              </MDTypography>
              <MDButton
                variant="contained"
                color="primary"
                size="small"
                onClick={unlockCourse}
                style={{ marginLeft: "10px" }}
              >
                Unlock Course
              </MDButton>
            </MDBox>
          ) : (
            <MDTypography variant="body2" color="success">
              Course is unlocked
            </MDTypography>
          )}
        </MDBox>


        <Divider />


        <MDBox pt={2}>
          <Grid container spacing={4}>
            {modules.map((module, index) => (
              <Grid item xs={12} key={module.id}>
                <Card>
                  <MDBox p={3}>
                    {/* Module Title */}
                    <MDTypography variant="h5" fontWeight="bold">
                      {module.title}
                    </MDTypography>

                    {/* Module Text */}
                    <MDBox mt={2}>
                      <MDTypography variant="body2" color="text">
                        <strong>Text:</strong> {module.text}
                      </MDTypography>
                    </MDBox>

                    {(!course.isLocked || index === 0) ? (
                      <>
                        {/* Module Slide (PDF) */}
                        {module.slide && (
                          <MDBox mt={2}>
                            <iframe
                              src={module.slide}
                              width="100%"
                              height="500px"
                              title="PDF Document"
                              frameBorder="0"
                            ></iframe>
                          </MDBox>
                        )}

                        {/* Module Video */}
                        {module.video && (
                          <MDBox mt={2}>
                            {module.video.includes("youtube.com") ? (
                              <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${module.video.split("v=")[1]}`} // Extract YouTube video ID
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <MDTypography variant="body2" color="text">
                                <strong>Video:</strong> {module.video}
                              </MDTypography>
                            )}
                          </MDBox>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Locked Message for Slides and Videos */}
                        <MDBox mt={2} display="flex" alignItems="center">
                          <LockIcon fontSize="small" color="error" />
                          <MDTypography variant="body2" color="error" ml={1}>
                            Content Locked
                          </MDTypography>
                        </MDBox>
                      </>
                    )}
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default CourseHomePage;
