export default function Spinner({ message = "Loading..." }: { message?: string }) {
	return (
		<div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">{message}</span>
			</div>
			<span className="ms-2">{message}</span>
		</div>
	);
}
