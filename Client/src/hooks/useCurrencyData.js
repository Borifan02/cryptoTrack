import { useState, useEffect } from "react";
import { FRANKFURTER_API } from "../constants";

export default function useCurrencyData() {
	const [currencyData, setCurrencyData] = useState({ rates: {} });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function getCurrency() {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch(FRANKFURTER_API);

				if (!res.ok) {
					throw new Error(`HTTP error: ${res.status}`);
				}

				const data = await res.json();

				// Validate structure
				if (!data || typeof data !== "object" || !data.rates) {
					throw new Error("Invalid currency data format");
				}

				if (isMounted) {
					setCurrencyData(data);
				}
			} catch (err) {
				if (isMounted) {
					setError(err?.message || "Failed to fetch currency data");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		getCurrency();

		return () => {
			isMounted = false;
		};
	}, []);

	return {
		currencyData,
		loading,
		error,
	};
}