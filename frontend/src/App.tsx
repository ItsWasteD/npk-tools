import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Table from "./components/Table";
import Chapter from "./components/Chapter";

function App() {
	return (
		<div className="container-fluid">
			<h1 className="display-4 text-center">NPK Tool</h1>
			<BrowserRouter basename={import.meta.env.BASE_URL}>
				<Routes>
					<Route index element={<Table />} />
					<Route path="chapters/:cid" element={<Chapter />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
