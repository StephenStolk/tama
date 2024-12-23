import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share } from 'lucide-react'

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {[1, 2, 3].map((post) => (
          <Card key={post}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar>
                <AvatarImage src={`/placeholder-user-${post}.jpg`} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">u/username{post}</p>
                <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Post Title {post}</h2>
              <p>This is the content of post {post}. It can be quite long and detailed.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <ArrowBigUp className="h-5 w-5" />
                </Button>
                <span>42</span>
                <Button variant="ghost" size="icon">
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>23 Comments</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Share className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Top Communities</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((community) => (
                <li key={community} className="flex items-center space-x-2">
                  <span className="font-medium">r/community{community}</span>
                  <Button variant="outline" size="sm">Join</Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Create a Community</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Create your own Reddit community</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/create-community">Create Community</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

