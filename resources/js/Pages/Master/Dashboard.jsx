import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import Homepage from '../Components/Homepage';
import { Head } from '@inertiajs/inertia-react';
import Chart from '../Components/Dashboard/Chart';
import Deposits from '../Components/Dashboard/Deposits';
import Orders from '../Components/Dashboard/Orders';


const Dashboard = (props) => {
  return (
    <Homepage>
      <Head title="Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Chart />
            </Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Deposits />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Orders />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Homepage>
  );
}

export default Dashboard;
