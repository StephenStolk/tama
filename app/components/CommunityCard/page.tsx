"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const CommunityCard:React.FC = () => {
    return(
        <>
        <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold sm:text-xl">Create a Community</h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground sm:text-base">
          Create your own Reddit community
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <a href="/create-community">Create Community</a>
        </Button>
      </CardFooter>
    </Card>
        </>
    )
}