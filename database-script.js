document.addEventListener('DOMContentLoaded', () => {
    const ibdpScoreFilter = document.getElementById('ibdp-score-filter');
    const ibdpScoreValue = document.getElementById('ibdp-score-value');
    const tuitionFeeFilter = document.getElementById('tuition-fee-filter');
    const tuitionFeeValue = document.getElementById('tuition-fee-value');
    const boardingFilter = document.getElementById('boarding-filter');
    const tableBody = document.querySelector('#schools-table tbody');
    const tableHeaders = document.querySelectorAll('#schools-table th');
    const chartCanvas = document.getElementById('schools-chart');
    const scatterCanvas = document.getElementById('scatter-plot');
    const plotTypeSelect = document.getElementById('plot-type-select');

    let schoolsData = [];
    let chart;
    let scatterChart;
    let sortState = {
        column: 'ibdp_average_2024',
        direction: 'desc'
    };

    async function fetchData() {
        try {
            const response = await fetch('data/schools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            schoolsData = await response.json();
            
            // Calculate 3-year average
            schoolsData.forEach(school => {
                const scores = [school.ibdp_average_2024, school.ibdp_average_2023, school.ibdp_average_2022].filter(s => s && !isNaN(s));
                if (scores.length > 0) {
                    const sum = scores.reduce((a, b) => a + b, 0);
                    school.ibdp_average_3y = (sum / scores.length).toFixed(1);
                } else {
                    school.ibdp_average_3y = 'N/A';
                }
            });

            // Initial render
            updateFilters();
            filterAndRender();
        } catch (error) {
            console.error("Could not fetch school data:", error);
            tableBody.innerHTML = `<tr><td colspan="8">Error loading data. Please try again later.</td></tr>`;
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8">No schools match the current filters.</td></tr>`;
            return;
        }

        data.forEach(school => {
            const row = document.createElement('tr');
            const tuitionText = school.tuition_fees_2025.max ? `S$${school.tuition_fees_2025.max.toLocaleString()}` : 'N/A';
            const boardingText = school.boarding.toLowerCase().includes('available') ? 'Yes' : 'No';

            row.innerHTML = `
                <td>${school.name}</td>
                <td>${school.ibdp_average_2024 || 'N/A'}</td>
                <td>${school.ibdp_average_2023 || 'N/A'}</td>
                <td>${school.ibdp_average_2022 || 'N/A'}</td>
                <td>${school.ibdp_average_3y}</td>
                <td>${school.tuition_fees_2025.raw || 'N/A'}</td>
                <td>${tuitionText}</td>
                <td>${boardingText}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderChart(data) {
        const chartData = {
            labels: data.map(s => s.name),
            datasets: [{
                label: '2024 IBDP Average Score',
                data: data.map(s => s.ibdp_average_2024),
                backgroundColor: 'rgba(0, 105, 92, 0.6)',
                borderColor: 'rgba(0, 77, 64, 1)',
                borderWidth: 1,
                yAxisID: 'y'
            }, {
                label: 'Max Annual Tuition (SGD)',
                data: data.map(s => s.tuition_fees_2025.max),
                backgroundColor: 'rgba(199, 164, 110, 0.6)',
                borderColor: 'rgba(199, 164, 110, 1)',
                borderWidth: 1,
                yAxisID: 'y1'
            }]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 90,
                            minRotation: 90
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'IBDP Score'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Tuition Fee (SGD)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    if (context.dataset.yAxisID === 'y1') {
                                        label += new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(context.parsed.y);
                                    } else {
                                        label += context.parsed.y;
                                    }
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };

        if (chart) {
            chart.destroy();
        }
        chart = new Chart(chartCanvas, config);
    }

    function renderScatterPlot(data, plotType = '3y_avg') {
        const yAxisKey = plotType === '2024' ? 'ibdp_average_2024' : 'ibdp_average_3y';
        const yAxisLabel = plotType === '2024' ? '2024 IBDP Score' : '3Y Average IBDP Score';

        const scatterData = data.map(school => ({
            x: school.tuition_fees_2025.max,
            y: parseFloat(school[yAxisKey]),
            label: school.name
        })).filter(d => d.x && d.y && !isNaN(d.y));

        const chartData = {
            datasets: [{
                label: `${yAxisLabel} vs. Max Fees`,
                data: scatterData,
                backgroundColor: 'rgba(0, 77, 64, 0.6)',
                borderColor: 'rgba(0, 77, 64, 1)',
            }]
        };

        const config = {
            type: 'scatter',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Max Annual Tuition (SGD)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD', notation: 'compact' }).format(value);
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisLabel
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: a=>`${a.raw.label}: (${new Intl.NumberFormat("en-SG",{style:"currency",currency:"SGD"}).format(a.raw.x)}, ${a.raw.y})`
                        }
                    }
                }
            }
        };

        if (scatterChart) {
            scatterChart.destroy();
        }
        scatterChart = new Chart(scatterCanvas, config);
    }

    function filterAndRender() {
        const score = parseFloat(ibdpScoreFilter.value);
        const tuition = parseFloat(tuitionFeeFilter.value);
        const boarding = boardingFilter.value;

        let filteredData = schoolsData.filter(school => {
            const schoolScore = school.ibdp_average_2024 || 0;
            const schoolTuition = school.tuition_fees_2025.max || 0;
            const hasBoarding = school.boarding.toLowerCase().includes('available');

            const scoreMatch = schoolScore >= score;
            const tuitionMatch = schoolTuition <= tuition || schoolTuition === 0;
            const boardingMatch = (boarding === 'all') ||
                                  (boarding === 'yes' && hasBoarding) ||
                                  (boarding === 'no' && !hasBoarding);

            return scoreMatch && tuitionMatch && boardingMatch;
        });

        sortData(filteredData);
        renderTable(filteredData);
        renderChart(filteredData);
        renderScatterPlot(filteredData, plotTypeSelect.value);
    }

    function sortData(data) {
        data.sort((a, b) => {
            let valA, valB;

            if (sortState.column === 'tuition_fees_2025_max') {
                valA = a.tuition_fees_2025.max || 0;
                valB = b.tuition_fees_2025.max || 0;
            } else if (sortState.column === 'boarding') {
                valA = a.boarding.toLowerCase().includes('available');
                valB = b.boarding.toLowerCase().includes('available');
            } else {
                valA = a[sortState.column] || (String(a[sortState.column]).includes('N/A') ? 0 : '');
                valB = b[sortState.column] || (String(b[sortState.column]).includes('N/A') ? 0 : '');
            }

            if (valA < valB) {
                return sortState.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortState.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    function updateFilters() {
        ibdpScoreValue.textContent = ibdpScoreFilter.value;
        tuitionFeeValue.textContent = `S$${parseInt(tuitionFeeFilter.value).toLocaleString()}`;
    }

    // Event Listeners
    ibdpScoreFilter.addEventListener('input', () => {
        updateFilters();
        filterAndRender();
    });

    tuitionFeeFilter.addEventListener('input', () => {
        updateFilters();
        filterAndRender();
    });

    boardingFilter.addEventListener('change', filterAndRender);
    plotTypeSelect.addEventListener('change', filterAndRender);

    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            if(!column) return;
            if (sortState.column === column) {
                sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortState.column = column;
                sortState.direction = 'asc';
            }
            filterAndRender();
        });
    });

    // Initial Load
    fetchData();
});
