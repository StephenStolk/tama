"use client"

import React from 'react'
import { TrendCommunity } from '../TrendCommunity/page'
import { CommunityCard
 } from '../communitycard/page'

const RightbarWrapper:React.FC = () => {
  return (
    <>
    <div className="hidden lg:block top-16 fixed right-4 w-1/5 overflow-auto no-scrollbar p-4 bg-gray-100 rounded-lg">
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