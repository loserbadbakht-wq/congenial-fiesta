import { interpolate } from "./utils/interpolate.js";
import { resolveText } from "./resolve-text.js";
//#region src/core/i18n/translate-text.ts
function translateText(text, translatorOrParams, params) {
	if (typeof text === "string") return text;
	if (typeof translatorOrParams === "function") return translatorOrParams(text, params);
	return interpolate(resolveText(text), translatorOrParams ?? params);
}
//#endregion
export { translateText };

//# sourceMappingURL=translate-text.js.map