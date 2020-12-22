function logActiveSheetData() {
  Logger.log('active sheet data (rowStart = 2):');
  Logger.log(getSheetData());
}
  
function logColumnCombos() {
  const data = getSheetData();
  const columns = rowsToColumnsFlat(data.slice(1));
  Logger.log('header row:');
  Logger.log(data.slice(0, 1));
  Logger.log('data (rows):');
  Logger.log(data.slice(1));
  Logger.log('data (columns):');
  Logger.log(columns);
  Logger.log('column combinations:');
  Logger.log(combinations(columns));
}

function logSheetNames() {
  Logger.log(`sheet names: ${getSheetNames()}`);
}

function testWriteColumnCombos() {
  // write data from Sheet1 to Sheet3 assuming row 1 in Sheet1 is a header row
  writeColumnCombos({src: 'Sheet1', dest: 'Sheet3', header: true});
}