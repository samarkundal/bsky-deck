import Column from '@/database/models/columnSchema';
import { NextResponse } from 'next/server';
import { getSessionUser } from '../../utils';

export async function POST(request) {
  const user = await getSessionUser();
  const { columnId, columnPosition } = await request.json();
  Column.updateMany(
    { userId: user.id, columnPosition: { $gte: columnPosition } },
    { $inc: { columnPosition: 1 } }
  );
  Column.updateOne({ _id: columnId }, { $set: { columnPosition } });
  return NextResponse.json({ success: true });
}
