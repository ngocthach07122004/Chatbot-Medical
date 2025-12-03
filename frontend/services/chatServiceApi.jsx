import chatApi from "./api/chatApi";

const chatServiceApi = {
  // send new message (Java: /historyChat/create)
  async saveChat(payload) {
    return await chatApi.post("/historyChat/create", payload);
  },

  // get chat history (Java: /historyChat/{doctorId}/{patientId})
  async getHistoryChatByPatient(doctorId, patientId) {
    const res = await chatApi.get(`/historyChat/${doctorId}/${patientId}`);
    return res.data; // return Map<Date, List>
  },
};

export default chatServiceApi;