"use client"

import React from 'react'
import { TrendCommunity } from '../bottombar/TrendCommunity/page'
import { CommunityCard
 } from '../communitycard/page'

const RightbarWrapper:React.FC = () => {
  return (
    <>
    <div className="hidden lg:block fixed top-20 right-4 w-1/5 h-[calc(100vh-6rem)] overflow-auto no-scrollbar p-4 bg-gray-100 rounded-lg">
        <div className="space-y-6">
          {/* Top Communities Card */}
          <TrendCommunity />

          {/* Create a Community Card */}
          <CommunityCard />
        </div>
      </div>
    </>
  )
}

export default RightbarWrapper