var spreadsheetId = "1bDAW6TO7jOuxSoWHrpr6Gc3-97HDrbeVa-FXe0EYKQ0";

function doGet(e)
{
  try
  {
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(e.parameter["sheet"]);
    
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
    var row = e.parameter["row"];
    var col = e.parameter["col"];
    var noOfRows = e.parameter["noOfRows"];
    var noOfCols = e.parameter["noOfCols"];
    
    if ((row==null)||(row<1))
    {
      row = 1;
    }
    if ((col==null)||(col<1))
    {
      col = 1;
    }

    if ((noOfRows==null)||(noOfRows<1))
    {
      noOfRows = sheet.getLastRow();
    }

    if ((noOfCols==null)||(noOfCols<1))
    {
      noOfCols = sheet.getLastColumn();
    }
    
    var data = sheet.getRange(row,col,noOfRows,noOfCols).getValues();
    
    // return json success results
    return ContentService
      .createTextOutput(JSON.stringify({"result":"success","data": data}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch(e)
  {
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  }
  finally
  { //release lock
    lock.releaseLock();
  }
}

function doPost(e)
{
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

  try
  {
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(e.parameter["sheet"]);
    
    //row 1 is the header
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    var rowToInsert = e.parameter["row"];//check if post data contains row
    if ((rowToInsert==null)||(rowToInsert<2))//a valid row to insert
    {
      rowToInsert = sheet.getLastRow()+1; // get next row
    }
    
    var row = [];
    // loop through the header columns
    for (i in headers)
    {
      row.push(e.parameter[headers[i]]);
    }
    
    // more efficient to set values as [][] array than individually
    sheet.getRange(rowToInsert, 1, 1, row.length).setValues([row]);
    
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": row}))
          .setMimeType(ContentService.MimeType.JSON);
  }
  catch(e)
  {
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  }
  finally
  { //release lock
    lock.releaseLock();
  }
}