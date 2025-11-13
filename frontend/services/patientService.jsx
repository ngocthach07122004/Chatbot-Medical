import patientApi from "./api/patientApi";

const PatientService = {
  async getPatientById(id) {
    const res = await patientApi.get(`/patient/${id}`);
    return res;
  },
  async getPatientsByDoctor(doctorId) {
    const res = await patientApi.get(`/patient/doctor/${doctorId}`);
    return res.data;
  },
  async createPatient(doctorId, data) {
    const res = await patientApi.post(`/patient/create/${doctorId}`, data);
    return res;
  },
  async updatePatient(patientId, data) {
    const res = await patientApi.post(`/patient/update/${patientId}`, data);
    return res;
  },
  async createPathology(patientId, data) {
    const res = await patientApi.post(`/pathology/create/${patientId}`, data);
    return res;
  },
  async getPatientsByDoctorLightWeight(doctorId) {
    const res = await patientApi.get(`/patient/doctor/lightweight/${doctorId}`);
    return res.data;
  },
};
export default PatientService;
