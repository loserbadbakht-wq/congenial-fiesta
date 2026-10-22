//#region src/core/i18n/utils/interpolate.ts
const PLACEHOLDER = /\{([^{}]+)\}/g;
function interpolate(template, params) {
	if (!params) return template;
	return template.replace(PLACEHOLDER, (match, name) => {
		return Object.hasOwn(params, name) ? String(params[name]) : match;
	});
}
//#endregion
export { interpolate };

//# sourceMappingURL=interpolate.js.map