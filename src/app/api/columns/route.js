import dbConnect from '@/database/db';
import { headers } from 'next/headers';
import User from '@/database/models/userSchema';
import { NextResponse } from 'next/server';
import { getSessionUser } from '../utils';
import Column from '@/database/models/columnSchema';

const columns = [
  {
    title: 'Trending News',
    type: 'feed',
    size: 350,
    feedType: 'posts',
    columnType: 'getFeed',
    params: {
      feed: 'at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.feed.generator/news-2-0',
      limit: 50,
    },
  },
  {
    title: 'Search Posts',
    type: 'feed',
    size: 350,
    feedType: 'posts',
    columnType: 'searchPosts',
    params: {
      q: 'build in public',
    },
  },
  // {
  //   title: 'Search Posts',
  //   type: 'feed',
  //   size: 350,
  //   feedType: 'posts',
  //   columnType: 'searchPosts',
  //   params: {
  //     q: 'ai agents',
  //   },
  // },
];

const prepareDefaultColumns = async (userId) => {
  // const defaultColumns = columns.map((column) => ({
  //   ...column,
  //   userId,
  // }));
  // columns.forEach((column) => {
  for (let column of columns) {
    const newCol = await Column.findOne({
      userId,
      title: column.title,
      columnType: column.columnType,
    });
    if (!newCol) {
      Column.create({ ...column, userId });
    }
  }
  // return Column.create(defaultColumns);
};

export async function GET(request) {
  const user = await getSessionUser();
  // let columns = await Column.find({ userId: user.id }).lean();
  // if (columns.length === 0) {
  await prepareDefaultColumns(user.id);
  let columns = await Column.find({ userId: user.id }).lean();
  // }
  return NextResponse.json(columns);
}

export async function PUT(request) {
  const { columnId, update } = await request.json();
  const column = await Column.findByIdAndUpdate(columnId, update, {
    new: true,
  });
  return NextResponse.json(column);
}
