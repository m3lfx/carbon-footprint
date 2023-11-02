// import React, { useState } from 'react'
import Container from '@mui/material/Container';
import './App.css'
import ElectricityChart from './ElectricityChart'
import { Box } from '@mui/system';
import GasChart from './GasChart';


function App() {


  return (
    <Container maxWidth="lg">
      <Box sx={{ bgcolor: '#cfe8fc', }} >
        <ElectricityChart />
      </Box>
      <Box sx={{ bgcolor: 'white', }} >
        <GasChart />
      </Box>

    </Container>
  )
}

export default App
