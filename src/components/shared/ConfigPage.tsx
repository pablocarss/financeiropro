import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"

interface ConfigPageProps {
  title: string
  buttonLabel: string
  onNewItem: () => void
  children: React.ReactNode
}

export function ConfigPage({ title, buttonLabel, onNewItem, children }: ConfigPageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <Button 
          onClick={onNewItem}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {buttonLabel}
        </Button>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
