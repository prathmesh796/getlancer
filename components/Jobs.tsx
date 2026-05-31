import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const Jobs = ({ job }) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/ApplyJob/${job._id}`)
    }

    return (
        <Card className="m-4 flex-row items-center justify-between gap-4 p-4 md:flex">
            <div className="flex items-center gap-4">
                <Image src="/office-building.jpg" alt="Company Logo" width={100} height={100} />
                <div className="flex flex-col">
                    <CardTitle className="text-xl">{job.company}</CardTitle>
                    <p className="text-muted-foreground">{job.location}</p>
                </div>
            </div>

            <CardContent className="w-2/3 p-4">
                <h2 className="mb-4 text-2xl font-semibold">{job.title}</h2>
                <p className="text-muted-foreground">{job.description}</p>
            </CardContent>

            <CardFooter className="border-0 bg-transparent p-0">
                <Button
                    onClick={handleClick}
                    className="rounded-full bg-yellow text-black hover:bg-light_yellow"
                >
                    Apply Now
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Jobs
