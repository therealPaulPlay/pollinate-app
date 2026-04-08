import { setContext, } from "svelte";

export const THEMES = { light: "", dark: ".dark" } ;

const chartContextKey = Symbol("chart-context");

export function setChartContext(value) {
	return setContext(chartContextKey, value);
}