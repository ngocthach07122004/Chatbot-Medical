package com.vn.Medical.service;

import com.vn.Medical.dto.request.PatientSearchRequest;
import com.vn.Medical.dto.response.PatientSearchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.NClob;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PatientSearchService {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private static final String PATIENT_FUNCTION_SQL = """
            SELECT *
            FROM TABLE(
                get_patient_information(
                    :p_patient_id,
                    :p_patient_sex,
                    :p_patient_size_m,
                    :p_patient_age,
                    :p_patient_weight,
                    :p_file_id,
                    :p_preview_png,
                    :p_image_position_x_min,
                    :p_image_position_y_min,
                    :p_image_position_z_min,
                    :p_image_position_x_max,
                    :p_image_position_y_max,
                    :p_image_position_z_max,
                    :p_series_description,
                    :p_note_text,
                    :p_file_name,
                    :p_file_path
                )
            )
            """;

    public List<PatientSearchResult> searchPatients(PatientSearchRequest request) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        add(params, "p_patient_id", request.getPatientId());
        add(params, "p_patient_sex", request.getPatientSex());
        add(params, "p_patient_size_m", request.getPatientSizeM());
        add(params, "p_patient_age", request.getPatientAge());
        add(params, "p_patient_weight", request.getPatientWeight());
        add(params, "p_file_id", request.getFileId());
        addBlobBase64(params, "p_preview_png", request.getPreviewPngBase64());
        add(params, "p_image_position_x_min", request.getImagePositionXMin());
        add(params, "p_image_position_y_min", request.getImagePositionYMin());
        add(params, "p_image_position_z_min", request.getImagePositionZMin());
        add(params, "p_image_position_x_max", request.getImagePositionXMax());
        add(params, "p_image_position_y_max", request.getImagePositionYMax());
        add(params, "p_image_position_z_max", request.getImagePositionZMax());
        add(params, "p_series_description", request.getSeriesDescription());
        addClob(params, "p_note_text", request.getNoteText());
        add(params, "p_file_name", request.getFileName());
        add(params, "p_file_path", request.getFilePath());

        return namedParameterJdbcTemplate.query(PATIENT_FUNCTION_SQL, params, this::mapRow);
    }

    private void add(MapSqlParameterSource params, String name, String value) {
        params.addValue(name, isBlank(value) ? null : value, Types.VARCHAR);
    }

    private void add(MapSqlParameterSource params, String name, BigDecimal value) {
        params.addValue(name, value, Types.NUMERIC);
    }

    private void add(MapSqlParameterSource params, String name, String value, int sqlType) {
        params.addValue(name, isBlank(value) ? null : value, sqlType);
    }

    private void addBlobBase64(MapSqlParameterSource params, String name, String base64) {
        if (isBlank(base64)) {
            params.addValue(name, null, Types.BLOB);
            return;
        }
        byte[] data = Base64.getDecoder().decode(base64);
        params.addValue(name, data, Types.BLOB);
    }

    private void addClob(MapSqlParameterSource params, String name, String value) {
        params.addValue(name, isBlank(value) ? null : value, Types.CLOB);
    }

    private PatientSearchResult mapRow(ResultSet rs, int rowNum) throws SQLException {
        Map<String, Object> row = toRow(rs);

        return PatientSearchResult.builder()
                .raw(row)
                .patientId(asString(row, "PATIENT_ID", "PATIENTID", "PATIENT_IDENTIFIER"))
                .patientSex(asString(row, "PATIENT_SEX", "SEX"))
                .patientAge(asString(row, "PATIENT_AGE", "AGE"))
                .patientWeight(asBigDecimal(row, "PATIENT_WEIGHT", "WEIGHT"))
                .patientSizeM(asBigDecimal(row, "PATIENT_SIZE_M", "PATIENT_HEIGHT", "HEIGHT_M"))
                .fileName(asString(row, "FILE_NAME", "FILENAME"))
                .filePath(asString(row, "FILE_PATH", "PATH"))
                .seriesDescription(asString(row, "SERIES_DESCRIPTION", "DESCRIPTION"))
                .noteText(asString(row, "NOTE_TEXT", "CLINICIAN_NOTE", "NOTE"))
                .imagePositionX(asDouble(row, "IMAGE_POSITION_X", "IMAGE_POSITION_X_MIN"))
                .imagePositionY(asDouble(row, "IMAGE_POSITION_Y", "IMAGE_POSITION_Y_MIN"))
                .imagePositionZ(asDouble(row, "IMAGE_POSITION_Z", "IMAGE_POSITION_Z_MIN"))
                .previewPngBase64(resolvePreviewBase64(row))
                .build();
    }

    private Map<String, Object> toRow(ResultSet rs) throws SQLException {
        ResultSetMetaData metaData = rs.getMetaData();
        Map<String, Object> row = new LinkedHashMap<>();

        for (int i = 1; i <= metaData.getColumnCount(); i++) {
            String columnLabel = metaData.getColumnLabel(i);
            String columnName = isBlank(columnLabel) ? metaData.getColumnName(i) : columnLabel;
            int columnType = metaData.getColumnType(i);

            Object value;
            if (columnType == Types.BLOB || columnType == Types.BINARY || columnType == Types.VARBINARY || columnType == Types.LONGVARBINARY) {
                Blob blob = rs.getBlob(i);
                value = blob != null ? blobToBase64(blob) : null;
            } else if (columnType == Types.CLOB || columnType == Types.NCLOB) {
                value = clobToString(rs.getClob(i));
            } else {
                value = rs.getObject(i);
            }
            row.put(columnName, value);
        }
        return row;
    }

    private String clobToString(Clob clob) throws SQLException {
        if (clob == null) {
            return null;
        }
        try (InputStream is = clob.getAsciiStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            is.transferTo(buffer);
            return buffer.toString();
        } catch (IOException e) {
            throw new SQLException("Failed to read CLOB content", e);
        }
    }

    private String resolvePreviewBase64(Map<String, Object> row) {
        String fromRow = asString(row, "PREVIEW_PNG", "P_PREVIEW_PNG", "PREVIEW_IMAGE", "PNG_PREVIEW", "PREVIEWPNG");
        return fromRow;
    }

    private String blobToBase64(Blob blob) throws SQLException {
        try (InputStream is = blob.getBinaryStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            if (is == null) {
                return null;
            }
            is.transferTo(buffer);
            return Base64.getEncoder().encodeToString(buffer.toByteArray());
        } catch (IOException e) {
            throw new SQLException("Failed to read binary preview image", e);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String asString(Map<String, Object> row, String... candidates) {
        Object value = first(row, candidates);
        return value != null ? Objects.toString(value).trim() : null;
    }

    private Double asDouble(Map<String, Object> row, String... candidates) {
        Object value = first(row, candidates);
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        try {
            return value != null ? Double.parseDouble(value.toString()) : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private BigDecimal asBigDecimal(Map<String, Object> row, String... candidates) {
        Object value = first(row, candidates);
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        try {
            return value != null ? new BigDecimal(value.toString()) : null;
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Object first(Map<String, Object> row, String... candidates) {
        for (String candidate : candidates) {
            for (Map.Entry<String, Object> entry : row.entrySet()) {
                if (entry.getKey() != null && entry.getKey().equalsIgnoreCase(candidate)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }
}
