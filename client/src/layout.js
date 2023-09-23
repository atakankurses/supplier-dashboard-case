import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

const BACKEND_URL = "http://localhost:3001";

function Layout() {
    const chartRef = useRef(null);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [chartData, setChartData] = useState({});
    const yearOptions = [{ label:"2021", value:"2021" }, { label:"2022", value:"2022" }, { label:"2023", value:"2023" }];
    const [selectedYear, setSelectedYear] = useState("2023");
    const [allTimeProductData, setAllTimeProductData] = useState([]);
    const [monthlyDataLoading, setMonthlyDataLoading] = useState(false);
    const [allTimeDataLoading, setAllTimeDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const getVendors = async () => {
        setLoading(true);
        const result = await axios({
            method: "GET",
            url: `${BACKEND_URL}/vendors`,
        })

        const _vendors = result?.data;

        const vendorOptions = _vendors?.map((vendor) => {
            return {label: vendor?.name, value: vendor?._id};
        }) 

        setVendors(vendorOptions);
        setLoading(false);
    }

    useEffect(() => {
        getVendors();
    }, []);

    const getMonthlyData = async () => {
        setMonthlyDataLoading(true);
        const result = await axios({
            method: "POST",
            url: `${BACKEND_URL}/orders/getMonthlyData`,
            data: {
                vendor: selectedVendor,
                year: selectedYear
            }
        })

        let _data = [0,0,0,0,0,0,0,0,0,0,0,0];

        result?.data?.map((monthlyData) => {
            _data[monthlyData?._id - 1] = monthlyData?.count; 
        });

        const _chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: "item_count x quantity",
                    data: _data,
                }
            ]
        }

        setChartData(_chartData)
        setMonthlyDataLoading(false);
    }

    const getAllTime = async () => {
        setAllTimeDataLoading(true);
        const result = await axios({
            method: "POST",
            url: `${BACKEND_URL}/orders/getAllTimeData`,
            data: {
                vendor: selectedVendor,
            }
        })

        const _data = result?.data?.map((item) => {
            return {name: item?.product?.name, count: item?.count};
        })

        setAllTimeProductData(_data);

        setAllTimeDataLoading(false)
    }


    useEffect(() => {
        if(selectedVendor && selectedYear) getMonthlyData();
    }, [selectedYear]);

    useEffect(() => {
        if(selectedVendor){
            getMonthlyData();
            getAllTime();
        }
    }, [selectedVendor]);

    const bodyTemplate = (product) => {
        return <span>{product.name}</span>
    }

    return (
    <div className="layout">
        <div style={{marginBottom: "1rem", fontSize: "larger"}}>Supplier Dashboard</div>
        <span className='selectVendor'>Select Vendor:</span>
        <Dropdown 
            style={{
                width: "15rem",
                marginBottom: "0.7rem"
            }}
            value={selectedVendor} 
            options={vendors} 
            filter 
            onChange={(e) => {setSelectedVendor(e.value)}}
        />

        <span className='selectVendor'>Select Year for Monthly Data:</span>
        <Dropdown 
            style={{
                width: "10rem",
                marginBottom: "0.7rem"
            }}
            disabled={loading || !selectedVendor || monthlyDataLoading}
            value={selectedYear}
            options={yearOptions}
            onChange={(e) => {setSelectedYear(e.value)}}
        />
        <div style={{width: "100%", height: "60vh", display: "flex", gap: "3rem"}}>
            {monthlyDataLoading ? (
                <div className="progressSpinnerContainer" style={{height: "40%", width: "50%"}}>
                    <ProgressSpinner 
                        style={{width: "4rem"}}
                    />
                </div>

                ) : (
                    <Chart
                        ref={chartRef}
                        style={{width: "50%"}}
                        type='bar'
                        data={chartData}
                        options={
                            {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                            }
                        }
                    />
                )

            }
            {allTimeDataLoading ? (
                <div className="progressSpinnerContainer" style={{height: "40%", width: "50%"}}>
                    <ProgressSpinner 
                        style={{width: "4rem"}}
                    />
                </div>

                ) : (
                    <DataTable value={allTimeProductData} style={{ width: '40%'}}>
                        <Column field="name" header="Name" body={bodyTemplate}></Column>
                        <Column field="count" header="Count"></Column>
                    </DataTable>
                )
            }
        </div>
    </div>
    );
}

export default Layout;
