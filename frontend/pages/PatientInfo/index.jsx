import React, { useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./PatientInfo.module.scss";
import MedicalSearchService from "../../services/medicalSearchService";

const cx = classNames.bind(styles);

const emptyForm = {
  patient_id: "",
  patient_sex: "",
  patient_size_m: "",
  patient_age: "",
  patient_weight: "",
  file_name: "",
  file_path: "",
  series_description: "",
  note_text: "",
  image_position_x_min: "",
  image_position_x_max: "",
  image_position_y_min: "",
  image_position_y_max: "",
  image_position_z_min: "",
  image_position_z_max: "",
};

const ALLOWED_KEYS = [
  "patient_id",
  "patient_sex",
  "patient_size_m",
  "patient_age",
  "patient_weight",
  "file_name",
  "file_path",
  "series_description",
  "note_text",
  "image_position_x_min",
  "image_position_x_max",
  "image_position_y_min",
  "image_position_y_max",
  "image_position_z_min",
  "image_position_z_max",
];

const PAGE_SIZE = 4;

const PatientInfo = () => {
  const [form, setForm] = useState(emptyForm);
  const [structuredResults, setStructuredResults] = useState([]);
  const [aiResults, setAiResults] = useState([]);
  const [structuredPage, setStructuredPage] = useState(1);
  const [aiPage, setAiPage] = useState(1);
  const [aiStructuredQuery, setAiStructuredQuery] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loadingStructured, setLoadingStructured] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const structuredSearch = async (e) => {
    e.preventDefault();
    setLoadingStructured(true);
    setError("");
    try {
      const results = await MedicalSearchService.structuredSearch(form);
      setStructuredResults(Array.isArray(results) ? results : []);
      setStructuredPage(1);
    } catch (err) {
      setError("Unable to fetch patient information from the Java service.");
    } finally {
      setLoadingStructured(false);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const nextHistory = [
      ...chatHistory,
      { role: "user", content: prompt.trim() },
    ];
    setChatHistory(nextHistory);
    setLoadingAi(true);
    setError("");

    try {
      const aiResponse = await MedicalSearchService.conversationalSearch({
        prompt: prompt.trim(),
        conversation: nextHistory,
      });
      setAiStructuredQuery(aiResponse?.structured_query || {});
      setAiResults(
        Array.isArray(aiResponse?.results) ? aiResponse.results : []
      );
      setAiPage(1);

      const assistantMessage = `Search executed via ${
        aiResponse?.source || "AI"
      } with ${aiResponse?.results?.length || 0} matches.`;
      setChatHistory([
        ...nextHistory,
        { role: "assistant", content: assistantMessage },
      ]);
      setPrompt("");
    } catch (err) {
      setError("Unable to run conversational search through the AI service.");
    } finally {
      setLoadingAi(false);
    }
  };

  const toDisplayValue = (item, candidates, fallback = "") => {
    for (const key of candidates) {
      if (item && Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (value !== undefined && value !== null && value !== "") return value;
      }
      if (item?.raw) {
        const rawEntry = Object.entries(item.raw).find(
          ([rawKey]) => rawKey && rawKey.toLowerCase() === key.toLowerCase()
        );
        if (rawEntry) {
          const [, rawValue] = rawEntry;
          if (rawValue !== undefined && rawValue !== null && rawValue !== "")
            return rawValue;
        }
      }
    }
    return fallback;
  };

  const imageFromResult = (item) => {
    const base64 = toDisplayValue(item, [
      "previewPngBase64",
      "PREVIEW_PNG",
      "preview_png",
    ]);
    return base64 ? `data:image/png;base64,${base64}` : null;
  };

  const coordinateText = (item) => {
    const x = toDisplayValue(item, ["imagePositionX", "IMAGE_POSITION_X"]);
    const y = toDisplayValue(item, ["imagePositionY", "IMAGE_POSITION_Y"]);
    const z = toDisplayValue(item, ["imagePositionZ", "IMAGE_POSITION_Z"]);
    const hasCoordinate = (val) =>
      val !== undefined && val !== null && val !== "";
    if (hasCoordinate(x) || hasCoordinate(y) || hasCoordinate(z)) {
      return `(${hasCoordinate(x) ? x : "?"}, ${hasCoordinate(y) ? y : "?"}, ${
        hasCoordinate(z) ? z : "?"
      })`;
    }
    return "N/A";
  };

  const structuredResultCards = useMemo(
    () =>
      renderResultGrid(
        structuredResults,
        "Oracle function results",
        structuredPage,
        setStructuredPage
      ),
    [structuredResults, structuredPage]
  );

  const aiResultCards = useMemo(
    () => renderResultGrid(aiResults, "AI assisted results", aiPage, setAiPage),
    [aiResults, aiPage]
  );

  function renderResultGrid(results, title, page, setPage) {
    if (!results || results.length === 0) {
      return <div className={cx("empty")}>No results yet.</div>;
    }

    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    const visible = results.slice(start, start + PAGE_SIZE);

    const changePage = (next) => {
      const target = Math.min(Math.max(1, next), totalPages);
      setPage(target);
    };

    return (
      <div className={cx("resultsGrid")}>
        <div className={cx("resultsHeader")}>
          <p className={cx("resultTitle")}>{title}</p>
          <div className={cx("pagination")}>
            <button
              type="button"
              className={cx("pageBtn")}
              onClick={() => changePage(safePage - 1)}
              disabled={safePage === 1}
            >
              Prev
            </button>
            <span className={cx("pageInfo")}>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              className={cx("pageBtn")}
              onClick={() => changePage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {visible.map((item, idx) => (
          <div key={idx} className={cx("resultCard")}>
            <div className={cx("resultHeader")}>
              <div>
                <p className={cx("eyebrow")}>Patient</p>
                <h4>
                  {toDisplayValue(item, ["patientId", "PATIENT_ID"], "Unknown")}{" "}
                  &middot;{" "}
                  {toDisplayValue(item, ["patientSex", "PATIENT_SEX"], "?")}
                </h4>
              </div>
              <div className={cx("demographics")}>
                <span>
                  {toDisplayValue(
                    item,
                    ["patientAge", "PATIENT_AGE"],
                    "Age: N/A"
                  )}
                </span>
                <span>
                  {toDisplayValue(
                    item,
                    ["patientWeight", "PATIENT_WEIGHT"],
                    "Weight: N/A"
                  )}{" "}
                  /{" "}
                  {toDisplayValue(
                    item,
                    ["patientSizeM", "PATIENT_SIZE_M"],
                    "Height: N/A"
                  )}
                </span>
              </div>
            </div>

            <div className={cx("resultBody")}>
              <div className={cx("resultMeta")}>
                <div>
                  <p className={cx("label")}>Series</p>
                  <p className={cx("value")}>
                    {toDisplayValue(
                      item,
                      ["seriesDescription", "SERIES_DESCRIPTION"],
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <p className={cx("label")}>File</p>
                  <p className={cx("value")}>
                    {toDisplayValue(item, ["fileName", "FILE_NAME"], "N/A")}
                  </p>
                  <p className={cx("path")}>
                    {toDisplayValue(item, ["filePath", "FILE_PATH"], "")}
                  </p>
                </div>
                <div>
                  <p className={cx("label")}>Coordinates</p>
                  <p className={cx("value")}>{coordinateText(item)}</p>
                </div>
                <div>
                  <p className={cx("label")}>Clinician note</p>
                  <p className={cx("note")}>
                    {toDisplayValue(
                      item,
                      ["noteText", "NOTE_TEXT", "CLINICIAN_NOTE"],
                      "No notes"
                    )}
                  </p>
                </div>
              </div>

              <div className={cx("preview")}>
                {imageFromResult(item) ? (
                  <img src={imageFromResult(item)} alt="MRI preview" />
                ) : (
                  <div className={cx("previewEmpty")}>
                    <i className="fa-regular fa-image" />
                    <span>Preview unavailable</span>
                  </div>
                )}
              </div>
            </div>

            {item.raw && (
              <div className={cx("raw")}>
                {Object.entries(item.raw)
                  .filter(
                    ([key]) =>
                      key &&
                      !["preview_png", "p_preview_png", "previewpng"].includes(
                        key.toLowerCase()
                      )
                  )
                  .map(([key, value]) => (
                    <div key={key} className={cx("rawItem")}>
                      <span>{key}</span>
                      <strong>{String(value ?? "")}</strong>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("hero")}>
        <div>
          <p className={cx("eyebrow")}>Patient Information</p>
          <h1 className={cx("title")}>Truy vấn thông tin của từng bệnh nhân</h1>
          <p className={cx("subtitle")}>
            Cung cấp bởi Oracle function get_patient_information và Model AI
          </p>
        </div>
        <div className={cx("heroBadges")}>
          <div className={cx("badge")}>
            <i className="fa-solid fa-database" />
            <div>
              <p>PDB_MRI</p>
              <span>Oracle &middot; localhost:1521</span>
            </div>
          </div>
          <div className={cx("badge")}>
            <i className="fa-solid fa-robot" />
            <div>
              <p>Conversational search</p>
              <span>AI routes to Java or Oracle</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className={cx("error")}>{error}</div>}

      <div className={cx("panels")}>
        <section className={cx("card")}>
          <div className={cx("cardHeader")}>
            <div>
              <p className={cx("eyebrow")}>Panel A</p>
              <h3>Java Structured Search</h3>
              <p className={cx("muted")}>
                Calls /api/patient/search and maps the Oracle pipelined
                function.
              </p>
            </div>
            <button
              className={cx("ghostBtn")}
              type="button"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>

          <form className={cx("formGrid")} onSubmit={structuredSearch}>
            <div className={cx("inputGroup")}>
              <label>Patient ID</label>
              <input
                value={form.patient_id}
                onChange={(e) => handleChange("patient_id", e.target.value)}
                placeholder="e.g. 0001"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Sex</label>
              <input
                value={form.patient_sex}
                onChange={(e) => handleChange("patient_sex", e.target.value)}
                placeholder="M / F"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Age</label>
              <input
                value={form.patient_age}
                onChange={(e) => handleChange("patient_age", e.target.value)}
                placeholder="e.g. 42"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Height (m)</label>
              <input
                value={form.patient_size_m}
                onChange={(e) => handleChange("patient_size_m", e.target.value)}
                placeholder="e.g. 1.72"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Weight (kg)</label>
              <input
                value={form.patient_weight}
                onChange={(e) => handleChange("patient_weight", e.target.value)}
                placeholder="e.g. 68"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>File name</label>
              <input
                value={form.file_name}
                onChange={(e) => handleChange("file_name", e.target.value)}
                placeholder="Contains..."
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>File path</label>
              <input
                value={form.file_path}
                onChange={(e) => handleChange("file_path", e.target.value)}
                placeholder="/mnt/dicom/..."
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Series description</label>
              <input
                value={form.series_description}
                onChange={(e) =>
                  handleChange("series_description", e.target.value)
                }
                placeholder="MRI brain..."
              />
            </div>
            <div className={cx("inputGroup", "fullWidth")}>
              <label>Clinician note</label>
              <textarea
                rows={3}
                value={form.note_text}
                onChange={(e) => handleChange("note_text", e.target.value)}
                placeholder="Search inside notes"
              />
            </div>

            <div className={cx("inputGroup")}>
              <label>X min</label>
              <input
                value={form.image_position_x_min}
                onChange={(e) =>
                  handleChange("image_position_x_min", e.target.value)
                }
                placeholder="0"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>X max</label>
              <input
                value={form.image_position_x_max}
                onChange={(e) =>
                  handleChange("image_position_x_max", e.target.value)
                }
                placeholder="1000"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Y min</label>
              <input
                value={form.image_position_y_min}
                onChange={(e) =>
                  handleChange("image_position_y_min", e.target.value)
                }
                placeholder="0"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Y max</label>
              <input
                value={form.image_position_y_max}
                onChange={(e) =>
                  handleChange("image_position_y_max", e.target.value)
                }
                placeholder="1000"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Z min</label>
              <input
                value={form.image_position_z_min}
                onChange={(e) =>
                  handleChange("image_position_z_min", e.target.value)
                }
                placeholder="0"
              />
            </div>
            <div className={cx("inputGroup")}>
              <label>Z max</label>
              <input
                value={form.image_position_z_max}
                onChange={(e) =>
                  handleChange("image_position_z_max", e.target.value)
                }
                placeholder="1000"
              />
            </div>

            <div className={cx("actions")}>
              <button
                className={cx("primaryBtn")}
                type="submit"
                disabled={loadingStructured}
              >
                {loadingStructured ? "Searching..." : "Run Oracle Search"}
              </button>
            </div>
          </form>

          {structuredResultCards}
        </section>

        <section className={cx("card")}>
          <div className={cx("cardHeader")}>
            <div>
              <p className={cx("eyebrow")}>Panel B</p>
              <h3>AI Conversational Search</h3>
              <p className={cx("muted")}>
                Natural language intent is mapped to structured parameters then
                routed to Java or Oracle directly.
              </p>
            </div>
          </div>

          <form className={cx("chatInput")} onSubmit={sendPrompt}>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ask anything - e.g. "Show female patients with frontal lobe MRI around 1.6m tall"'
            />
            <button
              className={cx("primaryBtn")}
              type="submit"
              disabled={loadingAi}
            >
              {loadingAi ? "Sending..." : "Send to AI"}
            </button>
          </form>

          {aiStructuredQuery && Object.keys(aiStructuredQuery).length > 0 && (
            <div className={cx("structuredPreview")}>
              <p className={cx("label")}>Structured parameters</p>
              <div className={cx("structuredGrid")}>
                {ALLOWED_KEYS.map((key) => (
                  <div key={key} className={cx("pill")}>
                    <span>{key}</span>
                    <strong>{aiStructuredQuery[key] ?? "null"}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cx("chatHistory")}>
            <div className={cx("chatHeaderRow")}>
              <p className={cx("label")}>Conversation</p>
              <span className={cx("muted")}>
                {chatHistory.length
                  ? `${chatHistory.length} turns`
                  : "No conversation yet"}
              </span>
            </div>
            <div className={cx("chatStream")}>
              {chatHistory.length === 0 && (
                <div className={cx("empty")}>
                  Start chatting to see a trail.
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={cx(
                    "chatBubble",
                    msg.role === "user" ? "user" : "assistant"
                  )}
                >
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>
          </div>

          {aiResultCards}
        </section>
      </div>
    </div>
  );
};

export default PatientInfo;
