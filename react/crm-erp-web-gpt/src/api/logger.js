import { dbLoad, dbSave } from './mockDb.js';
import { uid } from '../utils/id.js';

export function writeLog({ module, action, detail, userId }) {
  const db = dbLoad();
  db.logs = db.logs || [];
  db.logs.unshift({
    id: uid('log'),
    time: new Date().toISOString(),
    module,
    action,
    detail,
    userId
  });
  dbSave(db);
}
