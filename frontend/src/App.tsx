import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Table from "./components/Table";
import Chapter from "./components/Chapter";
import PasswordGate from "./components/PasswordGate";

function App() {
	return (
		<PasswordGate>
			<div className="container-fluid">
				<h1 className="display-4 text-center">NPK Tool</h1>
				<HashRouter>
					<Routes>
						<Route index element={<Table />} />
						<Route path="chapters/:cid" element={<Chapter />} />
					</Routes>
				</HashRouter>
			</div>
		</PasswordGate>
	);
}

export default App;
