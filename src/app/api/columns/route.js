import dbConnect from '@/database/db';
import { headers } from 'next/headers';
import User from '@/database/models/userSchema';
import { NextResponse } from 'next/server';
import { getSessionUser } from '../utils';
import Column from '@/database/models/columnSchema';
import { createColumns } from '@/database/utils/column.utils';

const columns = [
  {
    title: 'Trending News',
    type: 'feed',
    size: 450,
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
    size: 450,
    feedType: 'posts',
    columnType: 'searchPosts',
    params: {
      query: 'build in public',
    },
  },
  {
    title: 'Posts with Hashtag',
    type: 'feed',
    size: 450,
    feedType: 'posts',
    columnType: 'hashtagPosts',
    params: {
      tags: ['indiehacking'],
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
  let columnPosition = 1;
  for (let column of columns) {
    const newCol = await Column.findOne({
      userId,
      title: column.title,
      columnType: column.columnType,
    });
    if (!newCol) {
      await Column.create({ ...column, userId, columnPosition });
      columnPosition++;
    }
  }
};

const getColumnName = (column) => {
  switch (column.columnType) {
    case 'searchPosts':
      return `${column._id}-${column.title}-${column.params?.query}`;
    case 'hashtagPosts':
      return `${column._id}-${column.title}-${column.params?.tags.join('_')}`;
    default:
      return `${column._id}-${column.title}`;
  }
};

export async function GET(request) {
  const user = await getSessionUser();
  let columns = await Column.find({ userId: user.id }).lean();
  if (columns.length === 0) {
    await prepareDefaultColumns(user.id);
  }
  columns = (
    await Column.find({ userId: user.id }).sort({ columnPosition: 1 })
  ).map((column) => ({
    ...column._doc,
    columnName: getColumnName(column),
  }));
  return NextResponse.json(columns);
}

export async function PUT(request) {
  const { columnId, update } = await request.json();
  const column = await Column.findByIdAndUpdate(columnId, update, {
    new: true,
  });
  return NextResponse.json(column);
}

export async function POST(request) {
  const user = await getSessionUser();
  const { column } = await request.json();
  const newColumn = await Column.create({ ...column, userId: user.id });
  return NextResponse.json(newColumn);
}

export async function DELETE(request) {
  // query params
  const columnId = request.nextUrl.searchParams.get('columnId');
  console.log('columnId', columnId);
  await Column.findByIdAndDelete(columnId);
  return NextResponse.json({ message: 'Column deleted' });
}
