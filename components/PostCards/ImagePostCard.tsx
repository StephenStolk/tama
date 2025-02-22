import React from "react";
import Image from "next/image";

interface ImagePostProps {
  post: {
    title: string;
    imageUrl: string;
    author: string;
    slug: string;
    tags: string[];
    createdAt: string;
  };
}

const ImagePostCard: React.FC<ImagePostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="text-sm font-medium text-black">#{tag}</span>
            ))}
          </div>
        )}
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <Image
  src={post.imageUrl}
  alt={post.title}
  layout="responsive"
  width={16} // Aspect ratio width
  height={9} // Aspect ratio height
  className="rounded-lg"
/>

      <p className="text-sm text-gray-500 mt-2">
        Posted by {post.author} • {new Date(post.createdAt).toLocaleString()}
      </p>
      
    </div>
  );
};

export default ImagePostCard;
