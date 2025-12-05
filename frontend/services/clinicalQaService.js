// services/clinicalQaService.js
import axios from "axios";

const QA_API = import.meta.env.VITE_QA_API_URL || "http://localhost:8001/chat";

/**
 * Send a clinical question to the Clinical QA API
 * @param {string} query - The medical question to ask
 * @returns {Promise<{answer: string, references: string[]}>} - The answer and list of PMIDs
 */
export async function askClinicalQuestion(query) {
    const response = await axios.post(
        QA_API,
        {
            query,
            top_k: 5,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        }
    );
    return response.data;
}

export default { askClinicalQuestion };
