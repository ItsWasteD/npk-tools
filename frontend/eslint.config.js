import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			eslintConfigPrettier,
		],
		plugins: { react, eslintPluginPrettier },
		languageOptions: {
			parser: tseslint.parser,
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			"prettier/prettier": [
				"error",
				{
					semi: false,
					singleQuote: true,
					trailingComma: "all",
					printWidth: 100,
				},
			],
			"react/react-in-jsx-scope": "off",
		},
	},
]);
