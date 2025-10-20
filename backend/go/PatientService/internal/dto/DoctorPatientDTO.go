package dto

type DoctorPatientChatDTO struct {
	DoctorID      int64 `json:"doctorId"`
	HistoryChatID int64 `json:"historyChatId"`
	PatientID     int64 `json:"patientId"`
}
