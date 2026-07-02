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
import { Job } from '@/types/Jobs'

const Jobs = ({ job }: { job: Job }) => {
    const router = useRouter()

    const handleClick = () => {
        router.push(`/ApplyJob/${job._id}`)
    }   

    return (
        <Card className="m-2 md:m-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6 transition-all hover:shadow-md">
            <CardHeader className="flex items-center gap-4 w-full md:w-auto">
                <Image src="/office-building.jpg" alt="Company Logo" width={60} height={60} className="md:w-[100px] md:h-[100px] shrink-0 rounded-md" />
                <div className="flex flex-col">
                    <CardTitle className="text-lg md:text-xl">{job.company}</CardTitle>
                    <p className="text-sm md:text-base text-muted-foreground">{job.location}</p>
                </div>
            </CardHeader>

            <CardContent className="w-full md:w-2/3 p-0 md:p-4 mt-2 md:mt-0">
                <h2 className="mb-2 md:mb-4 text-xl md:text-2xl font-semibold line-clamp-1">{job.title}</h2>
                <p className="text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-3">{job.description}</p>
            </CardContent>

            <CardFooter className="border-0 bg-transparent p-0 w-full md:w-auto flex justify-end mt-2 md:mt-0">
                <Button
                    onClick={handleClick}
                    className="w-full md:w-auto rounded-full bg-yellow text-black hover:bg-light_yellow font-medium px-6 py-2"
                >
                    Apply Now
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Jobs
