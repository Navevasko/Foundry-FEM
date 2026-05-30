export function activateFieldAutosave(sheet, html, document) {
  html.find("input[name], select[name], textarea[name]").on("change", async (event) => {
    await saveChangedField(document, event.currentTarget);
  });

  const root = html[0] ?? html;
  root.querySelectorAll("input[name], select[name], textarea[name]").forEach((field) => {
    field.addEventListener("change", (event) => saveChangedField(document, event.currentTarget));
    field.addEventListener("focusout", (event) => saveChangedField(document, event.currentTarget));
  });
}

export async function updateDocumentFromForm(document, formData) {
  const updateData = formData instanceof FormData ? formDataToUpdateData(formData) : flattenUpdateData(formData);
  return document.update(updateData);
}

export async function saveFieldFromEvent(document, event) {
  const field = event?.currentTarget;
  if (!field?.name) return;
  return saveChangedField(document, field);
}

async function saveChangedField(document, field) {
  const name = field.name;
  if (!name) return;

  const updateData = { [name]: fieldValue(field) };
  await document.update(updateData);
}

function fieldValue(field) {
  if (field.type === "checkbox") return field.checked;
  if (field.type === "number") return field.value === "" ? 0 : Number(field.value);
  return field.value;
}

function formDataToUpdateData(formData) {
  const updateData = {};
  for (const [key, value] of formData.entries()) updateData[key] = value;
  return updateData;
}

function flattenUpdateData(data, prefix = "") {
  if (!data || typeof data !== "object" || data instanceof File) return data;

  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(updateData, flattenUpdateData(value, path));
    } else {
      updateData[path] = value;
    }
  }
  return updateData;
}
