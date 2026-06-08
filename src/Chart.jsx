import { useEffect, useRef } from 'react';
import * as echarts from 'echarts'; 

export const Chart = ({ data, cityName }) => {

    const chartRef = useRef(null);

    useEffect(() => {

        if (!data || data.length === 0 || !chartRef.current) return;

        const medical = {};

        data.forEach(item => {
            const type = item.type;
            
            if (!medical[type]) medical[type] = 0;
            
            medical[type] += 1;
        })

        // console.log(medical['hospital']);

        const pieChartData = Object.keys(medical).map(key => {
            return {
                name: key,
                value: medical[key],
            }
        });

        const chartInstance = echarts.init(chartRef.current);

        const option = {
            title: {
                text: `${cityName} 医疗机构类型分布`,
                textStyle: { color: '#e2e8f0', fontSize: 15, fontWeight: 'bold' },
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [{
                name: 'Types',
                type: 'pie',
                radius: '50%',
                data: pieChartData,
                center: ['50%', '50%'],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffestX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                }
            }]
        }

        chartInstance.setOption(option);

        const handleResize = () => {
            chartInstance.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chartInstance.dispose(); 
        }

    }, [data, cityName])

    if (!data || data.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                calculating districts
            </div>
        )
    }

    return (
        <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
    )

}