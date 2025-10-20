package model

type DocterPatientChat struct {
	ID          uint64 `gorm:"primaryKey" json:"id"`
	PatientId   uint64 `json:"patientId"`
	HistoryChat uint64 `json:"historyChat"`
	DocterId    uint64 `json:"docterId"`
}
