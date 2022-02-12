import * as fs from 'fs'
import * as path from 'path'
import * as csv from 'csv-parser'
import { Parser as Json2csvParser } from 'json2csv'

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

const convertExpenses = (inputExpenses: Expense[]): Expense[] => {
	const { NEW_CURRENCY_CODE, NEW_CURRENCY_MULTIPLIER } = process.env
	return inputExpenses.map(expense => {

		// parse to use decimal place and make numeric
		const originalAmount = +(expense.Amount).replace('.', '').replace(',', '.')

		if (isNaN(originalAmount)) {
			console.error('expense invalid', expense)
		}

		const exchangeRate = +NEW_CURRENCY_MULTIPLIER

		const newAmount = originalAmount * exchangeRate

		const conversionNote = `DKK: ${expense.Amount} DKK\nExchange rate: ${exchangeRate}\n`

		const newNote = conversionNote + expense.Note
		
		return {
			...expense,
			Currency: NEW_CURRENCY_CODE,
			Amount: newAmount.toFixed(2).toString().replace('.', ','),
			Note: newNote
		}
	})
}

const saveExpensesToCSV = async (expenses: Expense[]) => {

	const json2csvParser = new Json2csvParser()
	const csv = json2csvParser.parse(expenses)

	fs.writeFileSync(path.resolve('/app/data/csvout.csv'), csv)
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

	// convert all expense values and update used values
	const convertedExpenses = convertExpenses(expenses)
	// console.log(convertedExpenses)

	// save as new csv
	saveExpensesToCSV(convertedExpenses)
}

main() 