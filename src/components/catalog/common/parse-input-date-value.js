// converts YYYY(-MM(-DD)) to Date.UTC timestamp
export default function parseUtcTimestamp (value) {
	if (!value) {
		return NaN
	}

	const args = value.split('-')

	if (args.length === 0)
		return ''

	if (args.length > 1)
		args[1] = args[1] - 1

	if (args.length === 1)
		return Date.UTC.apply(Date, [args[0], 0, 1])

	if (args.length === 2)
		return Date.UTC.apply(Date, args.concat(1))

	return Date.UTC.apply(Date, args)
}
