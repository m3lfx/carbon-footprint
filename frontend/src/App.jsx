import React, { useState } from 'react'
import Container from '@mui/material/Container';
import './App.css'
import ElectricityChart from './ElectricityChart'
import { Box, FormControlLabel, Radio, RadioGroup, FormLabel, FormControl } from '@mui/material';
import GasChart from './GasChart';


function App() {
  const [value, setValue] = useState('elec');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      {value === 'elec' ? <Box sx={{ bgcolor: '#cfe8fc', }} maxWidth="lg" >
        <ElectricityChart />
      </Box> :
        <Box sx={{ bgcolor: '#FCE5A4', }} >
          <GasChart />
        </Box>}
      <Box  >
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
            row={true}
          >
            <FormControlLabel value="elec" control={<Radio />} label="Electricity" />
            <FormControlLabel value="gas" control={<Radio />} label="Gas" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Container>
  )
}

export default App
