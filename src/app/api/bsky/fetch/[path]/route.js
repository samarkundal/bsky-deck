import bskyDataService from "@/app/api/bsky.data";
import { getSessionUser } from "@/app/api/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await getSessionUser();
  const path = req.nextUrl.pathname.split('/').pop();
  const searchParams = new URLSearchParams(req.nextUrl.searchParams);
  switch(path) {
    case 'trendingNews':
      return NextResponse.json(await bskyDataService.getTrendingNews());
    case 'searchPosts':
      const query = searchParams.get('query');
      return NextResponse.json(await bskyDataService.searchPosts({ query }));
    case 'profilePosts':
      const actors = Array.from(searchParams.values());
      return NextResponse.json(await bskyDataService.getProfilePosts({ actors }));
    case 'userFeeds':
      const feed = searchParams.get('feed');
      const account = user.account;
      return NextResponse.json(await bskyDataService.getUserFeed({ feed, account }));
    default:
      return NextResponse.json({ error: 'Invalid path' });
  }

  return NextResponse.json(path);
}