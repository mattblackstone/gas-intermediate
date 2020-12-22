function getSheetData(sheetName?: string) {
  const sheet = sheetName 
    ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
    : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data;
}

function getSheetNames() {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  return sheets.map(sheet => sheet.getName());
}

function writeColumnCombos(opts: {src?: string, dest: string, header?: boolean}) {
  const sheetData = opts.src ? getSheetData(opts.src) : getSheetData();
  const destSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(opts.dest);
  if (opts.header) {
    const headerRow = sheetData.slice(0, 1);
    const combos = combinations(rowsToColumnsFlat(sheetData.slice(1)));
    writeData(headerRow.concat(combos), destSheet);
  } else {
    const columns = rowsToColumnsFlat(sheetData);
    const columnGroups = arraySplit(columns, x => x.length === 0);
    const flattened = ensureArray2d(columnGroups, rotateAndJoin);
    writeData(combinations(flattened), destSheet);
  }
}

function rowsToColumns(arr2d: any[][]) {
  const longest = arr2d.reduce((maxI, el, i, arr) => (el.length > arr[maxI].length) ? i : maxI, 0);
  return arr2d[longest].map((x, i) => arr2d.map(x => x[i]));
}

function rowsToColumnsFlat(arr2d: any[][]) {
  const maxLen = arr2d.reduce((a, c) => Math.max(a, c.length), 0);
  const transposed = Array.from(Array(maxLen), () => []);
  arr2d.forEach((row, i) => {
    for (let j = 0; j < maxLen; j++) {
      if (row[j]) transposed[j].push(row[j]);
    }
  });
  return transposed;
}

function writeData(data: any[][], destination: any, startRow: number = 1, startCol: number = 1) {
  const numColumns = data[0].length; // assumes data is uniform
  const numRows = data.length;
  const dest = destination || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  dest.getRange(startCol, startRow, numRows, numColumns).setValues(data);
}

function writeSheetData() {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = activeSheet.getDataRange();
  activeSheet.getRange(
    dataRange.getNumRows() + 1,
    dataRange.getColumn(),
    dataRange.getNumRows() - 1,
    dataRange.getNumColumns()
  ).setValues(dataRange.getValues().slice(1));
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Custom Scripts')
    .addItem('Write Sheet Data', 'writeSheetData')
    .addItem('Set preferred name', 'showPrompt')
    .addItem('Show sidebar', 'showSidebar')
    .addToUi();
  const preferredName: string = getUserName();
  if (preferredName) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(`Welcome back ${preferredName}!`);
  }
}

function showPrompt() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Let\'s get to know each other!',
    'Please enter your preferred name:',
    ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  const button = result.getSelectedButton();
  const name = result.getResponseText();
  if (button == ui.Button.OK) {
    setUserName(name);
    ui.alert(`Your preferred name is ${name}.`); // User clicked "OK".
  } else if (button == ui.Button.CANCEL) {
    ui.alert('I didn\'t get your name.'); // User clicked "Cancel".
  } else if (button == ui.Button.CLOSE) {
    ui.alert('You closed the dialog.'); // User clicked X in the title bar.
  }
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('My custom sidebar');
  SpreadsheetApp.getUi().showSidebar(html); // Or DocumentApp or SlidesApp or FormApp.
}

function combinations(arr2d:any[][]) {
  const r = [];
  const af = arr2d.filter(x => x.length > 0); // no blank arrays allowed
  const max = af.length - 1;

  function helper(arr:any[], i:number) {
    for (let j = 0, l = af[i].length; j < l; j++) {
      const a = arr.slice(0);
      a.push(af[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

function setUserName(name: string) {
  PropertiesService.getUserProperties().setProperty('PREFERRED_NAME', name);
}

function getUserName() {
  return PropertiesService.getUserProperties().getProperty('PREFERRED_NAME');
}

function arraySplit(arr: any[], condition: Function) {
  const result = [];
  let i = 0;
  arr.forEach(x => condition(x) ? i++ : result[i] ? result[i].push(x) : result[i] = [x]);
  return result;
}

function ensureArray2d(arr: any[][], action: Function) {
  const arr2d = arr.slice();
  arr2d.forEach((x, i) => (x.length > 1)
    ? arr2d[i] = action(x)
    : arr2d[i] = x[0]);
  return arr2d;
}

function rotateAndJoin(arr: any[], str: string = ', ') {
  return rowsToColumnsFlat(arr).map(x => x.join(str));
}

// LOCAL TESTING ONLY

const testData = [
  ["TASK", "", "FIRST NAME", "NICKNAME", "TITLE", "", "DAY"],
  ["automation", "", "Matthew", "Matt", "Tech Dir", "", "Mon"],
  ["front-end", "", "Jorge", "Chorch", "Tech Lead", "", "Tue"],
  ["", "", "Agustín", "Agus", "Sr Creative Tech", "", "Wed"],
  ["", "", "", "", "", "", "Thu"],
  ["", "", "", "", "", "", "Fri"]
];

const columns = rowsToColumnsFlat(testData.slice(1));
console.log(columns);
const columnGroups = arraySplit(columns, x => x.length === 0);
console.log(columnGroups);
const flattened = ensureArray2d(columnGroups, rotateAndJoin);
console.log(combinations(flattened));