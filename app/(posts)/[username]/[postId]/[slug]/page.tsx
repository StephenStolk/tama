import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Post from "@/models/post.model";

interface PostPageProps {
  params: {
    username: string;
    postId: string;
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  await connectToDatabase(); // Ensure database connection

  const { username, postId, slug } = params; // No need to await params

  try {
    // Fetch post and populate the author field
    const post = await Post.findById(postId).populate("author");

    if (!post) {
      console.error("Post not found in database.");
      return notFound();
    }

    
    console.log("[Server] Retrieved Post:", post); // Debugging log

    // Debugging individual values
    console.log("[Server] Expected Slug:", post.slug, "Got:", slug);
    console.log("[Server] Expected Author:", post.author?.username, "Got:", username);

    if (post.slug !== slug) {
      console.error(`Slug mismatch: Expected ${post.slug}, Got ${slug}`);
      return notFound();
    }

    if (!post.author || post.author.username !== username) {
      console.error(`Username mismatch: Expected ${post.author?.username}, Got ${username}`);
      return notFound();
    }

    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>Author: {post.author.username}</p>
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    return notFound();
  }
}
