// services/corpusService.js
import axios from "axios";

const CORPUS_API =
    import.meta.env.VITE_CORPUS_API_URL ||
    "https://eb5a0037e3da.ngrok-free.app/api/corpus";

/**
 * Fetch article documents from the Corpus Retrieval API
 * @param {string[]} pmids - Array of PubMed IDs to fetch
 * @returns {Promise<Array<{pmid: string, text: string, found: boolean}>>} - Array of document objects
 */
export async function fetchDocuments(pmids) {
    const response = await axios.post(
        CORPUS_API,
        {
            pmids,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        }
    );
    return response.data.documents;
}

export default { fetchDocuments };
