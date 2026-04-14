import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Table from "./components/Table";
import Chapter from "./components/Chapter";
import PasswordGate from "./components/PasswordGate";

function App() {
	const navigate = useNavigate();

	return (
		<PasswordGate>
			<div className="container-fluid">
				<h1
					className="display-4 text-center"
					onClick={() => navigate(`/`)}
				>
					NPK Tool
				</h1>
				<Routes>
					<Route index element={<Table />} />
					<Route path="chapters/:cid" element={<Chapter />} />
				</Routes>
			</div>
		</PasswordGate>
	);
}

export default App;
