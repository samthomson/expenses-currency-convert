import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parser'

type Expense = {
	Date: string
	Type: string
	Category: string

	Subcategory: string
	Vendor: string
	Payment: string

	Currency: string
	Amount: string
	Note: string
}

const readInExpenses = async ():Promise<Expense[]> => {

	const filePath = path.resolve('/app/data/csvin.csv')
	if (!fs.existsSync(filePath)) {
		console.error(`file '${filePath}' does not exist`)
		return []
	}

	const expenses: Expense[] = []
	return new Promise<Expense[]>(resolve => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (data: Expense) => {
				expenses.push(data)
			})
			.on('end', () => {
				resolve(expenses)
			})
	})
}


const main = async (): Promise<void> => {
	
	// check env vars are set
	const { NEW_CURRENCY_MULTIPLIER, NEW_CURRENCY_CODE, CSV_PATH } = process.env
	if (!NEW_CURRENCY_CODE || !NEW_CURRENCY_MULTIPLIER || !CSV_PATH) {
		console.log('env vars must be set')
		return
	}

	// read in expense csv
	const expenses = await readInExpenses()
	console.log(expenses)

	// todo: convert all expense values

	// todo: update all currency used values

	// todo: save as new csv
}

main() 