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
} from 'recharts';
import { Container, Switch, FormControlLabel, Typography, Box, TextField, Button } from '@mui/material';
import { useLoading, Audio } from '@agney/react-loading';

import axios from "axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const ElectricityChart = () => {
    const [points, setPoints] = useState([])
    const [line, setLine] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [checked, setChecked] = useState(false);
    const [regression, setRegression] = useState(false)

    const [gradient, setGradient] = useState(0)
    const [yIntercept, setYIntercept] = useState(0)
    const [val, setVal] = useState('')
    const [predict, setPredict] = useState([])
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Audio width="50" />,
        loaderProps: {
            valueText: 'Fetching video from the Great Internet',
        },
    });


    const handleChange = (event) => {
        setChecked(event.target.checked);
        setRegression(!checked)
    };
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(`${import.meta.env.VITE_API}/api/v1/predict`, { value: val, type: 'electricity' }, config)
            console.log(data)
            setPredict(data.predict)
        } catch (error) {
            console.log(error)
        }

    }

    // eslint-disable-next-line react/prop-types
    const CustomTooltip = ({ active, payload }) => {
        console.log(payload)
        // eslint-disable-next-line react/prop-types
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">

                    <p className="label">{`household : ${payload[0].payload.x}`}</p>
                    <p className="label">{`electricity : ${payload[0].payload.y}`}</p>

                </div>
            );
        }

        return null;
    };
    const userElectricity = async () => {
        try {
            const { data, } = await axios.get(`${import.meta.env.VITE_API}/api/v1/carbon-electricity`)
            console.log(data)
            setPoints(data.data)
            setLine(data.result)
            setGradient(data.gradient)
            setYIntercept(data.yIntercept)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        userElectricity()
        if (error)
            console.log(error)

    }, [error])
    // console.log(gradient)
    return (
        // <Container width="90%" height="500px">
        //     {loading ? <h2>no data</h2> : (<ScatterChart
        //         width={800}
        //         height={600}
        //         margin={{
        //             top: 20,
        //             right: 20,
        //             bottom: 20,
        //             left: 20
        //         }} >
        //         <CartesianGrid />
        //         <XAxis type="number" dataKey="y" name="electricity consumption" unit="kwh" />
        //         <YAxis
        //             type="number"
        //             dataKey="x"
        //             name="household number"
        //             unit="person"
        //             stroke="#8884d8" />

        //         <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        //         <Scatter name="household" data={points} fill="#8884d8" />

        //     </ScatterChart>)}
        // </Container>
        // <ResponsiveContainer width="100%" height={500}>
        //     <ScatterChart
        //         margin={{
        //             top: 20,
        //             right: 20,
        //             bottom: 20,
        //             left: 20,

        //         }}
        //     >
        //         <CartesianGrid />
        //         <XAxis type="number" dataKey="x" name="stature" unit="cm" />
        //         <YAxis type="number" dataKey="y" name="weight" unit="kg" />
        //         <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        //         <Scatter name="A school" data={data} fill="#8884d8" />
        //     </ScatterChart>
        // </ResponsiveContainer>

        loading ? indicatorEl :
        (<Container width="lg" height="500px">
            {!regression ? <ScatterChart
                width={800}
                height={600}
                data={points}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 30
                }} >
                <CartesianGrid />
                <YAxis type="number" dataKey="y" name="electricity consumption" unit="pesos" />
                <XAxis
                    type="number"
                    dataKey="x"
                    name="household number"
                    unit="person"
                    stroke="#8884d8" />

                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="household" fill="#8884d8" >
                    {points.map((point, index) => (
                        <>

                            <Cell key={`cell-${index}`} fill={point.y <= 5000 ? "#0088FE" : (point.y >= 5001 && point.y <= 10000) ? "#00C49F" : (point.y >= 10001 && point.y <= 15000) ? '#FFBB28' : "red"} />
                        </>
                    ))}
                </Scatter>

            </ScatterChart> : (<ComposedChart
                width={800}
                height={600}
                data={points}
                margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 30,
                }}

            >
                <CartesianGrid />
                <YAxis type="number" dataKey="y" name="electricity consumption" unit="pesos" />
                <XAxis
                    type="number"
                    dataKey="x"
                    name="household number"
                    unit="person"
                    stroke="#8884d8" />

                {regression && <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip />} />
                }
                {regression && <Line dataKey="y" data={line} dot={true} activeDot={{ r: 8 }} allowDuplicatedCategory={false} />}
                <Scatter name="electricity consumption" fill="#8884d8" data={regression && points}>
                    {/* <Scatter name="household" dataKey="x"  fill="#8884d8" /> */}
                    {points.map((point, index) => (
                        <>

                            {/* <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> */}
                            <Cell key={`cell-${index}`} fill={point.y <= 5000 ? "#0088FE" : (point.y >= 5001 && point.y <= 10000) ? "#00C49F" : (point.y >= 10001 && point.y <= 15000) ? '#FFBB28' : "red"} />
                        </>
                    ))}
                </Scatter>
            </ComposedChart>)}
            <FormControlLabel control={<Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />} label="Show Regression Line" />

            <Typography variant="h6" gutterBottom>
                household/electricity
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                Gradient: {gradient} Y Intercept: {yIntercept}
            </Typography>
            <Box>
                <form
                    className="shadow-lg"
                    onSubmit={submitHandler}
                >
                    <TextField
                        type="text"
                        id="household"
                        className="form-control"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        required
                        label="Number of people in household"

                    />
                    <Box>
                        <Button size="small" variant="contained" type="submit">Predict</Button>
                    </Box>
                </form>
                <Typography variant="body2" display="block" gutterBottom>
                    Predicted Electricity consumption: {predict[1]} Kwh
                </Typography>
            </Box>
        </Container>)
    );
}
export default ElectricityChart 