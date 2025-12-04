import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, Sector, ComposedChart, Line,
    AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis, Treemap
} from "recharts";
import doctorApi from "../../services/api/doctorApi";

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0"];
const RADIAL_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
const MAIN_BG = "#f8f9fa";
const CARD_BG = "#ffffff";
const RADIAN = Math.PI / 180;

// --- CUSTOM CONTENT CHO TREEMAP ---
const CustomizedTreemapContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, name, value } = props;

    return (
        <g>
            <rect
                x={x} y={y} width={width} height={height}
                style={{
                    fill: COLORS[index % COLORS.length],
                    stroke: "#fff",
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                    opacity: 0.9
                }}
            />
            {width > 50 && height > 30 ? (
                <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={11} fontWeight="bold">
                    {name.length > 15 ? name.substring(0, 15) + '...' : name}
                </text>
            ) : null}
            {width > 50 && height > 50 ? (
                <text x={x + width / 2} y={y + height / 2 + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={10}>
                    {value} citations
                </text>
            ) : null}
        </g>
    );
};

// --- COMPONENT: ACTIVE SHAPE (PIE CHART) ---
const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#1e293b" style={{fontSize: '22px', fontWeight: '800'}}>
                {(percent * 100).toFixed(0)}%
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
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

    if (loading) return <div style={loadingStyle}><h3>LOADING DASHBOARD...</h3></div>;
    if (!data) return <div style={containerStyle}>No data available</div>;

    // --- XỬ LÝ DỮ LIỆU ---
    const genderData = data.genderStats ? Object.keys(data.genderStats).map(key => ({ name: key === 'M' ? 'Male' : 'Female', value: data.genderStats[key] })) : [];

    const ageOrder = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '80+'];
    const ageData = ageOrder.map(key => ({
        name: key,
        count: data.ageStats[key] || 0,
        trend: data.ageStats[key] || 0,
        male: Math.round((data.ageStats[key] || 0) * 0.55),
        female: Math.round((data.ageStats[key] || 0) * 0.45),
    }));

    const diseaseData = data.diseaseStats ? Object.keys(data.diseaseStats).map((key, index) => ({
        name: key, count: data.diseaseStats[key], fill: RADIAL_COLORS[index % RADIAL_COLORS.length]
    })).sort((a, b) => b.count - a.count) : [];
    const top5Disease = diseaseData.slice(0, 5);

    const scatterData = data.scatterStats || [];
    const topArticles = data.topArticleStats || [];

    // Treemap data
    const treemapData = topArticles.map(item => ({
        name: item.title,
        size: item.refs
    }));

    const sparkData = [{uv: 4000}, {uv: 3000}, {uv: 2000}, {uv: 2780}, {uv: 1890}, {uv: 2390}, {uv: 3490}];

    return (
        <div style={containerStyle}>
            {/* CSS CHO RESPONSIVE */}
            <style>{`
                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                }
                @media (max-width: 1000px) {
                    .analytics-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .full-width-card {
                        grid-column: span 1 !important; 
                    }
                }
            `}</style>

            {/* HEADER */}
            <div style={headerStyle}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        <i className="fa-solid fa-chart-line" style={{marginRight: '12px', color: '#4361ee'}}></i>
                        Medical Insights Hub
                    </h2>
                    <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '15px' }}>
                        Advanced analytics on <strong>{data.totalCases.toLocaleString()}</strong> patient records
                    </p>
                </div>
                <div style={{textAlign: 'right'}}><span style={tagStyle}>● Live Data</span></div>
            </div>

            {/* SUMMARY CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "30px" }}>
                <StatCard title="PATIENTS" value={data.totalCases} color1="#4361ee" color2="#3a0ca3" icon="fa-users" sparkData={sparkData} />
                <StatCard title="KNOWLEDGE BASE" value={data.totalArticles?.toLocaleString() || "11.7M"} color1="#f72585" color2="#7209b7" icon="fa-book-medical" sparkData={sparkData} />
                <StatCard title="DISEASES" value={diseaseData.length} color1="#4cc9f0" color2="#4895ef" icon="fa-dna" sparkData={sparkData} />
            </div>

            {/* CHARTS GRID */}
            <div className="analytics-grid">

                {/* 1. HÀNG 1: TUỔI (Full Width) */}
                <div style={{ ...cardStyle, gridColumn: "1 / -1" }} className="full-width-card">
                    <ChartHeader title="Patient Age Distribution & Trend" subtitle="Comprehensive age group analysis" icon="fa-chart-area" />
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={ageData}>
                            <defs>
                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4cc9f0" stopOpacity={0.3}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" fill="url(#colorBar)" radius={[6, 6, 0, 0]} barSize={45} animationDuration={1500} />
                            <Line type="monotone" dataKey="trend" stroke="#f72585" strokeWidth={3} dot={{r: 4}} animationDuration={2000} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. HÀNG 2: TOP ARTICLES (Full Width) */}
                <div style={{ ...cardStyle, gridColumn: "1 / -1" }} className="full-width-card">
                    <ChartHeader title="Top Referenced Articles" subtitle="Most cited knowledge sources in database" icon="fa-star" />
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart layout="vertical" data={topArticles} margin={{ left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                            <XAxis type="number" hide />
                            <YAxis dataKey="title" type="category" width={220} stroke="#334155" style={{fontSize: '11px', fontWeight: 600}} tickFormatter={(val)=>val.length>40?val.substring(0,40)+'...':val}/>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="refs" fill="#10b981" radius={[0, 10, 10, 0]} barSize={18} animationDuration={1500} name="Citations">
                                {topArticles.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. HÀNG 3: RADAR & RADIAL */}
                <div style={cardStyle}>
                    <ChartHeader title="Demographics Balance" subtitle="Male vs Female" icon="fa-venus-mars" />
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ageData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} stroke="none" />
                            <Radar name="Male" dataKey="male" stroke="#4361ee" fill="#4361ee" fillOpacity={0.3} />
                            <Radar name="Female" dataKey="female" stroke="#f72585" fill="#f72585" fillOpacity={0.3} />
                            <Legend />
                            <Tooltip contentStyle={tooltipStyle} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div style={cardStyle}>
                    <ChartHeader title="Disease Burden" subtitle="Top conditions prevalence" icon="fa-biohazard" />
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={15} data={top5Disease}>
                            <RadialBar minAngle={15} background clockWise dataKey="count" cornerRadius={10} />
                            <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={legendStyle} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={tooltipStyle} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>


                {/* 5. HÀNG CUỐI (Đẩy xuống cuối): SCATTER CHART */}
                <div style={{ ...cardStyle, gridColumn: "1 / -1" }} className="full-width-card">
                    <ChartHeader title="Clinical Complexity Analysis" subtitle="Correlation: Patient Age vs Number of Relevant Medical Articles" icon="fa-project-diagram" />
                    <ResponsiveContainer width="100%" height={350}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" dataKey="age" name="Age" unit=" yrs" stroke="#94a3b8" />

                            {/* --- CẬP NHẬT TRỤC Y: CHIA VẠCH 0, 1, 2, 3 --- */}
                            <YAxis
                                type="number"
                                dataKey="citations"
                                name="Citations"
                                unit=" refs"
                                stroke="#94a3b8"
                                allowDecimals={false} // Không hiện số lẻ
                                ticks={[0, 1, 2, 3]}  // Ép buộc hiển thị các mốc này (nếu data > 3 nó sẽ tự thêm)
                            />

                            <ZAxis type="number" dataKey="z" range={[60, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
                            <Legend />
                            <Scatter name="Medical Cases" data={scatterData} fill="#8884d8" shape="circle">
                                {scatterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

// --- SUB COMPONENTS & STYLES ---
const ChartHeader = ({title, subtitle, icon}) => (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
        <div>
            <h3 style={{margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '700'}}>{title}</h3>
            <p style={{margin: '2px 0 0', color: '#94a3b8', fontSize: '12px'}}>{subtitle}</p>
        </div>
        <div style={{width: 32, height: 32, borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', border: '1px solid #e2e8f0'}}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
    </div>
);

const StatCard = ({ title, value, color1, color2, icon, sparkData }) => (
    <div style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`, padding: "24px", borderRadius: "20px",
        boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.15)", color: 'white', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '150px'
    }}>
        <div style={{position: 'relative', zIndex: 2}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p style={{ opacity: 0.9, fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '5px' }}>{title}</p>
                <i className={`fa-solid ${icon}`} style={{opacity: 0.5}}></i>
            </div>
            <h3 style={{ fontSize: '32px', margin: '5px 0', fontWeight: '800' }}>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        </div>
        <div style={{height: '40px', width: '100%', opacity: 0.4, marginTop: 'auto'}}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                    <Area type="monotone" dataKey="uv" stroke="#fff" fill="#fff" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// --- STYLES ---
const containerStyle = { padding: "30px 5%", backgroundColor: MAIN_BG, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const tagStyle = { backgroundColor: '#d1fae5', color: '#059669', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 0 0 4px #ecfdf5' };
const gridSummaryStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" };
const cardStyle = { backgroundColor: CARD_BG, padding: "20px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #fff" };
const tooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.98)', padding: '10px 15px', fontSize: '13px' };
const loadingStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#4361ee', fontWeight: 'bold' };
const legendStyle = { lineHeight: '24px', right: 0, top: '50%', transform: 'translate(0, -50%)' };

export default Analytics;