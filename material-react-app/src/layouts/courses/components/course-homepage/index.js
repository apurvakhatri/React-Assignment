import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDAlert from "components/MDAlert";

// Material UI Icons
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const CourseHomePage = () => {
  const { course_id } = useParams(); // Get course_id from the URL
  const [course, setCourse] = useState(null); // Store course data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch course data from the backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/courses/${course_id}`); // Replace with your backend URL
        const courseData = response.data;

        // Ensure the first module is unlocked
        if (courseData.Modules.length > 0) {
          courseData.Modules[0].isLocked = false;
        }

        setCourse(courseData); // Set course data
        setLoading(false); // Set loading to false
      } catch (err) {
        setError("Failed to fetch course data.");
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course_id]);

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

  // Separate modules into unlocked and locked
  const unlockedModules = course.Modules.filter((module) => !module.isLocked);
  const lockedModules = course.Modules.filter((module) => module.isLocked);

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
          <MDTypography variant="body2" color={course.isLocked ? "error" : "success"}>
            {course.isLocked ? "Course is locked" : "Course is unlocked"}
          </MDTypography>
        </MDBox>

        {/* Divider */}
        <Divider />

        {/* Modules Section */}
        <MDBox pt={2}>
          <Grid container spacing={4}>
            {/* Render Unlocked Modules First */}
            {unlockedModules.map((module) => (
              <Grid item xs={12} key={module.id}>
                <Card>
                  <MDBox p={3}>
                    {/* Module Title */}
                    <MDTypography variant="h5" fontWeight="bold">
                      {module.title}
                    </MDTypography>

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

                    {/* Module Text */}
                    <MDBox mt={2}>
                      <MDTypography variant="body2" color="text">
                        <strong>Text:</strong> {module.text}
                      </MDTypography>
                    </MDBox>

                    {/* Module Lock Status */}
                    <MDBox mt={2} display="flex" alignItems="center">
                      <LockOpenIcon fontSize="small" color="success" />
                      <MDTypography variant="body2" color="success" ml={1}>
                        Unlocked
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}

            {/* Render Locked Modules Below */}
            {lockedModules.map((module) => (
              <Grid item xs={12} key={module.id}>
                <Card>
                  <MDBox p={3}>
                    {/* Module Title */}
                    <MDTypography variant="h5" fontWeight="bold">
                      {module.title}
                    </MDTypography>

                    {/* Locked Message */}
                    <MDBox mt={2} display="flex" alignItems="center">
                      <LockIcon fontSize="small" color="error" />
                      <MDTypography variant="body2" color="error" ml={1}>
                        Content Locked
                      </MDTypography>
                    </MDBox>
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
