// ================================================
// BACKEND ADUAN DESA SEPADU
// Tempel kode ini di Google Apps Script yang terhubung
// ke Google Sheets. Sesuaikan nama sheet bila perlu.
// ================================================

const SHEET_NAME = 'Sheet1';

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function ensureHeaders_(sheet) {
  const wanted = ['timestamp','id','nama','kategori','judul','isi_aduan','status','jawaban'];
  const lastCol = sheet.getLastColumn();
  const current = lastCol ? sheet.getRange(1,1,1,lastCol).getValues()[0].map(String) : [];
  if (!current.length || current.every(h => !h.trim())) {
    sheet.getRange(1,1,1,wanted.length).setValues([wanted]);
    return wanted;
  }
  const lower = current.map(h => h.trim().toLowerCase());
  wanted.forEach(h => { if (!lower.includes(h)) { sheet.getRange(1, sheet.getLastColumn()+1).setValue(h); lower.push(h); current.push(h); } });
  return current;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    const headers = ensureHeaders_(sheet);
    const action = data.action || 'submit';

    if (action === 'submit') {
      const row = headers.map(h => {
        const key = h.trim().toLowerCase();
        if (key === 'timestamp') return new Date();
        if (key === 'id') return data.id || ('ADUAN-' + Date.now());
        if (key === 'nama') return data.nama || '';
        if (key === 'kategori') return data.kategori || '';
        if (key === 'judul') return data.judul || '';
        if (key === 'isi_aduan') return data.isi_aduan || '';
        if (key === 'status') return 'Menunggu';
        if (key === 'jawaban') return '';
        return '';
      });
      sheet.appendRow(row);
      return json_({status:'success', message:'Aduan berhasil disimpan'});
    }

    if (action === 'answer') {
      const idCol = headers.findIndex(h => h.trim().toLowerCase() === 'id') + 1;
      const answerCol = headers.findIndex(h => h.trim().toLowerCase() === 'jawaban') + 1;
      const statusCol = headers.findIndex(h => h.trim().toLowerCase() === 'status') + 1;
      if (!idCol || !answerCol || !statusCol) throw new Error('Kolom ID, jawaban, atau status tidak ditemukan.');
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) throw new Error('Belum ada data aduan.');
      const ids = sheet.getRange(2,idCol,lastRow-1,1).getValues().flat().map(String);
      const pos = ids.indexOf(String(data.id || ''));
      if (pos < 0) throw new Error('ID aduan tidak ditemukan: ' + data.id);
      const rowNumber = pos + 2;
      sheet.getRange(rowNumber, answerCol).setValue(data.jawaban || '');
      sheet.getRange(rowNumber, statusCol).setValue(data.status || 'Dijawab');
      return json_({status:'success', message:'Jawaban berhasil disimpan'});
    }

    throw new Error('Action tidak dikenal.');
  } catch (err) {
    return json_({status:'error', message:String(err)});
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
