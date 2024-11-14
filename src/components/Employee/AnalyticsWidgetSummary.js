import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';

// Thêm các thành phần Chart.js
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function AnalyticsWidgetSummaryEmployee({ chart, color = 'primary', sx, ...other }) {
    const theme = useTheme();

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };

    return (
        <Box sx={{ width: 84, height: 56, ...sx }} {...other}>
            <Line
                data={{
                    labels: chart.categories,
                    datasets: [
                        {
                            data: chart.series,
                            borderColor: theme.palette[color].main,
                            backgroundColor: theme.palette[color].light,
                            tension: 0.4,
                            fill: true,
                        },
                    ],
                }}
                options={chartOptions}
            />
        </Box>
    );
}