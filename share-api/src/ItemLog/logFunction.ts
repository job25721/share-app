import { Types } from 'mongoose';
import { Log } from './dto/itemLog.model';

import { SHA256 } from 'crypto-js';

export function calculateHash(data: any): string {
  return SHA256(JSON.stringify(data)).toString();
}

export function createItemLog(
  actorId: Types.ObjectId | string,
  action: string,
): Log {
  const preHashData = {
    timestamp: new Date(Date.now()),
    actor: actorId,
    action,
  };
  const itemLogDetail: Log = {
    ...preHashData,
    hash: calculateHash(preHashData),
    prevHash: null,
  };
  return itemLogDetail;
}
