import Account from "@/database/models/accountSchema";
import { getSessionUser } from "../utils";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await getSessionUser();
  const accounts = await Account.find({ userId: user._id });
  const list = accounts.map((account) => {
    return {
      _id: account._id,
      handle: account.handle,
      avatar: account.avatar,
      did: account.did,
      displayName: account.displayName,
      currentlyActive: account.currentlyActive,
    };
  });
  return NextResponse.json(list);
}
