import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";


import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const BACKEND_API_URL = process.env.REACT_APP_API_URL;


const columns = [
  {
    Header: "Title",
    accessor: "title",
    align: "left",
    Cell: ({ value, row }) => (
      <Link to={`/courses/${row.original.id}`} style={{ color: "#1A73E8" }}>
        {value}
      </Link>
    ),
  },
  { Header: "Description", accessor: "description", align: "left" },
  { Header: "Locked", accessor: "isLocked", align: "center" },
];

const CourseManagement = () => {
  const [rows, setRows] = useState([]);

  // Fetching courses data from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(BACKEND_API_URL+"/courses");
        const coursesData = response.data.map((course) => ({
          id: course._id,
          title: course.title,
          description: course.description,
          isLocked: course.isLocked ? "Yes" : "No",
        }));
        setRows(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDAlert mt={2} color="dark">
        <MDTypography variant="body2" color="white" fontWeight="medium">
          This is a PRO feature. Click
          <a
            href="https://www.creative-tim.com/product/material-dashboard-pro-react-nodejs"
            target="_blank"
            style={{ color: "#1A73E8" }}
          >
            &nbsp;here&nbsp;
          </a>
          to see the PRO version
        </MDTypography>
      </MDAlert>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Courses Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default CourseManagement;
