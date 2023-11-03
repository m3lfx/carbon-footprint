import { useState, useEffect } from 'react'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
    Cell,
    LabelList
} from 'recharts';
import { Container, Switch, FormControlLabel, Typography } from '@mui/material';

import axios from "axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const GasChart = () => {
    const [points, setPoints] = useState([])
    const [line, setLine] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [checked, setChecked] = useState(false);
    const [regression, setRegression] = useState(false);

    // eslint-disable-next-line react/prop-types
    const CustomTooltip = ({ active, payload }) => {
        // console.log(payload)
        // eslint-disable-next-line react/prop-types
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              
              <p className="label">{`household : ${payload[0].payload.x}`}</p>
              <p className="label">{`gas : ${payload[0].payload.y}`}</p>
              
            </div>
          );
        }
      
        return null;
      };
    const userGas = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/api/v1/carbon-gas`)

            setPoints(data.data)
            setLine(data.result)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const handleChange = (event) => {
        setChecked(event.target.checked);
        setRegression(!checked)
    };
    useEffect(() => {
        userGas()
        if (error)
            console.log(error)

    }, [error])
    console.log(line)
   

    return (
        <Container width="90%" height="500px">
        {loading ? <h2>no data</h2> : (<ComposedChart
            width={800}
            height={600}
            data={points}
            margin={{
                top: 20,
                right: 80,
                bottom: 20,
                left: 20,
            }}

        >
            <CartesianGrid />
            <XAxis type="number" dataKey="y" name="electricity consumption" unit="LPG tanks" tickCount={10} />
            <YAxis
                type="number"
                dataKey="x"
                name="household number"
                unit="person"
                stroke="#8884d8" 
                tickCount={10}
                />

            {regression && <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />} />
            }
            {regression && <Line dataKey="x" data={line} dot={true} activeDot={{ r: 8 }} allowDuplicatedCategory={false} />}
            <Scatter name="electricity consumption" fill="#8884d8" allowDuplicatedCategory={false} data={regression && points}>
            <LabelList dataKey="y"  position="insideLeft" />
                {points.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Scatter>
        </ComposedChart>)}
        <FormControlLabel control={<Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />} label="Show Regression Line" />

        <Typography variant="h6" gutterBottom>
            household/gas
        </Typography>
    </Container>
    );
}
export default GasChart 