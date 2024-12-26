"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const TrendCommunity:React.FC = () => {
    return(
        <>
        <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold sm:text-xl">Top Communities</h2>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {[1, 2, 3, 4, 5].map((community) => (
            <li key={community} className="flex items-center justify-between">
              <span className="text-sm font-medium sm:text-base">r/community{community}</span>
              <Button variant="outline" size="sm">
                Join
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All
        </Button>
      </CardFooter>
    </Card>

        </>
    )
}