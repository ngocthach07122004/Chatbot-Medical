import axios from "axios";
import doctorApi from "./api/doctorApi";

const aiBase =
  import.meta.env.VITE_AI_API_URL ||
  import.meta.env.VITE_AI_SERVICE_URL ||
  "http://localhost:8000";

const MedicalSearchService = {
  async structuredSearch(params) {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    );
    const res = await doctorApi.get("/api/patient/search", { params: cleaned });
    return res?.data?.entity ?? res?.data ?? [];
  },
  async conversationalSearch(payload) {
    const res = await axios.post(`${aiBase}/ai/search`, payload);
    return res?.data;
  },
};

export default MedicalSearchService;
