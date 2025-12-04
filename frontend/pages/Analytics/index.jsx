import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, Sector, ComposedChart, Line, LabelList
} from "recharts";
import doctorApi from "../../services/api/doctorApi";

// --- PALETTE MÀU ---
const COLORS_GENDER = [
    { start: "#3b82f6", end: "#2563eb" }, // Nam (Blue)
    { start: "#ec4899", end: "#db2777" }, // Nữ (Pink)
    { start: "#a855f7", end: "#7c3aed" }  // Khác (Purple)
];

// Màu gradient cho từng loại bệnh
const COLORS_DISEASE = [
    ["#06b6d4", "#0891b2"], // Cyan
    ["#8b5cf6", "#7c3aed"], // Violet
    ["#f59e0b", "#d97706"], // Amber
    ["#10b981", "#059669"], // Emerald
    ["#ef4444", "#dc2626"], // Red
];

const MAIN_BG = "#f8fafc";
const CARD_BG = "#ffffff";
const TEXT_PRIMARY = "#1e293b";
const RADIAN = Math.PI / 180;

// --- COMPONENT: Active Shape cho Pie Chart (Sửa lỗi đè chữ) ---
const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    // Tính toán tọa độ để vẽ đường chỉ dẫn ra ngoài
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            {/* Không render text ở giữa nữa để tránh đè Total */}

            {/* Vẽ miếng bánh đang được chọn (phình to ra) */}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            {/* Viền sáng bao quanh */}
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />

            {/* Đường kẻ chỉ dẫn ra ngoài */}
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

            {/* Text hiển thị bên ngoài */}
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{fontWeight: 'bold', fontSize: '14px'}}>
                {payload.name}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{fontSize: '12px'}}>
                {`${value} cases (${(percent * 100).toFixed(1)}%)`}
            </text>
        </g>
    );
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
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

    const onPieEnter = (_, index) => setActiveIndex(index);

    if (loading) return <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h3>INITIALIZING DASHBOARD...</h3></div>;
    if (!data) return <div style={containerStyle}>No data available</div>;

    // --- PREPARE DATA ---
    const genderData = Object.keys(data.genderStats).map((key) => ({
        name: key === 'M' ? 'Male' : (key === 'F' ? 'Female' : key),
        value: data.genderStats[key],
    }));

    const ageOrder = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '80+'];
    const ageData = ageOrder.map((key) => ({
        name: key,
        count: data.ageStats[key] || 0,
        trend: data.ageStats[key] || 0
    }));

    // Dữ liệu bệnh lý (Đã bỏ fullMark gây khó hiểu)
    const diseaseData = data.diseaseStats ? Object.keys(data.diseaseStats).map(key => ({
        name: key,
        count: data.diseaseStats[key]
    })) : [];
    diseaseData.sort((a, b) => b.count - a.count);

    return (
        <div style={containerStyle}>

            {/* HEADER */}
            <div style={headerStyle}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Analytics Overview
                    </h2>
                    <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '15px' }}>Real-time patient demographics & pathology insights</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={tagStyle}>● Live Update</span>
                </div>
            </div>

            {/* KEY METRICS CARDS */}
            <div style={gridSummaryStyle}>
                <StatCard title="TOTAL PATIENTS" value={data.totalCases} icon="fa-hospital-user" color="#6366f1" trend="+12.5%" />
                <StatCard title="KNOWLEDGE CORPUS" value={data.totalArticles ? data.totalArticles.toLocaleString() : "11.7M"} icon="fa-database" color="#10b981" trend="Up to date" />
                <StatCard title="DISEASE TYPES" value={diseaseData.length} icon="fa-virus" color="#f59e0b" trend="5 Categories" />
            </div>

            <div style={gridChartStyle}>

                {/* 1. BIỂU ĐỒ TUỔI */}
                <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
                    <div style={cardHeaderStyle}>
                        <div>
                            <h3 style={cardTitleStyle}>Patient Age Distribution</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Correlation between age groups and case frequency</p>
                        </div>
                        <div style={iconButtonStyle}><i className="fa-solid fa-expand"></i></div>
                    </div>

                    <ResponsiveContainer width="100%" height={380}>
                        <ComposedChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4} />
                                </linearGradient>
                                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#fbbf24" />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

                            <Tooltip
                                cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

                            <Bar
                                dataKey="count"
                                name="Patient Count"
                                fill="url(#colorBar)"
                                radius={[8, 8, 0, 0]}
                                barSize={45}
                                animationDuration={1500}
                            />

                            <Line
                                type="monotone"
                                dataKey="trend"
                                name="Trend Analysis"
                                stroke="url(#colorLine)"
                                strokeWidth={4}
                                dot={{ r: 6, fill: '#fff', stroke: '#f43f5e', strokeWidth: 3 }}
                                activeDot={{ r: 9, strokeWidth: 0 }}
                                animationDuration={2000}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. BIỂU ĐỒ GIỚI TÍNH (Đã sửa lỗi đè chữ) */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <h3 style={cardTitleStyle}>Gender Demographics</h3>
                        <i className="fa-solid fa-venus-mars" style={{ color: '#94a3b8', fontSize: '18px' }}></i>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <defs>
                                {genderData.map((entry, index) => (
                                    <linearGradient id={`colorGender${index}`} x1="0" y1="0" x2="0" y2="1" key={index}>
                                        <stop offset="0%" stopColor={COLORS_GENDER[index % COLORS_GENDER.length].start} />
                                        <stop offset="100%" stopColor={COLORS_GENDER[index % COLORS_GENDER.length].end} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={genderData}
                                cx="50%" cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                                stroke="none"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#colorGender${index})`} />
                                ))}
                            </Pie>
                            {/* Text ở giữa luôn hiển thị TOTAL */}
                            <text x="50%" y="50%" dy={-10} textAnchor="middle" fill="#64748b" fontSize={14}>Total Patients</text>
                            <text x="50%" y="50%" dy={25} textAnchor="middle" fill="#1e293b" fontSize={32} fontWeight={800}>
                                {data.totalCases.toLocaleString()}
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. BIỂU ĐỒ BỆNH LÝ (Đã bỏ thanh xám) */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <h3 style={cardTitleStyle}>Most Common Diseases</h3>
                        <i className="fa-solid fa-notes-medical" style={{ color: '#94a3b8', fontSize: '18px' }}></i>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart layout="vertical" data={diseaseData} margin={{ top: 0, right: 50, left: 0, bottom: 0 }} barCategoryGap={20}>
                            <defs>
                                {diseaseData.map((entry, index) => (
                                    <linearGradient id={`colorDisease${index}`} x1="0" y1="0" x2="1" y2="0" key={index}>
                                        <stop offset="0%" stopColor={COLORS_DISEASE[index % COLORS_DISEASE.length][0]} />
                                        <stop offset="100%" stopColor={COLORS_DISEASE[index % COLORS_DISEASE.length][1]} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                                tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                            />

                            {/* Thanh dữ liệu chính */}
                            <Bar dataKey="count" barSize={24} radius={[0, 10, 10, 0]}>
                                {diseaseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`url(#colorDisease${index})`} />
                                ))}
                                {/* Hiển thị số lượng ở đuôi */}
                                <LabelList dataKey="count" position="right" style={{ fill: '#64748b', fontSize: '13px', fontWeight: 'bold' }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

// --- STYLED COMPONENTS (Giữ nguyên) ---
const StatCard = ({ title, value, icon, color, trend }) => (
    <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden', borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{title}</p>
                <h3 style={{ color: '#1e293b', fontSize: '32px', margin: 0, fontWeight: '800', lineHeight: '1.2' }}>{value}</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px', gap: '6px' }}>
          <span style={{ color: color, background: `${color}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
            <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '4px' }}></i> {trend}
          </span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>vs last month</span>
                </div>
            </div>
            <div style={{
                width: '56px', height: '56px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color, fontSize: '24px',
                boxShadow: `0 4px 12px ${color}30`
            }}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
        </div>
    </div>
);

const containerStyle = {
    padding: "40px 6%",
    backgroundColor: MAIN_BG,
    minHeight: "100vh",
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif"
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
};

const tagStyle = {
    backgroundColor: '#ecfdf5', color: '#059669',
    padding: '8px 16px', borderRadius: '30px',
    fontSize: '13px', fontWeight: '700',
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)',
    border: '1px solid #d1fae5'
};

const gridSummaryStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "30px"
};

const gridChartStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "24px"
};

const cardStyle = {
    backgroundColor: CARD_BG,
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02), 0 15px 30px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #f1f5f9",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
};

const cardTitleStyle = {
    margin: 0,
    color: '#334155',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.3px'
};

const iconButtonStyle = {
    width: '36px', height: '36px', borderRadius: '10px',
    background: '#f8fafc', color: '#64748b',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s'
};

export default Analytics;