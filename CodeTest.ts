function logActiveSheetData() {
  Logger.log(`active sheet data:\n${JSON.stringify(getSheetData())}`);
}
  
function logColumnCombos() {
  const data = getSheetData();
  const columns = rowsToColumnsFlat(data.slice(1));
  Logger.log(`header row:\n${JSON.stringify(data.slice(0, 1))}`);
  Logger.log(`data (rows)\n${JSON.stringify(data.slice(1))}`);
  Logger.log(`data (columns)\n${JSON.stringify(columns)}`);
  Logger.log(`column combinations:\n${JSON.stringify(combinations(columns))}`);
}

function logSheetNames() {
  Logger.log(`sheet names:\n${JSON.stringify(getSheetNames())}`);
}

function testWriteColumnCombos() {
  // write data from Sheet1 to Sheet3 assuming row 1 in Sheet1 is a header row
  writeColumnCombos({src: 'Sheet1', dest: 'Sheet3', header: true});
}