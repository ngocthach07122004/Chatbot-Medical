import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import doctorApi from "../../services/api/doctorApi"; // Import api instance của bạn

// Màu sắc cho biểu đồ
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API Java bạn vừa viết
        const fetchData = async () => {
            try {
                const res = await doctorApi.get("/analytics/dashboard");
                if (res.data && res.data.entity) {
                    setData(res.data.entity);
                }
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h2>Loading Medical Data...</h2>
            </div>
        );
    }

    if (!data) return <div>No data available</div>;

    // --- CHUYỂN ĐỔI DỮ LIỆU CHO RECHARTS ---

    // Dữ liệu Giới tính (Pie Chart)
    const genderData = Object.keys(data.genderStats).map((key) => ({
        name: key === 'M' ? 'Male' : (key === 'F' ? 'Female' : key),
        value: data.genderStats[key],
    }));

    // Dữ liệu Độ tuổi (Bar Chart)
    // Sắp xếp thứ tự độ tuổi cho hợp lý
    const ageOrder = ['0-18', '18-40', '41-60', '60+'];
    const ageData = ageOrder.map((key) => ({
        name: key,
        count: data.ageStats[key] || 0,
    }));

    // Convert data bệnh lý
    const diseaseData = data.diseaseStats ? Object.keys(data.diseaseStats).map(key => ({
        name: key,
        count: data.diseaseStats[key]
    })) : [];

    return (
        <div style={{ padding: "40px", background: "#f5f7fa", minHeight: "calc(100vh - 72px)" }}>
            <h1 style={{ marginBottom: "30px", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "10px", display: "inline-block" }}>
                <i className="fa-solid fa-chart-pie" style={{marginRight: '10px'}}></i>
                Medical Knowledge & Statistics
            </h1>

            {/* --- PHẦN 1: THẺ TỔNG QUAN (SUMMARY CARDS) --- */}
            <div style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
                <div style={cardStyle}>
                    <div style={{fontSize: '40px', color: '#0088FE'}}><i className="fa-solid fa-file-medical"></i></div>
                    <div style={{textAlign: 'center'}}>
                        <h3 style={{ color: "#7f8c8d", margin: "10px 0 5px" }}>Total Research Cases</h3>
                        <p style={{ fontSize: "36px", fontWeight: "bold", color: "#2c3e50", margin: 0 }}>
                            {data.totalCases.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{fontSize: '40px', color: '#00C49F'}}><i className="fa-solid fa-book-medical"></i></div>
                    <div style={{textAlign: 'center'}}>
                        <h3 style={{ color: "#7f8c8d", margin: "10px 0 5px" }}>Medical Articles (Corpus)</h3>
                        <p style={{ fontSize: "36px", fontWeight: "bold", color: "#2c3e50", margin: 0 }}>
                            {/* Nếu bạn chưa làm API count bài báo thì hardcode hoặc ẩn đi */}
                            {data.totalArticles ? data.totalArticles.toLocaleString() : "11,700,000+"}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- PHẦN 2: BIỂU ĐỒ (CHARTS) --- */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "30px" }}>

                {/* Biểu đồ Tuổi */}
                <div style={chartCardStyle}>
                    <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#444" }}>Age Group Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Number of Patients" barSize={60}>
                                {ageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ Giới tính */}
                <div style={chartCardStyle}>
                    <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#444" }}>Gender Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%" cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#0088FE" : "#FF8042"} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ marginTop: "30px", ...cardStyle, flexDirection: 'column', alignItems: 'stretch' }}>
                    <h3 style={{ textAlign: "center", color: "#444" }}>Common Disease Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart layout="vertical" data={diseaseData} margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" name="Cases Count" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// CSS Inline Styles
const cardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    transition: 'transform 0.2s',
    cursor: 'default'
};

const chartCardStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

export default Analytics;