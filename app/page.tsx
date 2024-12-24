
import { CommunityCard } from "./communitycard/page"
import { PostCard } from "./post-card/page"
import { TrendCommunity } from "./TrendCommunity/page"

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* Posts Section */}
  <PostCard />

  {/* Sidebar Section */}
  <div className="space-y-6">
    {/* Top Communities Card */}
    <TrendCommunity />

    {/* Create a Community Card */}
    <CommunityCard />
    
  </div>
</div>

  )
}

