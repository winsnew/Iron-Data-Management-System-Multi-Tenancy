import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { Head } from '@inertiajs/inertia-react';

// Generate Sales Data
// function createData(time, amount) {
//     return { time, amount: amount ?? null };
// }

// const data = [
//     createData('00:00', 0),
//     createData('03:00', 300),
//     createData('06:00', 600),
//     createData('09:00', 800),
//     createData('12:00', 1500),
//     createData('15:00', 2000),
//     createData('18:00', 2400),
//     createData('21:00', 2400),
//     createData('24:00'),
// ];

export default function Chart() {
    const theme = useTheme();
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/production-data')
            .then((response) => {
                const formattedData = response.data.map(item => ({
                    time: item.date,
                    amount: item.material_qty, // or `item.material_weight` depending on your use case
                }));
                setData(formattedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <React.Fragment>
            <Head title="Chart" />
            <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
                <LineChart
                    dataset={data}
                    margin={{
                        top: 16,
                        right: 20,
                        left: 70,
                        bottom: 30,
                    }}
                    xAxis={[
                        {
                            scaleType: 'point',
                            dataKey: 'time',
                            tickNumber: 2,
                            tickLabelStyle: theme.typography.body2,
                        },
                    ]}
                    yAxis={[
                        {
                            label: 'Material Quantity',
                            labelStyle: {
                                ...theme.typography.body1,
                                fill: theme.palette.text.primary,
                            },
                            tickLabelStyle: theme.typography.body2,
                            max: Math.max(...data.map(d => d.amount)) + 100,
                            tickNumber: 3,
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'amount',
                            showMark: false,
                            color: theme.palette.primary.light,
                        },
                    ]}
                    sx={{
                        [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                        [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                        [`& .${axisClasses.left} .${axisClasses.label}`]: {
                            transform: 'translateX(-25px)',
                        },
                    }}
                />
            </div>
        </React.Fragment>
    );
}