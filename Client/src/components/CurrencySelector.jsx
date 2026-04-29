import { useCurrency } from "../context/CurrencyContext";
import useCurrencyData from "../hooks/useCurrencyData";

const CurrencySelector = () => {
	const { currency, setCurrency } = useCurrency();
	const { currencyData, loading, error } = useCurrencyData();

	const selectedValue = Array.isArray(currency) ? currency[0] : "USD";
	const rates = currencyData?.rates || {};
	const currencies = [
		"USD",
		...Object.keys(rates)
			.filter((c) => c !== "USD")
			.sort(),
	];

	const handleChange = (e) => {
		const code = e.target.value;
		const rate = code === "USD" ? 1 : rates[code] || 1;

		setCurrency([code, rate]);
	};

	return (
		<div className="flex flex-col gap-1">
			<select
				className="bg-white border border-gray-300 text-sm text-gray-600 font-semibold py-1.5 px-3 rounded-md shadow-sm cursor-pointer focus:outline-none"
				value={selectedValue}
				onChange={handleChange}
				disabled={false}
			>
				{currencies.map((currencyName) => (
					<option key={currencyName} value={currencyName}>
						{currencyName}
					</option>
				))}
			</select>

			{error && (
				<p className="text-red-500 text-xs">
					Failed to load currencies: {error}
				</p>
			)}
		</div>
	);
};

export default CurrencySelector;