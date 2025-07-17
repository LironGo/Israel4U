import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function D3Chart({ isLoggedIn, posts }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      setError(null);
      setHasData(false);
      // Load real data from backend
      const loadChartData = async () => {
        try {
          const API_BASE_URL = 'http://localhost:5001/api';
          const response = await fetch(`${API_BASE_URL}/stats/posts-per-month`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const chartData = await response.json();
            if (!Array.isArray(chartData) || chartData.length === 0) {
              setHasData(false);
              setLoading(false);
              return;
            }
            setHasData(true);
            // Transform data for D3.js
            const transformedData = chartData.map(item => ({
              month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
              posts: item.count
            }));

            // Create bar chart
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 200 - margin.top - margin.bottom;

            // Clear previous chart
            d3.select('#d3-chart').selectAll('*').remove();

            const svg = d3.select('#d3-chart')
              .append('svg')
              .attr('width', width + margin.right + margin.left)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

            // X axis
            const x = d3.scaleBand()
              .range([0, width])
              .domain(transformedData.map(d => d.month))
              .padding(0.2);

            svg.append('g')
              .attr('transform', `translate(0,${height})`)
              .call(d3.axisBottom(x));

            // Y axis
            const y = d3.scaleLinear()
              .domain([0, d3.max(transformedData, d => d.posts)])
              .range([height, 0]);

            svg.append('g')
              .call(d3.axisLeft(y).ticks(Math.max(1, d3.max(transformedData, d => d.posts)), 'd'));

            // Bars
            svg.selectAll('rect')
              .data(transformedData)
              .enter()
              .append('rect')
              .attr('x', d => x(d.month))
              .attr('y', d => y(d.posts))
              .attr('width', x.bandwidth())
              .attr('height', d => height - y(d.posts))
              .attr('fill', '#ff6b35')
              .attr('rx', 3); // Rounded corners
            setLoading(false);
          } else {
            setError('Failed to load statistics');
            setLoading(false);
          }
        } catch (error) {
          setError('Failed to load statistics');
          setLoading(false);
        }
      };

      loadChartData();
    }
  }, [isLoggedIn, posts]); // Re-run when posts change

  return (
    <div className="charts-section">
      <h3>Community Statistics</h3>
      {loading && <div style={{ textAlign: 'center', margin: '16px' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', margin: '16px' }}>{error}</div>}
      {!loading && !error && !hasData && <div style={{ textAlign: 'center', margin: '16px' }}>No data available</div>}
      <div id="d3-chart" className="d3-chart"></div>
      <p>Monthly posts activity</p>
    </div>
  );
}

export default D3Chart; 