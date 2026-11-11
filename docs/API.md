# AgriSense AI – Backend API Documentation

All API endpoints are mounted under `/api/v1` and use standard JSON request/response envelopes.

## Base URL
```text
http://localhost:5000/api/v1
```

## Standard Response Format
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "error": null
}
```

## Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_SERVER_ERROR",
    "details": [ ... ]
  }
}
```

---

## Endpoints

### 1. Health Check
- **`GET /health`**
  - **Auth Required:** No
  - **Response:** `200 OK`

### 2. Farmer Profile
- **`GET /profile`**
  - **Auth Required:** Yes (`Authorization: Bearer <token>`)
  - **Response:** `200 OK` with user profile object.
- **`PUT /profile`**
  - **Auth Required:** Yes
  - **Body:** `{ full_name, phone?, preferred_language, state, district, village?, farm_name?, land_area?, land_unit?, farming_type? }`
  - **Response:** `200 OK`

### 3. Farm Plots Management
- **`GET /farms`**
  - **Auth Required:** Yes
  - **Response:** `200 OK` array of farm plots owned by user.
- **`POST /farms`**
  - **Auth Required:** Yes
  - **Body:** `{ farm_name, state, district, village?, land_area, land_unit, soil_type, soil_ph?, nitrogen?, phosphorus?, potassium?, water_source, farming_method? }`
  - **Response:** `201 Created`
- **`GET /farms/:id`**
  - **Auth Required:** Yes
  - **Response:** `200 OK` or `404 Not Found`
- **`PUT /farms/:id`**
  - **Auth Required:** Yes
  - **Body:** Partial farm object
  - **Response:** `200 OK`
- **`DELETE /farms/:id`**
  - **Auth Required:** Yes
  - **Response:** `200 OK`

### 4. Smart Crop Recommendation
- **`POST /crops/recommend`**
  - **Auth Required:** Yes (Rate limited to 20 req / 5 min)
  - **Body:**
    ```json
    {
      "farm_id": "uuid-optional",
      "state": "Kerala",
      "district": "Palakkad",
      "village": "Chittur",
      "land_area": 2.5,
      "land_unit": "acre",
      "soil_type": "Laterite",
      "soil_ph": 6.5,
      "nitrogen": 240,
      "phosphorus": 35,
      "potassium": 190,
      "water_source": "Canal Basin & Well",
      "season": "Kharif/Monsoon",
      "crop_category": "Spices & Plantation",
      "farming_method": "Integrated Multi-Cropping",
      "language": "en"
    }
    ```
  - **Response:** `200 OK` containing ranked recommendations, suitability scores, soil evaluation, and audio script.

### 5. Multimodal Disease Detection
- **`POST /disease/analyze`**
  - **Auth Required:** Yes (Multipart/form-data, Rate limited)
  - **Headers:** `Content-Type: multipart/form-data`
  - **Form Fields:**
    - `image`: File (JPEG, PNG, WebP up to 5MB)
    - `crop_name`: string
    - `plant_part_affected`: string
    - `symptoms`: string (optional)
    - `language`: 'en' | 'ml'
  - **Response:** `200 OK` containing condition name, confidence %, visual symptoms, immediate IPM cultural/biological/chemical actions, and audio script.

### 6. Fertilizer Advisory
- **`POST /fertilizer/recommend`**
  - **Auth Required:** Yes
  - **Body:** `{ crop_name, growth_stage, land_area, land_unit, soil_type, soil_ph, nitrogen?, phosphorus?, potassium?, previous_application?, farming_method, language }`
  - **Response:** `200 OK` stage-specific nutrient dosage, application method, and organic alternatives.

### 7. Irrigation Advisory
- **`POST /irrigation/recommend`**
  - **Auth Required:** Yes
  - **Body:** `{ crop_name, growth_stage, soil_type, land_area, land_unit, water_source, irrigation_method, recent_rainfall?, weather_notes?, language }`
  - **Response:** `200 OK` optimal frequency, best time of day, water conservation tips, and stress warning signs.

### 8. Weather Intelligence & Alerts
- **`GET /weather/current?location=Palakkad,Kerala`**
  - **Auth Required:** No
  - **Response:** `200 OK`
- **`GET /weather/forecast?location=Palakkad,Kerala`**
  - **Auth Required:** No
  - **Response:** `200 OK` 5-day agro outlook
- **`POST /weather/advisory`**
  - **Auth Required:** Yes
  - **Body:** `{ location_name, temperature, humidity, rainfall, wind_speed, weather_description, language }`
  - **Response:** `200 OK` with agro risk evaluation and irrigation adjustments.

### 9. Cultivation Cost Estimator
- **`POST /cost-estimator/calculate`**
  - **Auth Required:** Yes
  - **Body:** `{ crop_name, land_area, land_unit, seeds_cost, labour_cost, fertilizer_cost, pesticide_cost, irrigation_cost, machinery_cost, transportation_cost, other_expenses, expected_yield?, expected_price_per_unit?, yield_unit, currency, language }`
  - **Response:** `200 OK` with deterministic cost, revenue, profit/loss, and AI economic optimization advice.

### 10. AI Assistant Chat
- **`POST /assistant/chat`**
  - **Auth Required:** Yes
  - **Body:** `{ conversation_id?, content, language, farm_context? }`
  - **Response:** `200 OK` assistant message with action points, warnings, and follow-up question.
- **`GET /assistant/conversations`**
  - **Auth Required:** Yes
- **`GET /assistant/conversations/:id`**
  - **Auth Required:** Yes

### 11. Advisory History
- **`GET /history?type=all&limit=50`**
  - **Auth Required:** Yes
- **`DELETE /history/:id`**
  - **Auth Required:** Yes

