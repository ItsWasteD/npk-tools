import React, { useState, type ReactNode } from "react";

export default function PasswordGate({ children }: { children: ReactNode }) {
	const [password, setPassword] = useState("");
	const [authenticated, setAuthenticated] = useState(import.meta.env.DEV);
	const [error, setError] = useState("");

	// Get the expected hash from environment variable or fallback
	const expectedHash =
		"fabbda8bd40823be61166d259a79be8e12895d97cb7a3bb4a7f9dd523bf19a0d"; // Replace with actual hash

	const hashPassword = async (pwd: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(pwd);
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const hashed = await hashPassword(password);
		if (hashed === expectedHash) {
			setAuthenticated(true);
		} else {
			setError("Incorrect password");
			setPassword("");
		}
	};

	if (authenticated) {
		return <>{children}</>;
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
				<h2>Enter Password</h2>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button type="submit">Submit</button>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</form>
		</div>
	);
}
