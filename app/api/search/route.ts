import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";
import Image from "@/models/image.model";
import Video from "@/models/video.model";
import Poll from "@/models/poll.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const tag = searchParams.get("tag") || "";

    if (!query && !tag) {
      return NextResponse.json({ error: "Query or tag parameter is required" }, { status: 400 });
    }

    
    if (query) {
      let searchFilter = {};

      if (query.startsWith("#")) {
        const tag = query.slice(1); // Remove "#" and search by tag
        searchFilter = { tags: { $regex: tag, $options: "i" } };
      } else {
        searchFilter = { title: { $regex: query, $options: "i" } };
      }

      // Fetch distinct tags from all models concurrently
      const [postTags, imageTags, videoTags, pollTags] = await Promise.all([
        Post.distinct("tags", searchFilter),
        Image.distinct("tags", searchFilter),
        Video.distinct("tags", searchFilter),
        Poll.distinct("tags", searchFilter),
      ]);

      const parseTag = (val: string) => {
        if (val.startsWith("[") && val.endsWith("]")) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
          } catch (error) {
            console.error("Error parsing tag:", error);
          }
        }
        return val;
      };


      const processTags = (tags: any[]) =>
        tags.flatMap((tag) => {
          try {
            return JSON.parse(tag); // Handle JSON-encoded arrays
          } catch {
            return tag;
          }
        });
      // Merge all tags and get unique tags
      
      const uniqueTags = [
        ...new Set([
          ...processTags(postTags),
          ...processTags(imageTags),
          ...processTags(videoTags),
          ...processTags(pollTags),
        ]),
      ];

      return NextResponse.json({ results: uniqueTags }, { status: 200 });
    }

    if (tag) {
      const cleanTag = tag.replace("#", "");

      const searchFilter = {
        $or: [
          { tags: { $regex: cleanTag, $options: "i" } }, // ✅ Flexible search
          { tags: { $in: [cleanTag] } }, // ✅ Exact match (for stored arrays)
        ],
      };


      //const searchFilter = { tags: { $regex: tag.replace("#", ""), $options: "i" } }; // Remove '#' from tag

      const [posts, images, videos, polls] = await Promise.all([
        Post.find(searchFilter).lean(),
        Image.find(searchFilter).lean(),
        Video.find(searchFilter).lean(),
        Poll.find(searchFilter).lean(),
      ]);

      const combinedPosts = [...posts, ...images, ...videos, ...polls];

      console.log("Returning posts for tag:", tag, combinedPosts); 

      return NextResponse.json({ posts: combinedPosts }, { status: 200 });
    }


  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
