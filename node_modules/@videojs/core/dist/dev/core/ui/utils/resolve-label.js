import { isFunction } from "@videojs/utils/predicate";
//#region src/core/ui/utils/resolve-label.ts
function resolveLabel(label, state) {
	if (isFunction(label)) return label(state) || void 0;
	return label || void 0;
}
//#endregion
export { resolveLabel };

//# sourceMappingURL=resolve-label.js.map