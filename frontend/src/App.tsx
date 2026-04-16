import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Table from "./components/Table";
import Chapter from "./components/Chapter";
import PasswordGate from "./components/PasswordGate";

function App() {
	const [theme, setTheme] = useState<"dark" | "light">(
		() => (localStorage.getItem("theme") as "dark" | "light") || "dark",
	);

	useEffect(() => {
		document.documentElement.setAttribute("data-bs-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<PasswordGate>
			<nav
				className={`navbar navbar-expand fixed-top ${theme === "dark" ? "navbar-dark" : "navbar-light bg-light"} shadow`}
				style={{
					backgroundColor: theme === "dark" ? "#161616" : undefined,
				}}
			>
				<a className="navbar-brand ms-3" href="#">
					NPK Tool
				</a>
				<div className="d-flex align-items-center ms-auto me-3">
					<i className="bi bi-sun me-2"></i>
					<div className="form-check form-switch">
						<input
							className="form-check-input"
							type="checkbox"
							role="switch"
							id="themeSwitch"
							checked={theme === "dark"}
							onChange={() =>
								setTheme(theme === "dark" ? "light" : "dark")
							}
						/>
					</div>
					<i className="bi bi-moon ms-2"></i>
				</div>
			</nav>
			<div className="container-fluid" style={{ marginTop: "12vh" }}>
				<Routes>
					<Route index element={<Table />} />
					<Route path="chapters/:cid" element={<Chapter />} />
				</Routes>
			</div>
		</PasswordGate>
	);
}

export default App;
