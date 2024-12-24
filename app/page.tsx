
import { CommunityCard } from "./components/CommunityCard/page"
import { PostCard } from "./components/Post-Card/page"
import { TrendCommunity } from "./components/TrendCommunity/page"

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

