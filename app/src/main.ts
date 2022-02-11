const main = async (): Promise<void> => {
	
	// check env vars are set
	const { NEW_CURRENCY_MULTIPLIER, NEW_CURRENCY_CODE } = process.env
	if (!NEW_CURRENCY_CODE || !NEW_CURRENCY_MULTIPLIER) {
		console.log('env vars must be set')
		return
	}

	// read in expense csv

	// convert all expense values

	// update all currency used values

	// save as new csv
}

main() 