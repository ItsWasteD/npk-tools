import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Table from "./components/Table";

function App() {
	return (
		<div className="container-fluid">
			<h1 className="display-2 text-center">NPK Tool</h1>
			<BrowserRouter basename={import.meta.env.BASE_URL}>
				<Routes>
					<Route index element={<Table />} />
					<Route path="chapters/:cid" element={"gagi"} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
