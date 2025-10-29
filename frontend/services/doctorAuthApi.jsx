import doctorApi from "./api/doctorApi";

const doctorAuthService = {
  async login(gmail, password) {
    const res = await doctorApi.post("/doctor/auth/login", { gmail, password });
    return res.data;
  },

  async register(data) {
    const res = await doctorApi.post("/doctor/auth/register", data);
    return res.data;
  },

  async getProfile(gmail) {
    const res = await doctorApi.get(`/doctor/get/${gmail}`);
    return res.data;
  },
  async updateProfile(gmail, data) {
    const res = await doctorApi.post(`/doctor/update/${gmail}`, data);
    return res.data;
  },
};

export default doctorAuthService;
