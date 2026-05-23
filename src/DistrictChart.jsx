import { useEffect, useRef } from 'react';
import * as echarts from 'echarts'; 

export const DistrictChart = ({ data, cityName }) => {
 
  const chartRef = useRef(null);

  
  useEffect(() => {
   
    if (!data || data.length === 0 || !chartRef.current) return;

   
    const stats = {};
    data.forEach(item => {
      const dist = item.district || "unknown district";
      if (!stats[dist]) {
        
        stats[dist] = { hospital: 0, clinic: 0, doctors: 0 }; 
      }
      
      if (item.type === 'hospital') stats[dist].hospital += 1;
      else if (item.type === 'clinic') stats[dist].clinic += 1;
      else stats[dist].doctors += 1; 
    });

    // 排序并截取前 12 名
    const sortedDistricts = Object.entries(stats)
      .sort((a, b) => (b[1].hospital + b[1].clinic + b[1].doctors) - (a[1].hospital + a[1].clinic + a[1].doctors))
      .slice(0, 12); 

    const xAxisData = sortedDistricts.map(d => d[0]);
    const hospitalData = sortedDistricts.map(d => d[1].hospital);
    const clinicData = sortedDistricts.map(d => d[1].clinic);
    const doctorsData = sortedDistricts.map(d => d[1].doctors);

  
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: `${cityName} 各区医疗资源分布 (Top 12)`,
        textStyle: { color: '#e2e8f0', fontSize: 15, fontWeight: 'bold' },
        top: 0, left: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' }
      },
      legend: {
        data: ['Hospital 🏥', 'Clinic 🩺', 'doctors 💉'],
        textStyle: { color: '#94a3b8' },
        top: '15%', right: 0
      },
      grid: { left: '0%', right: '2%', bottom: '5%', top: '25%', containLabel: true },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: { color: '#94a3b8', interval: 0, rotate: 35, fontSize: 10 },
        axisLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
        axisLabel: { color: '#94a3b8' }
      },
      series: [
        {
          name: 'Hospital 🏥', type: 'bar', stack: 'total', barWidth: '50%',
          itemStyle: { color: '#ef4444', borderRadius: [0, 0, 0, 0] }, 
          data: hospitalData
        },
        {
          name: 'Clinic 🩺', type: 'bar', stack: 'total',
          itemStyle: { color: '#3b82f6', borderRadius: [0, 0, 0, 0] }, 
          data: clinicData
        },
        {
          name: 'doctors 💉', type: 'bar', stack: 'total',
          itemStyle: { color: '#089e62', borderRadius: [4, 4, 0, 0] }, 
          data: doctorsData
        }
      ]
    };

    
    const chartInstance = echarts.init(chartRef.current, null, { renderer: 'svg' });
    chartInstance.setOption(option);

    
    const handleResize = () => chartInstance.resize();
    window.addEventListener('resize', handleResize);

   
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose(); 
    };
  }, [data, cityName]); 

  
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
        calculating districts
      </div>
    );
  }

 
  return <div ref={chartRef} style={{ height: '100%', width: '100%' }} />;
};